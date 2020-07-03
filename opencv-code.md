# Clean Up Temporary Movie Files
try:
    os.remove("pls_delete.mp4")
    os.remove("pls_delete.mpeg")
    os.remove("pls_delete.wav")
    os.remove("pls_delete_play.mp4")
except FileNotFoundError:
    print("Downloading Videos...")
else:
    print("RM. Downloading Videos...")


#@title # Step 2: Video Processing

# For Progress Tracking 
print("Starting time: {}".format(datetime.now()))
start_time = time.time()

# Create a VideoCapture object
cap = cv2.VideoCapture('mimosa_400x.mov')
arr = []
no_of_frame = 0
no_of_frames_to_process = (int(cap.get(cv2.CAP_PROP_FRAME_COUNT))-4)
duration_of_video_s = (int(cap.get(cv2.CAP_PROP_FRAME_COUNT)))/30
print('this is the duration: ', duration_of_video_s)

# Capture several frames to allow the camera's autoexposure to # adjust.
for i in range(3):
    success, frame = cap.read() 
if not success:
    exit(1)

# Default resolutions of the frame are obtained and casted to int.
frame_width = int(cap.get(3))
frame_height = int(cap.get(4))

# Create the KNN background subtractor.
bg_subtractor = cv2.createBackgroundSubtractorKNN(detectShadows=True)
history_length = 5
bg_subtractor.setHistory(history_length)

erode_kernel = cv2.getStructuringElement(
    cv2.MORPH_ELLIPSE, (ERODE_1, ERODE_2))
dilate_kernel = cv2.getStructuringElement(
    cv2.MORPH_ELLIPSE, (DILATE_1, DILATE_2))
leafs = []
num_history_frames_populated = 0

fourcc = cv2.VideoWriter_fourcc('M','P','E','G')
out = cv2.VideoWriter(OUTPUT_VIDEO_NAME_MPEG, fourcc, FRAMES_PER_SECOND, (frame_width, frame_height))

grabbed_frames = 0

# ---------DETECTION------------

while True:
    grabbed, frame = cap.read()
    grabbed_frames += 1
    # if no_of_frame == 400:
    #     grabbed = False

    if (grabbed is False):
        break
    no_of_frame = no_of_frame + 1
    
    # Color Threshold Tryout
    (b, g, r) = cv2.split(frame)  
    ret2, thresh2 = cv2.threshold(b, 160, 255, cv2.THRESH_BINARY)
    ret3, thresh3 = cv2.threshold(g, 180, 255, cv2.THRESH_BINARY)
    ret4, thresh4 = cv2.threshold(r, 180, 255, cv2.THRESH_BINARY)
    color_frame = cv2.merge((thresh2, thresh3, thresh4))
    # cv2_imshow(color_frame)

    # Apply the KNN background subtractor.
    fg_mask = bg_subtractor.apply(color_frame)

    # Let the background subtractor build up a history.
    if num_history_frames_populated < history_length:
        num_history_frames_populated += 1
        continue

    # Create the thresholded image.
    
    # MASK Threshold
    _, thresh = cv2.threshold(fg_mask, 127, 255, cv2.THRESH_BINARY)
    cv2.erode(thresh, erode_kernel, thresh, iterations=2)
    cv2.dilate(thresh, dilate_kernel, thresh, iterations=2)

    # Adaptive Threshold
    # thresh = cv2.adaptiveThreshold(fg_mask, 120, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    # cv2.morphologyEx(thresh, cv2.MORPH_OPEN, erode_kernel) 
    # cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, erode_kernel)
    
    # Detect Contours in the thresholded image.
    
    contours, hier = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    # contours, hier = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_TC89_KCOS)
    
    hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # Draw green rectangles around large contours.
    # Also, if no leafs are being tracked yet, create some.
    should_initialize_leafs = len(leafs) == 0
    id = 0
    print ("\r Processing {} of {} frames.".format(no_of_frame, no_of_frames_to_process), end="")
    # print('Number of frames to complete: ',no_of_frames_to_process)
    
# ---------TRACKING---------    

    for c in contours:
        if cv2.contourArea(c) > 100:
            (x, y, w, h) = cv2.boundingRect(c)
            cv2.rectangle(frame, (x, y), (x+w, y+h),
                            (0, 255, 0), 1)
            if should_initialize_leafs:
                leafs.append(Leaf(id, hsv_frame, (x, y, w, h)))
        frame_no_and_values = np.array([ id, x, y, w, h ])
        a = np.append(frame_no_and_values, [no_of_frame])
        arr.append(a)
        id += 1
        
    # Update the tracking of each leaf.
    for leaf in leafs:
        leaf.update(frame, hsv_frame)
        frame_no_and_values = np.array([ id, x, y, w, h ])
        a = np.append(frame_no_and_values, [no_of_frame])
        arr.append(a)
    out.write(frame)
    # Print Image every 3 seconds (i.e. modulo 90 frames)
    if no_of_frame%4 == 0:
        cv2_imshow(frame)
        # cv2_imshow(thresh)
        # cv2_imshow(hsv_frame)
        
cap.release()
out.release()
cv2.destroyAllWindows()
motion_array = np.array(arr)

print("\nProcessing took", round(((time.time() - start_time)/60), 2), "minutes.")

### Movie Conversion from .mpeg to .mp4
start_time2 = time.time()
# Shortened videos to 15s to display them in Preview
subprocess.run('ffmpeg -i {} {} -loglevel quiet'.format(OUTPUT_VIDEO_NAME_MPEG, OUTPUT_VIDEO_NAME_MP4), shell=True)

# Shortening Duration of Video for Preview to max 15s or 
time_subvideo_to_be_converted = min(duration_of_video_s, 15)
round(time_subvideo_to_be_converted, 1) 
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip
ffmpeg_extract_subclip('pls_delete.mp4', 0, time_subvideo_to_be_converted, targetname="pls_delete_play.mp4",)
print("Conversion to mp4 and creating preview took", round(((time.time() - start_time2)/60), 2), "minutes.")

