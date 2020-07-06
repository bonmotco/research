# 2020-Django 3 by Example - Chapter 7-9

## Running the Online Shop

### Setting up the virtual environment
mkdir env
python3 -m venv env/myshop 
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
<!--pip3 install redis==3.4.1;-->

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

Learnings will be:
- Create a product catalogue
- Build a shopping cart using Django sessions
- Create custom context processors
- Manage customer orders
- Configure Celery in your project with RabbitMQ as a message broker
- Send async notifications to customers using Celery
- Monitor Celery using Flower

### Creating an Online Shop Project

Functionalities for customers:
- Creating the product catalog models, adding them to the administration site, and building the basic views to display the catalog
- Building a shopping cart system using Django sessions to allow users to keep selected products while they browse the site
- Creating the form and functionality to place orders on the site
- Sending an ansync mail confirmation to users when they place an order

Starting the project:
- create a virtual environment
- Install Django 3.*
- Start a new app 'shop' with Django-admin startapp, and register it in the settings.py at INSTALLED_APPS

#### Creating product catalog models

- Catalog will consist of products organized into different categories, each having a name, an optional description, an optional image, a price, and its availability
- edit the models.py of the shop application: add classes 
    - Category() with name, unique slug field
    - Product() with category (foreign key to the category model: 1to-many), name, slug, image, description, price (comes with DecimalField to avoid rounding issues > always for monetary amounts), available, created, updated.
- Make the migrations (manage.py makemigrations) & sync the database (manage.py migrate)

#### Registering catalog models on the administration site

- Edit the admin.py of the show application by adding  a CategoryAdmin() and a ProductAdmin() class with the list_display, list_filter, list_editable and prepopulated_fields (slug)
    - list_editable: to set the fields that can be edited from the list display page of the admin site (to edit multiple rows at once)

#### Building catalog views

- edit the views.py and add function product_list(request) which filters the QuerySet with available = True to retrieve only available products; through the category_slug parameter products are being filtered by a given category
- with product_detail() retrieve and display a single product: it expects the id and slug parameters in order to retrieve the Product instance; after building the product list and detail views, you have to define URL patterns for them > create urls.py with three patterns:
    - product_list: a pattern named product_list which calls the product_list view without any parameters
    - product_list_by_category: provides a category slugto the view
    - product_detail: passes the id and slug paramas to the view to retrieve a specific product
- edit urls.py of main application myshop by adding the 'shop.urls', namespace='shop'
- edit the models.py of shop and import reverse() function and a ge_absolute_urls() for Category and Product models. This is convention to retrieve the URL for a given object

#### Creating catalog templates

- Create the templates/shop/base.html + product/list.html & detail.html
- Copy the static files from git
- Extend the shop/product/list.html template: __Do not split template tags into multiple lines!__
- Edit the settings.py of `myshop` to serve uploaded files with MEDIA_URL and MEDIA_ROOT, also edit the main `urls.py` of `myshop` to serve the uploaded media files. __Remember:__ Only serve static files during development. In production, never serve static files with Django. 
- Edit the 'shop/product/detail.html' template call the `get_absolute_url()` method to display the available products that belong to the same categroy


### Building a Shopping Cart

- Create a shopping cart so that users can pick up products they want to purchase, it allows users to pick the products for purchase, set the amount to order, store the info temporarily while they browse the site until an order is placed; the cart has to persist the session so that the cart items are maintained during a user's visit via Django's session framework 

#### Using Django Sessions

- Django provides a sesion framework that supports anonymous and user sessions. 
    - Store abitrary data for each visitor. 
    - Session data is stored on the server side. 
    - Cookies contain the sessions ID unless you use the cookie-based session engine.
    - Session middleware manages sending and receiving of cookies. The default session engine stores session data in the database but you can choose other session engines.
- make sure that the `MIDDLEWARE` setting cotains `django.contrib.sessions.middleware.SessionMiddleware` as it manages sessions. It should be there through `startproject`
- It makes the current session available in the request object. Access it by request.session, treating it like a Python dict to store and retrieve sessions data. The session dict accepts any Python object that can be serialized to`JSON`. 
    - Set a variable: `request.session['foo'] = 'bar'`
    - Retrieve a session key: `request.session.get('foo')`
    - Delete a key: `del request.session['foo']`
- Note: When users log in, their anonymous session is lost and a new session is created for the auth'd user. Hence, store items in an anonymous session and copy the old session into the new session by retrieving the session data before you log in the user using the login() function.

#### Session Settings

- Most important: `SESSION_ENGINE`: allows to set the plce where sessions are stored. Django uses the session model of django.contrib.session. Options:
    - Database sessions: session data is stored in the db.
    - File-based sessions: stored in the filesystem.
    - Cached sessions: in a cache backend. Specify the cache backend in the CACHES setting. Provides the best performance. __Best performance! Django supports Memchached or cache backends for Redis.__
    - Cached database sessions: stored in a write-through cache and database. Reads only the database if the data is not already in the cache.
    - Cookie-based sessions: data is stored in cookies that are sent to the browser. 
