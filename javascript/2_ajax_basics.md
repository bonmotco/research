# AJAX Basics

## AJAX Concepts

Introduction to AJAX

- AJAX web pages ask for info from the server: Async JavaScript and XML
- JS processes the data to change the web page
- Request: Asking server for data
- Response: Answer by server with data
- In console you can see the ajax requests: control click and choose: 'Log XMLHttpRequests' that tell you the logging of your scrolling/page
- Don't waste users time with unnecessary web page refreshes

How AJAX works

- Server signup example
- XMLHttpRequest Object is being sent back and for
- what AJAX stands for: Async JavaScript And XML
- Four steps to creating and sending a XHR request:
    - Create and XMLHTTP Request (XHR) Object: tells browser to get ready, get everything together to create the object to send and receive later
    - Create a callback function: Programming to run when server returns its response, update the HTML on the page (update the map on google maps)
    - Open a request: Give browser (method: get or post), url where method is sent to.
    - Send the request: send from browser to webserver

A Simple AJAX example

Step 1: Create the XHR object
var xhr = new XMLHttpRequest();

Step 2: Create a callback function
- heart of the AJAX programm
- its like a node you leave to the browser
- do more, while note is being responded to
- with multiple AJAX requests, you never know which one returns first: you can never tell in which order they are being run on the server
- ajax has an own set of events
- only wait for final response of the server

xhr.onreadystatechange = function () {
        if (xhr.readState === 4) {
            document.getElmentById('ajax').innerHTML = xhr.responseText;
        }
};

Step 3: xhr.open('GET', 'sidebar.html');
Step 4: xhr.send();

//Steps in code 
<script>
    var xhr = new XMLHttpRequest(); 
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            document.getElmentById('ajax').innerHTML = xhr.responseText;
        }
    };
    xhr.open('GET', 'sidebar.html');
    function sendAJAX(){
        xhr.send();
        document.getElementById('load').style.display = 'none';
    }
</script>
- To make it interactive, a button is being used to make it interactive with 
<button id='load' onclick='sendAJAX()'>Bring it!</button> 

GET and POST

GET method:
- Use GET only when you want to receive something; like tweets, database search > only a url is required
- Use POST when you need to send something >
- example: https://teamtreehouse.com/library/get-and-post.php?lastName=Jones
- QueryString: lastName=Jones > Used to search in a database with one Name(or Property)/Value pair
- QueryString: firstName=Rita&lastName=Jones > Used to search in a database with two Name/Value pairs just with an Ampersand; & Space and + have special meaning in URL
- Conversion in URL:
    - & is %26
    - Space is +
    - + is %2B
- Check www.url-encode-decode.com to decode/encode URLs
- IE can only handle 2083 letters
- Security issue since a password would be sent as well. Therefore, POST method has a payload.

POST method:
- with post the actual form data is sent separate from the URL
- Requires special encoding like get
- Header needs to be given

AJAX Response Formats

- Long data responses (50 tweets, 100 search results, etc) can create a lot of difficulty for that you need an structured approach, via. XML and JSON
- Easily and structured organized contacts/contact/name/phone/contact/contacts
- Parsing: breaking up data into small parts
- Involves several steps: parsing, analyzing etc.
- Example:

<?xml version="1.0" encoding="UTF-8"?>
<songs>
  <song>
    <title>OTHERSIDE</title>
    <artist>RHCP</artist>
  </song>
</songs>


AJAX Security Limitations

Due to the same origin policy of AJAX:
- You cannot go to another server with AJAX
- You cannot switch the protocol (https, http)
- No port/hosts changes

Circumvent these with:
- A web proxy, include another server
- JSONP - JSON with Padding (link across domain links): link to photos of other web sites
- this is how CDNs work
- CORS: Cross-Origin Resource Sharing: allows requests from other domains
- it doesnt work unless viewing through the browser

## Programming AJAX

Introduction to the Project

- Make a info tool whether an employee is in or out of office that day.

AJAX Callbacks

For states in AJAX:

0. - 2. XMLRequest Object is created
3. Response is coming
Readystate 4: Webserver sent everybody he is going to send
- Also check for the status property with xhr.status == 200
- 200 is okay; 404 is fileNotFound, 401 not authorized
- Status 500: server internal error
- alert(xhr.statusText)
- statusText = 'not found'
- use ajax for 
    - don't display the widget if the data is not there
    - sometimes you need it to give feedback

Introducing JSON

- JSON = JavaScript Object Notation
- arary notation: ['string, 3, true, false, [1,2,3]] > to identify what is what you have the object notation (key value pairs)
- data.json: 
{
    "name": "Jim",
    "phone": "9337 1225" (except last one!)
}
- extra requirement: keys have to be quoted! must be double quotes two!, strings also need double quotes
- if you have many data parts, like many employees, then you need to be correct with every onput! Use a tool like jsonlint.com to figure out whether a JSON file is valid

Parsing JSON Data

- We build a normal request in widget.js

File: widget.js
<script>
    var xhr = new XMLHttpRequest(); 
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            document.getElmentById('ajax').innerHTML = xhr.responseText;
        }
    };
    xhr.open('GET', 'sidebar.html');
    function sendAJAX(){
        xhr.send();
        document.getElementById('load').style.display = 'none';
    }
</script>
- 
what does xhr.responseText do?
- run the widget by linking it to the web page in the html with <script src="js/widget.js"></script>
- with console.log(xhr.responseText) we are getting the json for the employees
- typeof xhr.responseText shows that is a string
- therefore we pass it to json with 
- __var employees = JSON.parse(xhr.responseText);__
- json-formatted data must be an array of items or an object full of key: value pairs

Processing JSON Data

- How to output this to the html file and to integrate it into the HTML and CSS, for that create a mockup. 
- Recipe:
    1. Create a new HTML list item
    2. Check the 'inoffice' property
    3. Get the value for the 'name' property; insert it inside the <li> tag
    4. Close the <li> tag
- Do this in widget.js
> to get to the data in a json write 
        - employees[0].name        
        - employees[0].false 

<script>
    var xhr = new XMLHttpRequest(); 
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var employees = JSON.parse(xhr.responseText);
            var statusHTML = '<ul class="bulleted">'
            for (var i=0; i<employees.length; i += 1){
                if (employee[i].inoffice === true) {
                    statusHTML += '<li class="in">';
                } else {
                    statusHTML += '<li class="out">';
                    }
                statusHTML += employees[i].name;
                statusHTML += '</li>';
                }
            statusHTML += '<ul>';
            document.getElementById('employeeList').innerHTML = statusHTML;
        }
    };
    xhr.open('GET', 'sidebar.html');
    xhr.send();
    }
</script>