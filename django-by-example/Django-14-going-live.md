# 2020-Django 3 by Example - Chapter 14: Going Live 497

### Creating a Production Environment 497

- It's time to deploy your Django project in a production environment. 

#### Managing Settings for Multiple Environments

- In real-world projects, you will have to deal with multiple environments. You will have at least a local and a production environment, but you could have other environments as well, such as testing or preproduction environments. Some project settings will be common to all environments, but others will have to be overridden per environment. Let's set up project settings for multiple environments, while keeping everything neatly organized.
- Create a settings/ directory next to the settings.py file of the educa project. Rename the settings.py file to base.py and move it into the new settings/ directory. 
- Create the following additional files inside the settings/ folder so that the new directory has init, base, local, and pro
    - base.py: The base settings file that contains common settings (previously settings.py)
    - local.py: Custom settings for your local environment
    - pro.py: Custom settings for the production environment
- Edit the settings/base.py file as you have moved your settings files to a directory one level lower, so you need BASE_ DIR to point to the parent directory to be correct. You achieve this by pointing to
the parent directory with os.pardir.
- Edit the settings/local.py file: 
    - You import all settings defined in the base.py file and you only define specific settings for this environment.
    - You copy the DEBUG and DATABASES settings from the base.py file, since these will be set per environment.
    - You can remove the DATABASES and DEBUG settings from the base.py settings file.
- Edit the settings/pro.py file:
    - DEBUG: Setting DEBUG to False should be mandatory for any production environment. Failing to do so will result in the traceback information and sensitive configuration data being exposed to everyone.
    - ADMINS: When DEBUG is False and a view raises an exception, all information will be sent by email to the people listed in the ADMINS setting. Make sure that you replace the name/email tuple with your own information.
    - ALLOWED_HOSTS: Django will only allow the hosts included in this list to serve the application. This is a security measure. You include the asterisk symbol, *, to refer to all hostnames. You will limit the hostnames that can be used for serving the application later.
    - DATABASES: You just keep this setting empty. We are going to cover the database setup for production later.
- When handling multiple environments, create a base settings file and a settings file for each environment. Environment settings files should inherit the common settings and override environment-specific settings.
- You have placed the project settings in a different location than the default settings.py file. You will not be able to execute any commands with the `manage.py` tool unless you specify the settings module to use. You will need to add a `--settings` flag when you run management commands from the shell or set a DJANGO_SETTINGS_MODULE environment variable.
- Run it via `python manage.py shell --settings=educa.settings.pro` or add the command `export DJANGO_SETTINGS_MODULE=educa.settings.pro` to your .bashrc

#### Using PostgreSQL

- If you need to install PostgreSQL, you can read the Installing PostgreSQL section of Chapter 3.
- Let's create a PostgreSQL user. Open the shell and run the following commands to create a database user: `su postgres; createuser -dP educa`
- You will be prompted for a password and the permissions that you want to give to this user. Enter the desired password and permissions, and then create a new database with the following command: `createdb -E utf8 -U educa educa`
- Edit the `settings/pro.py` file and modify DATABASES as: 
```python
DATABASES = { 
    'default': {
    'ENGINE': 'django.db.backends.postgresql', 
    'NAME': 'educa',
    'USER': 'educa',
    'PASSWORD': '*****',} }
```
- Run all migrations with `python manage.py migrate`
- Create a superuser with `python manage.py createsuperuser`

#### Checking your project

- Django includes the check management command for checking your project at any time. This command inspects the applications installed in your Django project and outputs any errors or warnings. 
- If you include the --deploy option, additional checks only relevant for production use will be triggered. 
- Open the shell and run the following command to perform a check: `python manage.py check --deploy`
- You will see output with no errors, but several warnings. This means the check was successful, but you should go through the warnings to see if there is anything more you can do to make your project safe for production. 

#### Serving Django through WSGI

- Django's primary deployment platform is WSGI. WSGI stands for Web Server Gateway Interface and it is the standard for serving Python applications on the web.
- When you generate a new project using the startproject command, Django creates a wsgi.py file inside your project directory. This file contains a WSGI application callable, which is an access point to your application.
- WSGI is used for both running your project with the Django development server and deploying your application with the server of your choice in a production environment.

#### Installing uWSGI

