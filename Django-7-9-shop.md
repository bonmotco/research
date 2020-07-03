# 2020-Django 3 by Example - Chapter 7-9

## Running the Online Shop

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


## Chapter 7: Building an Online Shop

### Creating an Online Shop Project

#### Creating product catalog models
#### Registering catalog models on the administration site
#### Building catalog views
#### Creating catalog templates

### Building a Shopping Cart

#### Using Django Sessions
#### Session Settings
#### Sessions Expiration
#### Storing Shopping Carts in Sessions
#### Creating Shopping Cart Views
##### Adding items to the cart
##### Building a template to display the cart
##### Adding products to the cart
##### Updating product quantities in the cart

#### Creating a Context Processor for the Current Cart
##### Contect processors
##### Setting the cart into the request context

### Registering Customer Orders

#### Creating order models
#### Including order models in the administration site
#### Creating customer orders

### Launching Async Tasks with Celery 
#### Installing Celery
#### Installing RabbitMQ
#### Adding Celery to your project
#### Adding Async Tasks to your Application
#### Monitoring Celery

## Chapter 8: Managing Payments and Orders

### Integrating a Payment Gateway
####
####
### Exporting Orders to CSV files
### Registering Customer Orders
### Extending the Administration Site with Custom Views
### Generating PDF invoices dynamically

## Chapter 9: Extending Your Shop

### Creating a Coupon System

####
####
### Adding Internationalization and Localization
### Building a Recommendation Engine
