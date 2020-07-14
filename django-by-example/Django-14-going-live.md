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

- 
- 
- 
- 
- 


#### Securing connections with SSL/TLS 511

- 
- 
- 
- 
- 


##### Creating an SSL/TLS certificate 511
- 
- 
- 
- 
- 

##### Configuring NGINX to use SSL/TLS 512

- 
- 
- 
- 
- 
##### Configuring your Django project for SSL/TLS 514

- 
- 
- 
- 
- 
##### Redirecting HTTP traffic over to HTTPS 515
- 
- 
- 
- 
- 

- 
- 
- 
- 
- 
#### Using Daphne for Django Channels  516
- 
- 
- 
- 
- 
#### Using secure connections for WebSockets 517
- 
- 
- 
- 
- 

#### Including Daphne in the NGINX configuration 518
- 
- 
- 
- 
- 
#### Creating a custom middleware 520
- 
- 
- 
- 
- 

- 
- 
- 
- 
- 
##### Creating a subdomain middleware 522
- 
- 
- 
- 
- 
##### Serving multiple subdomains with NGINX 523
- 
- 
- 
- 
- 

### Implementing Custom Management Commands 524
- 
- 
- 
- 
- 

### Summary 527
- 
- 
- 
- 
- 