- Throughout this book, you have been using the Django development server to run projects in your local environment. However, you need a real web server for deploying your application in a production environment.
- uWSGI is an extremely fast Python application server. It communicates with your Python application using the WSGI specification. uWSGI translates web requests into a format that your Django project can process.
- Install it via `pip3 install uwsgi==2.0.18`l install uWSGI via `brew install uwsgi` 
- 

#### Configuring uWSG
- Run uWSGI from the command line. Open the shell and run: 
```python
sudo uwsgi --module=educa.wsgi:application \ --env=DJANGO_SETTINGS_MODULE=educa.settings.pro \
--master --pidfile=/tmp/project-master.pid \ 
--http=127.0.0.1:8000 \
--uid=1000 \ 
--virtualenv=/home/env/educa/
```
- Replace the path in the virtualenv option with your actual virtual environment directory. If you are not using a virtual environment, you can skip this option.
You might have to prepend sudo to this command if you don't have the required permissions. You might also need to add the --plugin=python3 option if the module is not loaded by default.
- With this command, you can run uWSGI on your localhost with the following options:
    - You use the educa.wsgi:application WSGI callable
    - You load the settings for the production environment
    - You tell uWSGI to use the educa virtual environment
- You can see the rendered HTML that corresponds to the course list view, but no CSS style sheets or images are being loaded. The reason for this is that you didn't configure uWSGI to serve static files
- uWSGI allows you to define a custom configuration in a .ini file. This is more convenient than passing options through the command line. Create a `config/uwsgi.ini` in the educa/ directory, and define it is:
```python
[uwsgi]
# variables
projectname = educa  # The name of your Django project, which is educa.
base = /home/projects/educa # The absolute path to the educa project. Replace it with the absolute path to your project.
# configuration
master = true # Enable the master process.
virtualenv = /home/env/%(projectname) # The path to your virtual environment. Replace this path with the appropriate path.
pythonpath = %(base) # The paths to add to your Python path.
chdir = %(base) # The path to your project directory, so that uWSGI changes to that directory before loading the application.
env = DJANGO_SETTINGS_MODULE=%(projectname).settings.pro # Environment variables. You include the DJANGO_SETTINGS_MODULE variable, pointing to the settings for the production environment. 
module = % (projectname).wsgi:application # The WSGI module to use. You set this to the application callable contained in the wsgi module of your project.
socket = /tmp/%(projectname).sock # The UNIX/TCP socket to bind the server.
chmod-socket = 666 # The file permissions to apply to the socket file. In this case, you use 666 so that NGINX can read/write the socket.
```
- The socket option is intended for communication with some third-party router, such as NGINX, while the http option is for uWSGI to accept incoming HTTP requests and route them by itself. You are going to run uWSGI using a socket, since you are going to configure NGINX as your web server and communicate with uWSGI through the socket.

- run uWSGI via `uwsgi --ini config/uwsgi.ini`

#### Installing NGINX
- When you are serving a website, you have to serve dynamic content, but you also need to serve static files, such as CSS style sheets, JavaScript files, and images. While uWSGI is capable of serving static files, it adds an unnecessary overhead to HTTP requests and therefore, it is encouraged to set up a web server, such as NGINX, in front of it.
- NGINX is a web server focused on high concurrency, performance, and low memory usage. NGINX also acts as a reverse proxy, receiving HTTP requests and routing them to different backends.
- If you are using macOS, you can install NGINX using the command `brew install nginx`.
- Open a shell and run nginx via `sudo nginx`

#### The production environment
- Diagram: Client <-HTTP-> NGINX <-Unix Socket-> uWSGI <-WSGI-> DJANGO
- The following happens when the client browser sends an HTTP request: 
    - NGINX receives the HTTP request.
    - NGINX delegates the request to uWSGI through a socket.
    - uWSGI passes the request to Django for processing.
    - Django returns an HTTP response that is passed back to NGINX, which in turn passes it back to the client browser.

#### Configuring NGINX

- Create a new file inside the config/ directory and name it nginx.conf
```python
# the upstream component nginx needs to connect to
upstream educa { server   unix:///tmp/educa.sock; }
server {
    listen          80; #listen to port 80
    server_name     www.educaproject.com educaproject.com; #You set the server name to both www.educaproject.com and educaproject.
com. NGINX will serve incoming requests for both domains.
        
    access_log      off # You explicitly set access_log to off. You can use this directive to store access logs in a file. 
    error_log       /home/projects/educa/logs/nginx_error.log # You use the error_log directive to set the path to the file where you will be storing error logs. Replace this path with the path where you would like to store NGINX error logs. Analyze this log file if you run into any issue while using NGINX.

       
   location / { 
        include     /etc/nginx/uwsgi_params; # You include the default uWSGI configuration parameters that come with NGINX. These are located next to the default configuration file for NGINX.
        uwsgi_pass  educa; # You specify that everything under the / path has to be routed to the educa socket (uWSGI).
    }
}
```