- Customize sessions with specific sessions:
    - SESSION_COOKIE_AGE: duration of session cookies in s. Default is two weeks (1209600)
    - SESSION_COOKIE_DOMAIN: domain used for session cookies. Set to mydomain.com to enable cross-domain cookies or use NONE for a standard domain cookie.
    - SESSION_COOKIE_SECURE: Bool indicating that cookie should only be sent if HTTPS connection is used.
    - SESSION_EXPIRE_AT_BROWSER_CLOSE: Bool that the session has to expire when the browser is closed.
    - SESSION_SAVE_EVERY_REQUEST: Bool indicating that, if TRUE, the session will be saved on every request. Session expiration is also updated each time it's saved.

#### Sessions Expiration

- Choose to use browser-length sessions or persistent sessions using the SESSION_EXPIRE_AT_BROWSER_CLOSE setting. 

#### Storing Shopping Carts in Sessions

- Create a simple structure that can be serialized to JSON for storing cart items in a session. Cart has to include data for each item in it: 
    - the ID of a PRODUCT instance
    - the quantity selected for the product
    - the unit price for the product
- Product prices may vary hence, store product's price along with product itself when it is added to the cart, no matter whether the product's prices is changed afterwards. Meaning that the price that the item has when the client adds it to the cart is maintained for the client in the session until checkout is completed or the session finishes. 
- Build functionality to create shopping carts and associate them with sessions:
    - When a cart is needed, check whether a custom session key is set. If no cart is set in the session, you create a new cart and save it in the cart session key. 
    - For successive requests, perform the same check and get the cart items from the cart session key. Retrieve the cart items from the session and their related `Product` objects from the database.
- Edit settings.py file of the project and add `CART_SESSION_ID = 'cart'` which will be the key used to store the cart in the user session. Since Django sessions are managed per visitor, use the same cart session key for all sessions.
- Create an application for managing shopping carts via `python3 manage.py startapp cart` and edit the settings.py in myshop to to register it. 
- Create a new file inside the `cart` application named `cart.py`: it will initiate the Cart class allowing to manage the shopping cart. It is initialized with a request object. Store the current session unsig the self.session = request.session to make it acessible to the other motehds of the Cart class. 
    - First get the cart from the current session using self.session.
    - Build your cart dictionary with the product IDs as keys, and for each product key, a dictionary will be a value including quantity and price. 
- Create a method to add products to the cart ur update their quanity `add()` and `save()` . Its inputs are product, quantity and override_quantity
    - use the product ID as a key in the cart's content dictionary. Convert the product ID into a string because Django uses JSON to seralize session data, and JSON only allows string key names. 
    - Product ID is the key, and the value that you persist is a dict with quant and price figures for the product. The product's price is converted from decial into a string in order to serialze it. 
    - The save() method marks the session as modified using session.modified = True. This tells Django that the session has changed and needs to be saved.
- Method for removing products from the cart: def remove(self, product)
    - Removes a given product from the cart dictionary and calls the save() method to update the cart in the session.
    - Iterate through the item contained in the cart and access the related Product instances. In `iter()` retrieve the `Product` instances that are present in the cart include them in the cart items. Cope the current cart in the `cart` variable and add the `Product` instances to it. Finally, iterate over the cart items, converting each item's price back into decimal, and adding a `total_price` attribute to each item. 
    - Need a way to return the numbr of total items in the cart. Therefore, implement a custom `__len__()` function to return the sum of the quantities of all the cart items.
    - Add a method to calc the total cost of the items, i.e. `get_total_price():` and a method to clear the cart session `clear()`
    
#### Creating Shopping Cart Views

- Create views to add, update and remove items from it. 

##### Adding items to the cart

- A form that allows the user to select a quantity. Create a forms.py inside the `cart` application. Have a `PRODUCT_QUANTITY_CHOICES = [(i, str(i)) for i in range(1, 21)]` and a class `CartAddProductsForm():` with `quantity` and `override` in it. 
    - quantity: allows the user to select a quantity between one and 20. Use TypedChoiceField with coerce=int to convert the input into an integer.
    - override: allwos you to indicate whether the quantity has to be added to any exsisting quantity in the cart for this product (False) or whether the existing quantity has to be overridden with the given quanitty (True). Use a HiddenInput widget for this field to not display it to the user.
- Create a view for adding items in the views.py file and add `cart_add(request, product_id)` CONTINUE PAGE 246.
- 
- 

##### Building a template to display the cart

- 
- 
- 
- 
- 

##### Adding products to the cart

- 
- 
- 
- 
- 

##### Updating product quantities in the cart

- 
- 
- 
- 
- 

#### Creating a Context Processor for the Current Cart

- 
- 
- 
- 
- 

##### Contect processors

- 
- 
- 
- 
- 

##### Setting the cart into the request context

- 
- 
- 
- 
- 


>>> DO GROCERIES/GO HOME <<<

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
