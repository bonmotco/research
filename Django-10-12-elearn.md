# 2020-Django 3 by Example - Chapter 10-13: E-Learning Platform

## Infrastructure E-Learning Platform

### Setting up the virtual environment
mkdir env
python3 -m venv env/bookmarks 
source env/bookmarks/bin/activate

### Installing the modules
pip3 install Django;
pip3 install Pillow==7.0.0;
pip3 install social-auth-app-django==3.1.0;
pip3 install django-extensions==2.2.5; 
pip3 install werkzeug==0.16.0; 
pip3 install pyOpenSSL==19.0.0;
pip3 install easy-thumbnails==2.7;
pip3 install --upgrade certifi;
pip3 install redis==3.4.1;

### Sync Database with the models 
python3 manage.py makemigrations account
python3 manage.py migrate (account)

### Setting up an Admin-account
python3 manage.py createsuperuser

### Start the server:
python3 manage.py runserver_plus --cert-file cert.crt

### Server blocked? - just type: 
thisisunsafe

### test the image saving: 
https://127.0.0.1:8000/images/create/?title=test&url=https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Georgios_Jakobides_Girl_reading_c1882.jpg/800px-Georgios_Jakobides_Girl_reading_c1882.jpg


## Chapter 10: Building an E-Learning Platform

### Setting up the e-learning project
### Building the course models
#### Registering the models in the administration site
#### Using fixtures to provide initial data for models
### Creating models for diverse content
#### Using model inheritance
##### Abstract models
##### Multi-table model inheritance
##### Proxy models
#### Creating the content models
#### Creating custom model fields
#### Adding ordering to the model
### Creating a CMS
#### Adding an auth system
#### Creating the auth templates
#### Creating class-based views
#### Using mixins for class-based views
#### Working with groups and permissions
##### Restricting access to class-bassed views
### Managing course modules and their content
#### Using formsets for course modules
#### Adding content to course modules
#### Managing modules and their contents
#### Reordering models and their contents
##### Using mixins from django-braces
### Summary
## Chapter 11: Rendering and Caching Content

### Displaying courses
### Adding student registration
#### Creating a student registration view
#### Enrolling on courses
### Accesing the course contents
#### Rendering different types of content

### Using the cache framework
#### Available cache backends
#### Installing Memcached
#### Cache setting
#### Adding Memcache to your project
##### Monitoring memcache
#### Cache levels
#### Using the low-level cache API 
##### Cache based on dynamic data
#### Caching template fragments
#### Caching views
##### Using per-site cache

### Summary

## Chapter 12: Building a RESTful API

### Installing Django REST framework
### Defining serializers
### Understanding parsers and renderers
### Building list and detail views
### Creating nested serializers
### Building custom API views
### Handling Auth
### Adding permissions to views
### Craeting viewsets and routers
### Adding additional action to viewsets
### Creating custom permissions
### Serializing course contents
### Consuming the REST API
### Summary

## Chapter 13: Building a Chat Server

### Creating a chat application
#### Implementing the chatroom view
#### Deactivating per-site cache
### Real-time Django with Channels
#### Async Applications using ASGI
#### The request/response cycle using Channels
### Installing Channels
### Writing a consumer
### Routing
### Implementing the websocket client
### Enabling a channel layer
#### Channels and Groups
#### Setting up a channel layer with Redis
#### Updating the consumer to broadcast messages
#### Adding context to the messages

### Modifying the consumer to be fully async
### Integrating the chat with existing views
### Summary