- The default configuration file for NGINX is named nginx.conf and it usually resides in any of these three directories: `/usr/local/nginx/conf`, `/etc/nginx`, or `/ usr/local/etc/nginx`.
- Locate your nginx.conf configuration file and add an include directive inside the http block.
- Replace `/home/projects/educa/config/nginx.conf` with the path to the configuration file you created for the educa project. In this code, you include the NGINX configuration file for your project in the default NGINX configuration.
- Open a shell and run uWSGI: `uwsgi --ini config/uwsgi.ini`
- Open a second shell and reload NGINX with the following command: `sudo nginx -s reload`
- Whenever you want to stop NGINX, you can gracefully do so with the following command: `sudo nginx -s quit` (If you want to quickly stop NGINX, instead of quit use the signal stop. The quit signal waits for worker processes to finish serving current requests, while the stop signal stops NGINX abruptly.)
- Since you are using a sample domain name, you need to redirect it to your local host. Edit your /etc/hosts file and add `127.0.0.1 educaproject.com www.educaproject.com`
- By doing so, you are routing both hostnames to your local server. In a production server, you won't need to do this, since you will have a fixed IP address and you will point your hostname to your server in your domain's DNS configuration.
- Open http://educaproject.com/ in your browser. You should be able to see your site, still without any static assets loaded. Your production environment is almost ready.
- Now you can restrict the hosts that can serve your Django project. Edit the production settings file settings/pro.py of your project and change the ALLOWED_ HOSTS setting, as follows: `ALLOWED_HOSTS = ['educaproject.com', 'www.educaproject.com']`
- Django will now only serve your application if it's running under any of these hostnames.

#### Serving static and media assets

- uWSGI is capable of serving static files flawlessly, but it is not as fast and effective as NGINX. Therefore, use NGINX. 
- Use NGINX to serve:
    - the static files of your application (CSS style sheets, JavaScript files, and images) and 
    - media files uploaded by instructors for the course contents
- Edit the settings/base.py file and add the following line just below the STATIC_ URL setting: `STATIC_ROOT = os.path.join(BASE_DIR, 'static/')`
- Each application in your Django project may contain static files in a static/ directory. Django provides a command to collect static files from all applications into a single location. This simplifies the setup for serving static files in production. The collectstatic command collects the static files from all applications of the project into the path defined in STATIC_ROOT.
- Files located under the static/ directory of each application present in the INSTALLED_APPS setting have been copied to the global /educa/static/ project directory.
- Extend the `nginx.conf` by:
```python
location /static/ {
   alias /home/projects/educa/static/;
}
location /media/ {
   alias /home/projects/educa/media/;
}
```
- Remember to replace the `/home/projects/educa/` path with the absolute path to your project directory. These directives tell NGINX to serve static files located under the /static/ and /media/ paths directly.
- Files under the /static/ and /media/ paths are now served by NGINX directly, instead of being forwarded to uWSGI. Requests to any other paths are still passed by NGINX to uWSGI through the UNIX socket.
- Reload NGINX's configuration with `sudo nginx -s reload`
- Test the system. 

#### Securing connections with SSL/TLS

- The Transport Layer Security (TLS) protocol is the standard for serving websites through a secure connection. 
- The TLS predecessor is Secure Sockets Layer (SSL). Although SSL is now deprecated, in multiple libraries and online documentation you will find references to both the terms TLS and SSL. 
- It's strongly encouraged that you serve your websites under HTTPS. You are going to configure an SSL/TLS certificate in NGINX to serve your site securely.

##### Creating an SSL/TLS certificate

- Create a new directory inside the educa project directory and name it ssl. - Then, generate an SSL/TLS certificate from the command line with the following command `sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/ educa.key -out ssl/educa.crt`
- You are generating a private key and a 2048-bit SSL/TLS certificate that is valid for one year. You will be asked to enter data
- You can fill in the requested data with your own information. The most important field is the Common Name. You have to specify the domain name for the certificate. You use educaproject.com. This will generate, inside the ssl/ directory, an educa. key private key file and an educa.crt file, which is the actual certificate.

##### Configuring NGINX to use SSL/TLS

- Edit the nginx.conf file of the educa project and edit the server block to include SSL/TLS: 
```python
[...listen          80]
listen              443 ssl;
ssl_certificate     /home/projects/educa/ssl/educa.crt;
ssl_certificate_key /home/projects/educa/ssl/educa.key;
[...]
```
- Reload NGINX's configuration with `sudo nginx -s reload`
- This screen might vary depending on your browser. It alerts you that your site is not using a trusted or valid certificate; the browser can't verify the identity of your site. This is because you signed your own certificate instead of obtaining one from a trusted certification authority (CA). 
- When you own a real domain, you can apply for a trusted CA to issue an SSL/TLS certificate for it, so that browsers can verify its identity.
- If you want to obtain a trusted certificate for a real domain, you can refer to the Let's Encrypt project created by the Linux Foundation. It is a nonprofit CA that simplifies obtaining and renewing trusted SSL/TLS certificates for free. You can find more information at https://letsencrypt.org.
- Click on the link or button that provides additional information and choose to visit the website, ignoring warnings. Bypass with 'badidea' or 'thisisunsafe'.

##### Configuring your Django project for SSL/TLS

- Django comes with specific settings for SSL/TLS support. Edit the settings/pro.py settings file and add the following settings to it:
`SECURE_SSL_REDIRECT = True; CSRF_COOKIE_SECURE = True`
    - SECURE_SSL_REDIRECT: Whether HTTP requests have to be redirected to HTTPS.
    - CSRF_COOKIE_SECURE: Has to be set for establishing a secure cookie for cross-site request forgery (CSRF) protection.
- Django will now redirect HTTP requests to HTTPS, and cookies for CSRF protection will now be secure.

##### Redirecting HTTP traffic over to HTTPS

- You are redirecting HTTP requests to HTTPS using Django. However, this can be handled in a more efficient way using NGINX. Edit the nginx.conf file of the educa project.
- In this code, you remove the directive listen 80; 
    - from the original server block, so that the platform is only available through SSL/TLS (port 443).
    - On top of the original server block, you add an additional server block that only listens on port 80 and redirects all HTTP requests to HTTPS. 
    - To achieve this, you return an HTTP response code 301 (permanent redirect) that redirects to the https:// version of the requested URL.
- Reload NGINX's configuration with `sudo nginx -s reload`

#### Using Daphne for Django Channels

- uWSGI is suitable for running Django or any other WSGI application, but it doesn't support asynchronous communication using Asynchronous Server Gateway Interface (ASGI) or WebSockets. In order to run Channels in production, you need an ASGI web server that is capable of managing WebSockets.
- Daphne is a HTTP, HTTP2, and WebSocket server for ASGI developed to serve Channels. You can run Daphne alongside uWSGI to serve both ASGI and WSGI applications efficiently.
- Daphne is installed automatically as a dependency of Channels.
-  You can also install Daphne with the following command: `pip3 install daphne==2.4.1`
- Django 3 supports WSGI and ASGI, but it doesn't support WebSockets yet. Therefore, you are going to edit the asgi.py file of the educa project to use Channels.
- Edit the educa/asgi.py file of your project: 
```python
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'educa.settings') django.setup()
application = get_default_application()
```
- You are loading the default ASGI application using Channels instead of the standard Django ASGI module.
- Open a new shell and set the DJANGO_SETTINGS_MODULE environment variable with the production environment using the following command:`export DJANGO_SETTINGS_MODULE=educa.settings.pro`
- In the same shell, from the educa project directory run the following command: `daphne -u /tmp/daphne.sock educa.asgi:application`
- The output shows that Daphne is successfully running on a UNIX socket.

#### Using secure connections for WebSockets

- You have configured NGINX to use secure connections through SSL/TLS. You need to change ws (WebSocket) connections to use the wss (WebSocket Secure) protocol now, in the same way that HTTP connections are now being served through HTTPS
- Edit the chat/room.html template of the chat application and find the following line in the domready block:
```python
var url = 'wss://' + window.location.host +
```

#### Including Daphne in the NGINX configuration 518

- In your production setup, you will be running Daphne on a UNIX socket and using NGINX in front of it. NGINX will pass requests to Daphne based on the requested path. You will expose Daphne to NGINX through a UNIX socket interface, just like the uWSGI setup.
- Edit the config/nginx.conf file of the educa project:
```python
upstream daphne {
server unix:/tmp/daphne.sock;
}
[...]
location /ws/ {...}
```

- In this configuration, you set up a new upstream named daphne, which points to a socket created by Daphne. In the server block, you configure the /ws/ location to forward requests to Daphne. You use the proxy_pass directive to pass requests to Daphne and you include some additional proxy directives.
- With this configuration, NGINX will pass any URL request that starts with the /ws/ prefix to Daphne and the rest to uWSGI, except for files under the /static/ or / media/ paths, which will be served directly by NGINX.

- NGINX runs 
    - in front of uWSGI and Daphne as a reverse proxy server. 
    - faces the Web and passes requests to the application server (uWSGI or Daphne) based on their path prefix.
    - also serves static files and redirects non-secure requests to secure ones. 
    - This setup reduces downtime, consumes less server resources, and provides greater performance and security.
- Stop and start uWSGI and Daphne, and then reload NGINX with the following command to keep track of the latest configuration: `sudo nginx -s reload`
- Daphne is working correctly and NGINX is passing requests to it. All connections are secured through SSL/TLS.

#### Creating a custom middleware

- You already know the MIDDLEWARE setting, which contains the middleware for your project. You can think of it as a low-level plugin system, allowing you to implement hooks that get executed in the request/response process. 
- Each middleware is responsible for some specific action that will be executed for all HTTP requests or responses.
- Avoid adding expensive processing to middleware, since they are executed in every single request.
- When an HTTP request is received, middleware are executed in order of appearance in the MIDDLEWARE setting. When an HTTP response has been generated by Django, the response passes through all middleware back in reverse order.
    - A middleware factory is a callable that takes a get_response callable and returnsa middleware. 
    A middleware is a callable that takes a request and returns a response, just like a view. The get_response callable might be the next middleware in the chain or the actual view in the case of the last listed middleware.
    - If any middleware returns a response without calling its get_response callable, it short circuits the process; no further middleware get executed (also not the view), and the response returns through the same layers that the request passed in through.
    - The order of middleware in the MIDDLEWARE setting is very important because a middleware can depend on data set in the request by other middleware that have been executed previously.
- When adding a new middleware to the MIDDLEWARE setting, make sure to place it in the right position. Middleware are executed in order of appearance in the setting during the request phase, and in reverse order for responses.

##### Creating a subdomain middleware

- You are going to create a custom middleware to allow courses to be accessible through a custom subdomain.
- Each course detail URL, which looks like `https://educaproject.com/course/django/`, will also be accessible through the subdomain that makes use of the course slug, such as https://django.educaproject.com/.
- Users will be able to use the subdomain as a shortcut to access the course details. Any requests to subdomains will be redirected to each corresponding course detail URL.
- Middleware can reside anywhere within your project. However, it's recommended to create a middleware.py file in your application directory.
- Create a new file inside the courses application directory and name it `middleware.py`:
```python
def subdomain_course_middleware(get_response)
   def middleware(request):
    host_parts = request.get_host().split('.')
    if len(host_parts) > 2 and host_parts[0] != 'www':
        # get course for the given subdomain
        course = get_object_or_404(Course, slug=host_parts[0]) 
        course_url = reverse('course_detail',args=[course.slug])
        # redirect current request to the course_detail view
        url = '{}://{}{}'.format(request.scheme, '.'.join(host_parts[1:]), course_url)
       return redirect(url)
    response = get_response(request) 
    return response
return middleware    
```    
- When an HTTP request is received, perform:
    1. You get the hostname that is being used in the request and divide it into parts. For example, if the user is accessing mycourse.educaproject.com, you generate the list ['mycourse', 'educaproject', 'com'].
    2. You check whether the hostname includes a subdomain by checking whether the split generated more than two elements. If the hostname includes a subdomain, and this is not www, you try to get the course with the slug provided in the subdomain.
    3. If a course is not found, you raise an HTTP 404 exception. Otherwise, you redirect the browser to the course detail URL.
- Edit the `settings/base.by` file of the project and add 'courses.middleware. SubdomainCourseMiddleware' at the bottom of the MIDDLEWARE list
- A value that begins with a period is used as a subdomain wildcard; '.educaproject.com' will match educaproject.com and any subdomain for this domain, for example course.educaproject.com and django.educaproject.com.

##### Serving multiple subdomains with NGINX

- You need NGINX to be able to serve your site with any possible subdomain. - Edit the `config/nginx.conf` file of the educa project and replace the two occurrences by adding an asterisk
- By using the asterisk, this rule applies to all subdomains of educaproject.com. In order to test your middleware locally, you need to add any subdomains you want to test to /etc/hosts. For testing the middleware with a Course object with the slug django `127.0.0.1 django.educaproject.com`
- Stop and start uWSGI again, and reload NGINX with the following command to keep track of the latest configuration: `sudo nginx -s reload`

### Implementing Custom Management Commands

- Django allows your applications to register custom management commands
for the manage.py utility. For example, you used the management commands makemessages and compilemessages
- A management command consists of a Python module containing a Command class that inherits from django.core.management.base.BaseCommand or one of its subclasses. You can create simple commands or make them take positional and optional arguments as input
- Django looks for management commands in the management/commands/ directory for each active application in the INSTALLED_APPS setting. Each module found is registered as a management command named after it.


- You are going to create a custom management command to remind students to enroll at least on one course. The command will send an email reminder to users who have been registered for longer than a specified period who aren't enrolled on any course yet.
- Create the structure inside the students application: 
```python 
management/ 
    __init__.py
    commands/ 
        __init__.py
        enroll_reminder.py
```
- Edit the `enroll_reminder.py`

```python
import datetime
from django.conf import settings
from django.core.management.base import BaseCommand from django.core.mail import send_mass_mail
from django.contrib.auth.models import User
from django.db.models import Count
from django.utils import timezone

class Command(BaseCommand):
    help = 'Sends an e-mail reminder to users registered more \
              than N days that are not enrolled into any courses yet'
    
    def add_arguments(self, parser): parser.add_argument('--days', dest='days', type=int)
        
    def handle(self, *args, **options): 
            emails = []
            subject = 'Enroll in a course' 
            date_joined = timezone.now().today() - \
                datetime.timedelta(days=options['days']) users = User.objects.annotate(course_count=Count('courses_joined'))\.filter(course_count=0, date_joined__date__lte=date_joined)
            for user in users:
                message = """Dear {}, 
                We noticed that you didn't enroll in any courses yet. What are you waiting for?""".format(user.first_name) emails.append((subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])) send_mass_mail(emails)
            self.stdout.write('Sent {} reminders'.format(len(emails)))
```
- The preceding code is as follows:
    - The Command class inherits from BaseCommand.
    - You include a help attribute. This attribute provides a short description of the command that is printed if you run the command python manage.py help enroll_reminder.
    - You use the add_arguments() method to add the --days named argument. This argument is used to specify the minimum number of days a user has to be registered, without having enrolled on any course, in order to receive the reminder.
    - The handle() command contains the actual command. You get the days attribute parsed from the command line. You use the timezone utility provided by Django to retrieve the current timezone-aware date with timezone.now().date(). (You can set the timezone for your project with the TIME_ZONE setting.) 
    - You retrieve the users who have been registered for more than the specified days and are not enrolled on any courses yet. You achieve this by annotating the QuerySet with the total number of courses each user is enrolled on. You generate the reminder email for each user and append it to the emails list.
    - Finally, you send the emails using the send_ mass_mail() function, which is optimized to open a single SMTP connection for sending all emails, instead of opening one connection per email sent.

- You have created your first management command. Test it via `python manage.py enroll_reminder --days=20`
- If you don't have a local SMTP server running, you can take a look at Chapter 2, Enhancing Your Blog with Advanced Features, where you configured SMTP settings for your first Django project. Alternatively, you can add the following setting to the settings.py file to make Django output emails to the standard output during development:
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
- Let's schedule your management command so that the server runs it every day at 8 a.m. If you are using a UNIX-based system such as Linux or macOS, open the shell and run crontab -e to edit your crontab. Add the following line to it: `0 8 * * * python /path/to/educa/manage.py enroll_reminder --days=20 --settings=educa.settings.pro`
- Use management commands for standalone scripts that you want to schedule with cron or the Windows scheduler control panel.
- Django also includes a utility to call management commands using Python. You can run management commands from your code as follows: `from django.core import management management.call_command('enroll_reminder', days=20)`

### Summary
- In this chapter, you configured a production environment using NGINX, uWSGI, and Daphne. 
- You secured your environment through SSL/TLS. 
- You also implemented a custom middleware and you learned how to create custom management commands.