# 2020-Django 3 by Example - Chapter 7-9

## Running the Online Shop

### Setting up the virtual environment
mkdir env
python3 -m venv env/myshop 
source env/myshop/bin/activate

### Installing WeasyPrint
- operating system from https:// weasyprint.readthedocs.io/en/latest/install.html

### Installing Gettext for Internationalization
brew install gettext
brew link --force gettext

### Installing the modules
### Chapter 7
pip3 install Django;
pip3 install Pillow==7.0.0;
pip3 install celery==4.4.2;
pip3 install flower==0.9.3;
### Chapter 8
pip3 install braintree==3.59.0;
pip3 install WeasyPrint==51;
### Chapter 9
pip3 install django-rosetta==0.9.3;
pip3 install django-parler==2.0.1;
pip3 install django-localflavor==3.0.1; 
pip3 install redis==3.4.1;


### Sync Database with the models 
python3 manage.py makemigrations
python3 manage.py migrate

### Setting up an Admin-account
python3 manage.py createsuperuser

### Start the Server
Shell 1: brew service start rabbitmq
Shell 2: source env/myshop/bin/activate; celery -A myshop worker -l info
Shell 3: source env/myshop/bin/activate; python3 manage.py runserver
Stop Shell 1: brew service stop rabbitmq

Shell 4: src/redis-server 
Shell 5: python3 manage.py shell # with min 4 products in the database

### Use the STATIC_ROOT setting
python3 manage.py collectstatic

### Server blocked? - just type: 
thisisunsafe

### Testing Payments
Testing credit cards at https:// developers.braintreepayments.com/guides/credit-cards/testing-go-live/python

### Start the translation
django-admin makemessages --all

### Translation Editor
https://poedit.net/


## Chapter 7: Building an Online Shop

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
- Create a view for adding items in the views.py file and add 
    - `cart_add(request, product_id)`: it is the view for adding products to the cart or updating quantities for existing products. Use the `require_POST` decorator to allow only `POST` requests. The view receives the product ID as a parameter. If the form is valid you add or update the product in the cart
    - View `cart_remove(request, product_id)` also with the require_POST decorator
    - view to display the cart and its items: `cart_detail()` gets the current cart to display it
- Create the URL pattern for the cart application and name it urls.py
- Edit the main urls.py file of the myshop project and add the following URL pattern to include the cart URLs 

##### Building a template to display the cart

- Cart_add and cart_remove don't render any templates but create a template for the cart_detail view to display cart items and totals via: `cart/templates/cart/detail.html` > don't split template tags into multiple lines!
- The template contains a table with the items stored in the current cart. It allows users to change the quantity of the selected products, and remove items by providing a __remove__ button that points to the `cart_remove` URL including the `product_ID`.

##### Adding products to the cart

- Edit the views.py to add an `Add to cart` button to the product detail page and add the CartAddProductForm to the product_detail view
- Edit the shop/product/detail.html template of the shop application and add the form to the product price

##### Updating product quantities in the cart

- Allow users to change quantities from the cart detail page. Edit the views.py file of the cart application and change the cart_detail view to cart_detail(request)
- This way, an instance of CartAddProductForm for each item in the cart to allow changing product quantities is created. 
- Initialize the form with the current item quantity and set the override field to True so that when you submit the form to the cart_add view, the current quantity is replaced with the new one.
- Next edit: cart/detail.html template of the cart application and find the table column item.quantity and change it.

#### Creating a Context Processor for the Current Cart

- 'Your cart is empty' is displayed in the header of the site, even when the cart contains items. You should display the total number of items int he cart and the total cost instead. 
- Build a context processor to include the current cart in the request context, regardless of the view that processes the request!

##### Context processors

- A context processor is a Python function that takes the `request` object as an argument and returns a dictionary that gets added to the request context. 
- Context processors come in handy when you need to make something available globally to all templates.
- inside the `TEMPLATES` setting the project automatically contains:
    - `django/template.context_processors.debug`: bool debug and sql_query variables in the context, representing the list of SQL queries executed in the request
    - `django/template.context_processors.request`: sets the request variable in the context
    - `django/template.context_processors.auth`: sets the user variable in the request
    - `django/template.context_processors.messages`: sets a messages variable in the context containing all the messages that have been generated using the messages framework
- Django also enables `django/template.context_processors.csrf` to avoid csrf attacks. IT is always enabled and cannot be turned off.

##### Setting the cart into the request context

- Let us create a new file inside the cart application directory named context_processors.py. They can reside anywhere in the code, but creating them in a dedicated file will keep code organized.
- In the context processor, the cart is instantiated using the request object
- In settings.py add cart.context_processors.cart to the context_processors option inside the TEMPLATES setting: now it will be executed every time a template is rendered using Django's `RequestContext`.
- The cart variable will be set in the context of your templates. 
- Edit the shop/base.html template where 'Your cart is empty was being written and replace it by the dynamic code

### Registering Customer Orders

- Once, a shopping cart is checked out save the order into the database. `Orders` will contain information about customers, and the products they are buying.
- Create the app `python3 manage.py startapp orders` and edit the settings.py file of the project in by adding the `orders` app to the INSTALLED_APPS to activate it

#### Creating order models

- Edit the models.py of the orders application by adding two classes 
    - Order(): first_name, last_name, email, address, postal_code, city, created, updated, paid & get_total_cost(self)
    - OrderItem(): order, product, price, quantity & def get_cost(self)
- `paid` is a bool that defaults to `False` 
- Run `makemigrations` and `migrate` to apply the new migration

#### Including order models in the administration site

- Edit the admin.py of the orders application with classes OrderItemInline and OrderAdmin
- a ModelInline class is used for the OrderItem model which allows to include a model on the same edit page as its related model

#### Creating customer orders

- The order model will be used to persist the items contained in the shopping cart when the user finally places an order. A new order will be created following with the steps:
    - Present a user with an order form to fill in their data
    - Create a new order isntance with the data entered, and create an associated OrderItem insatance for each item in the cart
    - Clear all the cart's content and redirect the user to a success page
- Form to enter the order details: Create a forms.py in the orders application
- Now a view to handle the form and create a new order needs to be added to the views.py file of the `orders` application.
- In the order_create view, the current cart from the session with cart = Cart(request) is obtained. 
    - GET request: instantiates the OrderCreateForm form and renders the orders/order/create.html template
    - POST request: validates the data sent in the request. If the data is valid, you create a new order in the database using order = form.save(). Iterate over the cart items and create an OrderItem for each of them. Finally, clear the cart's content and render the template oreders/order/created.html
- Create a new urls.py within the `orders` application
- Edit the urls.py of myshop and include the pattern before the shop.urls pattern
- Edit the cart/detail.html of the cart application 
- Add the order_create URL
- Users can now navigate from the cart detail page to the order form. 
- Craete the create.html and the created.html files in the orders application templates/orders/order/ ..
- Edit the html files 

### Launching Async Tasks with Celery 

- Everything executed in a view affects response times. Often, return a response quickly and let the server execute some process async'ly.
- Examples:
    - Video Sharing Platform: allows to upload videos but requires long time to transcode them. Hence, the site returns a response to inform the user that the transcoding will start soon while starting the transcoding async'ly.
    - Sending mails to users: SMTP may fail or slow down the response. Launching async tasks is essential to avoid blocking the code execution.
- Celery is a distributed tasks queue that can process vast amounts of messages. Using Celery not only can create asnyc tasks easily and let them be executed by workers asap, but they can also be scheduled to run at a specific time.

#### Installing Celery

- Install it using pip3. Celery requires a message broker in order to handle requests from an external source. A message broker is used to translate messages to a formal messaging protocol and manage message queues for multiple receivers, providing reliable storage and guaranteed message delivery. 
- It is used to send messages to Celery workers, which process tasks as they receive them.

#### Installing RabbitMQ

- There are several options including key/value stores like Redis or an actual message system such as RabbitMQ
- RabbitMQ is the recommended message worker for Celery. It is lightweight, it supports multiple messaging protocols, and it can be used when scalability and high availablity are required
- Find it on www.rabbitmq.com/download.html and run it in shell via `rabbitmq-server`

#### Adding Celery to your project

- Provide a configuration for the Celery insatance by creating a new file next to the settings.py named celery.py. It will contain the Celery config for the project 
- The code does:
    - Set the DJANGO_SETTINGS_MODULE variable for the Celery command-line program
    - Create an instance of the application with app = Celery('myshop')
    - Load any custom config from the project settings using the config_from_object() method. The `namespace` attribute specifies the prefix that Celery-related settings will have in the settings.py file. By setting the namespace all Celery settings need to include the CELERY_prefix 
    - Tell Celery to auto-discover asnyc tasks for the applications. Celery will look for a tasks.py file in each application directory of applications added to INSTALLED_APPS in order to load async tasks defined in it
- import celery in the __init__.py of the project (myshop) to make sure it is loaded when Django starts

#### Adding Async Tasks to your Application

- Create an async task to send an email notification to your users when they place an order. The convention is to include asnyc tasks for application in a task module in the application directory
- Create a file named tasks.py in the orders application
- @task def order_created(order_id) [...] return mail_sent: a Celery task is just a Python function decorated with @task. 
- The `task` function receives an `order_id` parameter. It is recommended to only pass IDs to task functions and lookup objects when the task is executed. 
- Use the send_mail function provided by Django to send an email notification to the user who palced the order.
- Tell Django to write emails through the console by editing the settings.py
- Now add the tasks to the order_create view by editing the views.py in the orders application. Call the asnyc tasks by calling the delay() method. The task will be added to the queue and will be executed by a worker asap.
- Open another shell and start the Celery worker from your project directory using `celery -A myshop worker -l info`: the Celery worker is now running and ready to process tasks. 
- Test it by completing an order.

#### Monitoring Celery

- Monitoring async tasks that are executed are being done by Flower a web-based tool. 
- Install via pip3 install flower==0.9.3
- Launch Flower by running th ecommand from the project directory: `celery -A myshop flower`
- Open localhost:5555/dashboard to see the active Celery workers and async task statistics
 
### Summary

- basic shop application created
- made a product catalogue and built a shopping cart using sessions
- implement a custom context processor to make the cart avail to templates
- launch async tasks with Celery

## Chapter 8: Managing Payments and Orders

### Integrating a Payment Gateway

- A payment gateways allows to process payments online. 
- Manage customer's orders and delegate payment processing to a reliable, secure third party. 
- Integration options: Simple Drop-in, and advanced Hosted Fields.
- Certain fields (CVV, Credit Card Number and Expiration Date) must be hosted securely. The Hosted Fields integration hosts the checkout fields on the payments gateway's domain and renders an iframe to present the fields to users. 

#### Creating a Braintree Sandbox Account

- Get a Braintree account to get the Sandbox Keys and Configuration 
- From https://sandbox.braintreegateway.com/merchants/v8d2gtrj332vzc68/home

#### Installing the Braintree Python Module

- Install the braintree Python module that simplifies dealing with their API: `pip3 install braintree==3.59.0`
- Add Braintree settings to the settings.py file as: 

`# Braintree settings
BRAINTREE_MERCHANT_ID = 'XXX' # Merchant ID 
BRAINTREE_PUBLIC_KEY = 'XXX' # Public Key 
BRAINTREE_PRIVATE_KEY = 'XXX' # Private key
import braintree
BRAINTREE_CONF = braintree.Configuration( 
    braintree.Environment.Sandbox, 
    BRAINTREE_MERCHANT_ID, 
    BRAINTREE_PUBLIC_KEY, 
    BRAINTREE_PRIVATE_KEY)`

#### Integrating the Payment Gateway

- Checkout process: 
    - Add items to the shopping cart
    - Check out the shopping cart
    - Enter credit card dertails and pay
- Create a new application via `python3 manage.py startapp payment` and edit the settings.py file 
- Register it in the INSTALLED_APPS of the settings.py
- After clients place an order, you need to redirect them to the payments process. Edit the `views.py` of the orders application and include the imports: reverse, redirect
    - After successfully creating an order, set the order ID in the current session using the order_id session key
    - Redirect the user to the payment:process URL 
    - run Celery in order for the order_created task to be queued and executed
    - every time an order is created in Braintree, a unique transaction identifier is generated. 
- Edit the `models.py` field of the orders application to store the transaction ID and sync it with the database. Apply the migrations. 

##### Integrating Braintree using Hosted Fields

- Hosted FIelds integration allows to craete an own payment form using custom styles and layouts. An iframe is added dynamically to the page using Braintree SDK. It includes the Hosted Fields payment form.
- When the customer submits the firm, Hosted Fields collects the card details securely and attempts to tokenize them. If tokenization succeeds, you can send the generated token nonce to your view to make a transaction using the Python braintree module.
- A token nonce is a secure, one-time-use reference to payment information. It allows to send sensitive payment information to Braintree without touching the raw data.
- Let's create views for processing payments. Checkout works as: 
    - In the view, a client token is generated using the braintree Python module. It is used to instantiate the Braintree JavaScript client; it is not the payment token nonce.
    - The view renders the checkout template. The template loads the Braintree JavaScript SDK using the client token and generates the iframe with the hosted payment form fields.
    - Users enter their credit card details and submit the form. A payment token none is generated witht eh Braintree JavaScript client. You send the token to your view with a POST request.
    - The payment view receives the token nonce and you use it to generate a transaction using the braintree Python module.
- Let us start with the payment checkout view: edit the `views.py` of the payment application. 
    - import braintree module and create an instance of the Braintree gateway. 
    - the payment_process view manages the checkout process:
        - get the current order from the order_id session key which was stored previously in the session by the order_create view
        - retrieve the Order object for the given ID or raise an Http404 if not found
        - When view is loaded with a POST request, retrieve the payment_method_nonce to generated a new transaction using gateway.transaction.sale() passing in `amount` and `payment_method_nonce`, options.
    - If the transaction is successfully processed, you mark the order as paid by setting its `paid` attribute to True and store the unique transaction ID returned by the gateway in the braintree_id attribute. Redirect the user to the payment:done URL if the payment is successful, otherwise redirect them to payment:canceled.
    - If the view was loaded with a GET request, generate a client token with gateway.client_token.generate() that will be used in the template to instantiate the Braintree JavaScript client.
- Edit `views.py` of the payment application to create a basic view to redirect users when their payment has been successful, or when it has been canceled for any reasons.
- Create a `urls.py` in the payment application for the payment workflow:
    - process: The view that processes the payment.
    - done: The view to redirect the user if the payment is successful
    - canceled: The view to redirect the user if the payment is not successful
- Edit the main `urls.py` of the `myshop` project and include the URL patterns for the payment application; __RMB:__ place the new path before the shop.urls pattern to avoid an unintended pattern match with a pattern defined in shop.urls. Django runs through each URL pattern in order and stops at the first one that matches the requested URL.
- Create html files in the templates/payment/ 
    - process.html: this template displays the payment form and processes the payment. Define <div> containers instead of <input> elements for the credit card input fields: the credit card number, CVV number, and expiration date. This is how you specify the fields that the BrainTree Javascript client will render in the iFrame. Also include an <input> element named payment_method_nonce that you will use to send the token nonce to your view once it is generated by the Braintree Javascript client.
    - done.html: it is the template for a successful payment.
    - canceled.html: redirect if the payment was not successful.

#### Testing Payments
- Open a shell and run RabbitMQ with the command `rabbitmq-server`
- Open another shell and start the Celery worker with `celery -A myshop worker -l info`
- Open another shell and start the development server with `python3 manage.py runserver` 
- Testing credit cards at https:// developers.braintreepayments.com/guides/credit-cards/testing-go-live/python
- Find the transaction in the braintree account.
- Open: http://127.0.0.1:8000/admin/orders/order/ and find the order being marked as paid and containt the related Braintree transaction ID
- Note: the payment_process view does not handle transaction declines. Braintree provides you with the processor response codes thar are returned by the credit card processor. These are especially useful to know why a transaction might have been declined:
    - Obtain response code: result.transaction.processor_ response_code
    - Associated response text: result.transaction. processor_response_text
    - List of payment auth responses:  https://developers.braintreepayments.com/reference/general/ processor-responses/authorization-responses

#### Going Live

- once tested the environment, you can create a real account at https://www.braintreepayments.com
- change credentials in the settings.py braintree.Environment.Production
- all steps to go live are summarized at https://developers. braintreepayments.com/start/go-live/python

### Exporting Orders to CSV files

- Edit the admin site to export orders.


#### Adding Customer Action to the Administration Site

- Object list view will be modified to include a custom admin action. You can implement custom admin actions to allow staaff users to apply actions to multiple elements at once in the change list view. 
- An admin action works as follows: a user selects objects from the admin object list page with checkboxes, then they select an action to perform on all of the selected items, and execute the actions. 
- Create a custom action by writing a regular function that receives the following parameters 
    - the current ModelAdmin being displayed
    - the current request object as an HttpRequest instance
    - a QuerySet for the objects selected by the user
- Create a custom admin action to download a list of orders as a CSV file. Edit the `admin.py` file of the orders application and add code before the OrderAdmin class  with a function `export_to_csv()` 
    - create an instance of HttpResponse specifiying the text/csv contetn type, to tell the browser that the response has to be treated as a CSV file; also add the Content-Disposition header to indicate that the HTTP response contains an attached file.
    - Create a CSV writer object that will write to the response object.
    - Get the model fields dynamically using the get_fields() method of the mode _meta options. 
    - Write a header row including the field names.
    - Iterate over the given QuerySet and write a row for each object returned by the QuerySet. Take care of formatting datetime objects because the output value for CSV has to be a string.
    - Customize the display name for the action in the actions dropdown element of the admin sitye by setting a short_description attribute on the function
    - Add the `export_to_csv` admin action ot the OrderAdmin class 
- try it on the server. 

#### Extending the Administration Site with Custom Views

- You may want to implement additonal functionalities that are not avail in the existing admin views or templates. In this case create a custom admin view. 
- With a custom view, you can build any functionality you want, just make sure that only staff users can access your view and maintain the admin look and feel by making the template extend the admin template
- Edit the `views.py` of the orders application and add: admin_order_detail() and a @staff_member_decorator that checks that both the is_active and is_staff fields of the user requesting the page are set to True. 
- Edit the `urls.py` file of the orders application and add teh URL pattern to it.
- Create a file structure inside templates/ i.e. admin/orders/order/detail.html with a breadcrumbs block in it 
    - the template displays the details of an order 
    - the template extends the admin/base_site.html which contains the main HTMl strucures and CSS styles
    - use the blocks defined in the parent template to include your own content. Display information about the order and the items bought. 
    - When you want to extend the admin template, you need to know its structure and identify existing blocks. Infos here: https:// github.com/django/django/tree/3.0/django/contrib/admin/templates/admin.
    - Override an admin template if needed, by just copying it in the templates/ directory keeping the same relative path and filename. Django's admin site will use your custaom template instead of the default one.
    
- Finally, add a  link to each Order object in the list display page. Edit the `admin.py` file of the orders application by adding a function that takes an Order object as an argument and returns an HTML link for the admin_order_detail URL. Django escapes HTML output by default. Use mark_safe function to avoid auto-escaping. 

### Generating PDF invoices dynamically

- With a complete checkout system, generate PDF invoices for each order. One popular library to generate PDF files is [ReportLab](https://docs. djangoproject.com/en/3.0/howto/outputting-pdf/)
- In most cases, add custom styles and formatting to your pdf files. Therefore, it is more convenient to render an HTML template and convert it into a PDF file, keeping Python away from the presentation layer. 
- Use WeasyPrint which is a Python library that can generate PDF files from HTML templates.

#### Installing WeasyPrint

- first install, WeasyPrint's dependencies for MacOS operating system: for your operating system from https:// weasyprint.readthedocs.io/en/latest/install.html, then install it via pip3 
- pip3 install WeasyPrint==51

#### Creating a PDF Template

- Create a HTML template that will be rendered using Django, and passed into WeasyPrint to generate a PDF file.
- Create a new template file inside the tempaltes/orders/order/ directory of the orders application and name it pdf.html. 
- In the template all order details and an HTML <table> element including the products. Also a message is included whether the order has been paid. 

#### Rendering PDF files

- Create a view to generated PDF invoices for existing orders using the admin site. Edit the `views.py` file inside the orders application directory and add a `admin_order_pdf()` @staff_member_required function to it.
- This is the view to generate a PDF invoice for an order. 
- Get the Order object with the given ID and use the render_to_string() function provided by Django to render orders/order/pdf.html
- Generate a new httpResponse object specifying the application/pdf content type and including the Content-Disposition header to specify the filename. You use WeasyPrint to generate a PDF file from the rendered HTML code and write the file to the HttpResponse object
- Use the static file css/pdf.css to add CSS Style to the generated PDF file. Then, load it from the local path by using the STATIC_ROOT setting. Finally, return the generated response. 
- If you are missing the CSS styles, remember to copy the static files located in the static/ directory of the shop application to the same location of your project
- since you need the STATIC_ROOT setting, you have to add it to your project. This is the project's path where static files reside. Edit the settings.py file of the myshop project and add the setting. 
- Then run `python3 manage.py collectstatic` as it copies all static files from your application into the directory defined in the STATIC_ROOT setting. This allows each application to provide its own static files using a static/ directory containing them. 
- Additional static files sources can be provided in the STATICFILES_DIRS setting. 
- Edit the `urls.py` inside the orders application directory and add the URL pattern to it
- Now the administration list display page for the Order model to add a link to the PDF file for each result. Edit the main.py file in the orders application and add an order_pdf() method. If you use a `short_description` attribute, Django will use it for the name of the column.
- Add order_pdf() to the list_display attribute. Click on the PDF link for any order and get a generated PDF. 

#### Sending PDF files by email

- When a payment is successful, you will send an automatic email to the customer including the generated PDF invoice. An async task will perform this action. 
- Create a new file inside the payments applciation directory named `tasks.py` with an @task-decorated function named `payment_completed()` that creates the invoice mail, generates the pdf, attaches the pdf file , and sends the e-mails.
- Either send the mail through the django backend or refer to Chapter2, Enhancing Your Blog with Advanced Features
- add the `payments_completed()` task to the view by editing the `views.py` file of the payment application
- You can call the `payment_completed()` task when a payment is successfully completed. Then, call the delay() method of the task to execute it async'ly. The task will be added to the queue and will be executed by a Celery worker as soon as possible. 

### Summary

- Braintree payment was integrated into the project using the Hosted Fields integration. Built a custom administration action to export orders to CSV.
- Customized the Django admin site using custom views and templates. 
- Finally, learned how to generate PDF files with WeasyPrint and how to send them by email. 

## Chapter 9: Extending Your Shop

### Creating a Coupon System

- Online Coupon: can be redeemed for discounts on purchases
- Usually consists of a code that is given to users and is valid for a specific time frame
- Create a coupon system for your shop; no limitation in terms of the number of times it can be redeemed
- create a new application inside the myshop project `python3 manage.py startapp coupons`, edit the settings.py of `myshop` and add the application to the INSTALLED_APPS

#### Building the Coupon Model

- Edit the `models.py` of the coupons appilcation by adding a Class Coupon(); makemigrations & migrate to sync with the database
    - code: charField
    - valid_from: DateTimeField()
    - valid_to: DateTimeField()
    - discount: IntegerField(validators=min/max)
    - active: bool
- Add a coupon model to the administration site. Edit the `admin.py` file of the coupons application @admin.register(Coupon):
    - list_display: 
    - list_filter: 
    - search_fields: 

#### Applying a Coupon to the Shopping Cart

- Store new coupons and make queries to retrieve existing coupons. Functionality for users: 
    - User adds products to the shopping cart.
    - User can enter a coupon code in a form displayed on the shopping cart detail page.
    - When user enters a coupon code and submits the form, you look for an existing coupon with the given code that is currently valid. You have to check that the coupon code matches the one entered by the user, that the active attribute is `True` and that the current datetime is between the valid_from and valid_to values.
    - if a coupon is found, save it in the user's session and display the cart, including the discount applied to it and the updated total amount
    - When the user places an order, you save the coupon to the given order.
- Create a new file inside the coupons application directory and name it `forms.py`. 
- Edit the `views.py` file inside the coupon application and add the functions `coupon_apply()` which validates the coupon and stores it in the user's session. 
    - Instantiate the CouponApplyForm form using the posted data and check that the form is valid
    - If the form is valid, you get the code entered by the user from the form's cleaned_data dictionary. Try to retrieve the Coupon object with the given code. 
    - Use an iexact field lookup to perform a case-insensitive exact match. The coupon has to be currently active and valid for the current datetime. Use Django's timezone.now() function to get the current timezone-aware datetime and you compare it with the valid_from and valied_to fields performing lte (less than or equal to) and gte (greater than equal to) field lookups, respectively.
    - Store the coupon ID in the user's session.
    - Redirect the user to the cart_detail URL to display the cart with the coupon applied.
- You need a URL pattern for the coupon_apply view. Create a new file inside the coupons application directory and name it `urls.py`. Then edit the `urls.py` of the myshop project and include the coupons URL; place it before the shop.urls pattern
- Edit the `cart.py` file in the cart application. Include the Coupon import and add it to the Cart() class
- In the code, try to get the coupon_id sessions key from the current session and store its value in the Cart object:
    - coupon(): define this method as a property. If the cart contains a coupon_id attribute, the Coupon object with the given ID is returned.
    - get_discount(): if the cart contains a coupon, you retrieve its discount rate and return the amount to be deducted from the total amount of the cart.
    - get_total_price_after_discount(): return the total amount of the car after deducting the amount returned by the get_discount() method
- Cart class is now prepared to handle a coupon applied to the current session and apply the corresponding discount. Include the coupon system in teh cart's detail view. 
- Edit the `views.py` file of the cart application and add the import at the top of the file CouponApplyForm and edit the cart_detail view ; also change the detail.html to display an optional coupon and its discount rate. If the cart contains a coupon, display a first row, including the total maount of the cart as the subtotal. Then, you use a second row to display the current coupon applied to the cart. Finally, display the total price, including any discount by calling the get_total_price_after_discount() method of the cart object.
- Add the coupon to the purchase process by editing orders/order/create.html template of the orders application so that the order summary also contains the coupon applied 

#### Applying Coupons to Orders

- Store the coupon that was applied to each order. First modify the Order model to store the related Coupon object, if there was one by editing `models.py`:
    - coupon: store an optional coupon for the order 
    - discount: and the discount percentage applied with the coupon
- The discount is storedn in the Coupon object but you include it int he Order model to preserve it if the coupon is modified or deleted
- set on_delete to models.SET_NULL so that if the coupon gets deleted, the coupon filed is set to NULL but the discount is preserved.
- Create a migration to include the new fields of the Order model. 
- Return to `models.py` fiel and change the `get_total_cost()` method of the Order model
- Th get_total_cost() method of the Order model will now take into account the discount applied
- Edit the `views.py` file of the orders application and modify the order_create view. In the new code you create an Order object using the save() method of the OrderCreateForm form. Avoid saving it to the database yet by using commit=False. If the cart contains a coupon, you store the related coupon and the discount that was applied. Then, you save the order object to the database.

### Adding Internationalization and Localization

- Django offers full internationalization and localization support. It allows to translate the application into multiple languages and it handels formatting for dates, times, numbers and timezones. 
- Internationalization (i18n): process of adapting software for the potential use of different languages and locals, so that it isn't hardwired to a specific language or locale 
- Localizaton (l10n): process of actually translating the software and adapting it to a particular locale. 

#### Internationalization with Django

- allows to easily mark strings for translation both in Python code and in templates. Relies on the GNU gettext toolset to generate and mange message files.
- Message file is a plain text fiel that represents a language. It contains a part, or all, of the translation strings found in your application and their respective translations for a single language. 
- Message files have the .po extension. Once the translation is done, message files are compiled to offer rapid access to translated strings.
- The compiled translation files have the .mo extension.

##### Internationalization and Localization Settings

Settings for internationalization.

- USE_I18N: A bool that specifies whether Django's translation system is enabled. This is `True` by default.
- USE_L10N: A bool indicating whether localized formatting is enabled. When active, localized formats are used to represent dates and numbers. This is `False` by default.
- USE_TZ: Bool specifying if datetimes are timezone-aware.
- LANGUAGE_CODE: default language code for the project.
- LANGUAGES: A tuple that contains available lanuages for the project. They come in two tuples of a language code and language name. You can see the list of available languages at django.conf.global_settings.
- LOCALE_PATHS: A list of directories where Django looks for message files containing translations for the project.
- TIME_ZONE: A string that represents the timezone for the project. Set to 'UTC' when you create a new project using the startproject command.

##### Internationalization Management Commands

- Django includes:
    - makemessages: runs over the source tree to find all strings marked for translation and creates or updates the .po message files in the locale directory. A single .po file is created for each language.
    - compilemessages: This compiles the existing .po message files to .mo files that are used to retrieve translations.
- You need the gettext toolkit to be able to create, update, and compile message files. Install it via homebrew 'brew install gettext'
- maybe force link it via `brew link --force gettext`.

##### How to add translations to a Django project

- Mark strings for translation in code and templates
- Run the makemessages command to create or update message files that include all translation strings from your code 
- Translate the strings contained in the message files and compile them using the complilemessages management command

##### How Django determines the Current Language

- Django has a middleware that determines the current language based on the request data. It is LocaleMiddleware that resides in django. It performs the following tasks:
    - If you are using the i18n_patterns you are using translated URL patterns, it looks for language prefix in the requested URL to determine the current language.
    - If no language prefix is found, it looks for an existing LANGUAGE_SESSION_KEY in the current user's session.
    - If the language is not set in the session, it looks for an existing cookie with the current language. A custom name fo rthsi cookie can be provided in the LANGUAGE_COOKIE_NAME setting. By default, the name for this cookie is django_language.
    - If no cookie is found, it looks for Accept-Language HTTP hedaer of the request. 
    - If the Accept-Language header does not specify a language, Django uses the language defined in the LANGUAGE_CODE setting.
    
- By default, Django uses the language defined in the LANGUAGE_CODE setting unless you are using LocaleMiddleware. The process described here only applies when using this middleware.

#### Preparing your Project for Internationalization

- Create an English and Spanish version for the shop. Edit the `settings.py` of the project and add the `LANGUAGES` setting to it. Place it next to the `LANGUAGE_CODE`. 
- The setting contains two tuples that consist of a language code and a name. Language codes can be locale-specific, such as `en-us` or `en-gb`, or generic, such as `en`. With this setting, you specify that your application will only be available in English or Spanish. If yoy don't define a custom `Languages` setting, the site will be available in all the languages that Django is translated into. 
- Add LocaleMiddelware to the middleware setting. It needs to use session data. 
- Create a directory structure inside the main project directory, next to the manage.py file.
- The locale directory is the place where message files for your application will reside. 
- The locale_paths setting specifies the directory where Django has to look for translation files. Locale paths that appear first have the highest precedence.
- When you use the makemessages command from your project directory, message files will be generated in the locale/ path you created. However, for applications that contain a locale/ directory, message files will be generated in that directory. 


#### Translating Python Code

- To translate literals in Python, mark strings for translation using the gettext() function included in django.utils.translation. The function translates the messages and returns a string. 
- Convention is to import this function as a shorter alias named_ (underscore character).

##### Standard translation

- Mark a string for translation

```python
from django.utils.translation import gettext as _ 
output = _('Text to be translated.')

```
##### Lazy translations

- Django includes lazy versions for all of its translation functions with the suffix _lazy(). 
- When using the lazy functions, strings are translated when the value is accessed, rather than when the function is called
- The lazy translation functions come in handy when strings marked for translation are in paths that are executed when modules are loaded

##### Translations including Variables

- The strings marked for translation can include placeholders to include variables in the translations. The following code is an example of a translation string with a place holder:

```python
from django.utils.translation import gettext as _
month = _('April')
day = '14'
output = _('Today is %(month)s %(day)s') % {'month': month, 'day': day}

```
- 
-By using placeholders, you can reorder the text variables, i.e. 
    - English: today is April 14
    - Spanish: hoy es 14 de Abril
- always use string interpolation instead of positional interpolation when you have more than one parameter for the translation string. This way, you will be able to reorder the placeholder text.

##### Plural forms in translations

- for plural forms, you can use the ngettext() and ngettext_lazy() functions as they translate singular and plural forms depending on an argument that indicates the number of objects

##### Translating your own code

- Edit the `settings.py` file of your project, import the gettext_lazy() function, and change the `language` setting 
- Open the shell and run `django-admin makemessages --all` which will cause `processing locale es` and `processing locale en`
- In the locale/ directory there should be two *.po files
- Each translation string is preceded by a comment showing details about the file and the line where it was found. Each translation includes two strings: 
    - msgid: The translation string as it appears in the source code.
    - msgstr: The language translation, which is empty by default. This is where you have to enter the actual translation for the given string.
    
- Fill the msgstr translations for the given msgid string
- Save the modified message file, open the shell, and run the `django-admin compilemessages` command which will create two *.mo files
- Now the language names are translated, next is the field names on a site. Mark the fields with the _ indicator
- create a locale directory in the application to generate separate translation files for each application; add the django.po file in the order application using a text editor and insert the translations, then save the file.
- Also Poedit can be used to edit translations. You can download Poedit from https://poedit.net/.

- Translating a form works through importing the gettext_lazy as _ import
- and then by marking e.g. _('Quantity') as well

#### Translating Templates
- To use the hereafter tags you need to {% load i18n %} at the top of the template
 
##### The {% trans %} template tag

- This allows to mark a literal for translation. Internally, Django executes the gettext() on the given text:  `{% trans "Text to be translated" %}`
- You can use `as` to store the translated content in a variable that you can use throughout your template:    `{% trans "Hello!" as greeting %}
   <h1>{{ greeting }}</h1>` 

##### The {% blocktrans %} template tag

- This tag allows to mark content that includes literals and variable content using placeholders. The following example shows you how to use the tag, including a name variable in the content for translation: `   {% blocktrans %}Hello {{ name }}!{% endblocktrans %}`
- You can use `with` to include template expressions, such as accessing object attributes or applying template filters to variables. Always use placeholders for these. You can't access expressions or object attributes inside the blocktrans block.

##### Translating the shop templates

- Edit the `shop/base.html` template by integrating the tag {% load i18n %} at the top and e.g. {% trans "My Shop" %} wherever you want to make a translation. Don't split any template tag across multiple lines.
- You changed it and now you use {% blocktrans with ... %} to set up the placeholder total with the value of cart.get_total_price (the object method called here). You also use count, which allows you to set a variable for counting objects for Django to select the right plural form. You set the items variable to count objects with the value of total_items. This allows you to set a translation for the singular and plural forms, which you separate with the {% plural %} tag within the {% blocktrans %} block
- Next edit the `shop/product/detail.html` template of the shop application
- After editing all the files (e.g. list.html, created.html, and detail.html), update the message files to include the new translation strings via `django-admin makemessages --all`
- The .po files are inside the locale directory of the myshop project; next run `django-admin compilemessages` to compile the translations.

#### Using the Rosetta Translation Interface

- Rosetta is a third-party application that allows you to edit translations using the same interface as the Django admin site. Rosetta makes it easy to edit .po files and it updates compiled translation files.
- Add Rosetta to the `INSTALLED_APPS` setting in the settings.py.
- Add Rosetta's URL to your main URL configuration. Edit the main urls.py file of your project and add the URL pattern to it. Place it before the shop.urls.
- Navigate to to http://127.0.0.1:8000/rosetta/ after having signed in as a superuser. 
- In the filter select THIRD PARTY to display all available message files, including those that belong to the orders application.
- Click the Myshop link under the Spanish section to edit the Spanish translation. 
- You can enter translations under the SPANISH column. Translations that include placeholders will also appear.
- Rosetta uses different background colors to display placeholders. When you translate content, make sure that you keep placeholders untranslated. 
- When translations are finished click "Save and translate next block". With this procedure the `compilemessages` command is not needed to be run. 
- If you want other users to be able to edit translations, open http://127.0.0.1:8000/admin/auth/group/add/ in your browser and create
a new group named translators. Then, access http://127.0.0.1:8000/admin/ auth/user/ to edit the users to whom you want to grant permissions so that they can edit translations. When editing a user, under the Permissions section, add the translators group to the Chosen Groups for each user. Rosetta is only available to superusers or users who belong to the translators group.

#### Fuzzy Translations

- FUZZY column in Rosetta is to mark translations that need to be reviewed by a translator.
- When .po files are updated wit new translation strings, it is possible that some strings are automatically flagged as fuzzy. 
- This happens when gettext() finds some msgid that has been slightly modified. 

#### URL patterns for Internationalization

- Django offers interantionalization capability for URLs. It includes two main features:
    - Language prefix in URL patterns: adding a language prefix to URLs to serve each language version under a different base URL.
    - Translated URL patterns: Translating URL patterns so that every URL is different for each language.
- A reason for translating URLs is to optimize the site for search engines. By adding a language prefix, you will be able to index a URL for each language instead of a single URL for all of them. Also, URLs will rank better for each language.

##### Adding a language prefix to URL patterns

- To use languages in URL patterns, you have to use the LocaleMiddleware provided by Django. 
- The framework will use it to identify the current language from the requested URL. 
- You added it previously to the MIDDLEWARE setting of your project, so you don't need to do it now.
- Edit the  main `urls.py` file of the myshop project and add i18n_patterns()
- Combine non-translatable standard URL patterns and patterns under i18n_pattenrs so taht some patterns include a language prefix and others don't
- However, it's better to use translated URLs only to avoid the possibility that a carelessly translated URL matches a non-translated URL pattern

##### Translate URL patterns

- Django supports translated strings in URL patterns.
- You can use a different translation for each language for a single URL pattern. 
- You can mark URL patterns for translation in the same way as you would with literals, using the gettext_ lazy() function.
- Edit the main `urls.py` file of the myshop project and add translation strings to the regular expression of the URL patterns for the cart, orders, payment, and coupons application, add `from django.utils.translation import gettext_lazy as _
`
- Update the message files with `django-admin makemessages --all` 
- Go to the spanish section via `http://127.0.0.1:8000/en/ rosetta/` to translate the URLs.

#### Allowing Users to Switch Language

- Allow your users to switch the language. Hence, add a language selector to the site. It wil consist of a list of available languages displayed using links. 
- Therefore, change the base.html of the shop application. Functions as:
    - Load internationalization tags using {% load i18n %}
    - Use the {% get_current_language %} tag to retrieve the current language
    - Get the languages defined in the LANGUAGES setting using the {% get_available_languages %} template tag
    - Use the tag {% get_language_info_list %} to provide easy access to the language attributes
    - Build an HTML list to display all available languages and you add a selected class attribute to the current active language

#### Translating Models with django-parler

- Django does not provide a solution for translating models 
- A third-party applications is django-parler it offers a very effective way to translate models and it integrates smoothly with Django's administration site
- django-parler generates a separate database table for each model that contains translations. This table includes all the translated fields and a foreign key for the original object that the translation belongs to. It also contains a language field, since each row stores the content for a single language

##### Installing django-parler

- run pip3 install django-parler.
- Edit the settings.py and add 'parler' to the `INSTALLED_APPS` setting to define the available languages.

##### Translating model fields

- django-parler provides a TranslatableModel model class and a TranslatedFields wrapper to translate model fields. 
- Edit the models.py file inside the shop application directory and add the related import
- then modify the Category model to make them translatable; the model now inherits from the TranslatableModel instead of models. Model and both the name and slug fields are included in the TranslatedFields wrapper.
- django-parler manages translations by generating another model for each translatable model.
- The ProductTranslation model generated by django-parler includes the name, slug, and description translatable fileds, a language_code field and a ForeignKey for the master Product object. There is a one-to-many relationship from Product to ProductTranslation. 
- A ProductTranslation object will exist for each available language of each Product object. 
- Since Django uses a separate table for translations, there are some Django features that you can't use.
- It is not possible to use a default ordering by a translated field. You can filter by translated fields in queries, but you can't include a translatable field in the ordering Meta options. Edit the models.py file of the shop application and comment out the ordering attribute of the Category Meta class.
- You also have to comment out the ordering and index_together attributes of the Product Metaclass. The current version of django-parler does not provide support to validate index_together. Comment out the Product Metaclass.
- 
##### Integrating translations into the Admin site

- django-parler integrates smoothly with the Django admin site. It includes a TranslatableAdmin class that overrides the ModelAdmin class provided by Django to manage model translations. 
- Edit the admin.py of the shop application, and the classes CategoryAdmin and ProductAdmin
- You have adapted the administration site to work with the new translated models. You can now sync the database with the model changes that you made.

##### Creating migrations for model translations

- Open the shell and run the command to create a new migration: 'python manage.py makemigrations shop --name "translations"'
- This migration automatically includes the CategoryTranslation and ProductTranslation models created dynamically by django-parler
- It's important to note that this migration deletes the previous existing fields from your models. This means that you will lose that data and will need to set your categories and products again in the administration site after running it.
- Integrate a fix, and then migrate the database. 
- Run the server and open http://127.0.0.1:8000/en/admin/shop/category/; check: that you have two columns for the categories now.

##### Adapting views for translations

- let's take a look at how you can retrieve and query translation fields. To get the object with translatable fields translated in a specific language, you can use Django's activate() function
- Another way to do this is by using the language() manager provided by django- parler
- When you access translated fields, they are resolved using the current language. You can set a different current language for an object to access that specific translation.
- When performing a QuerySet using filter(), you can filter using the related translation objects with the translations__ syntax.
- Let's adapt the product catalog views. Edit the views.py file of the shop application and, in the product_list view & edit the product_detail view.
- The product_list and product_detail views are now adapted to retrieve objects using translated fields.
- URL for a product in Spanish is http://127.0.0.1:8000/es/2/te-rojo/, whereas in English, the URL is http://127.0.0.1:8000/en/2/red-tea/
- You have learned how to translate Python code, templates, URL patterns, and model fields. To complete the internationalization and localization process, you need to use localized formatting for dates, times, and numbers as well

#### Format Localization

- Depending on the user's locale, you might want to display dates, times, and numbers in different formats.
- Localized formatting can be activated by changing the USE_L10N setting to True in the settings.py file of your project
- Django will try to use a locale-specific format whenever it outputs a value in a template. You can see that decimal numbers in the English version of your site are displayed with a dot separator for decimal places, while
in the Spanish version, they are displayed using a comma. This is due to the locale formats specified for the es locale by Django.
- Django offers a {% localize %} template tag that allows you to turn on/off localization for template fragments. This gives you control over localized formatting. You will have to load the l10n tags to be able to use this template tag
- Django also offers the localize and unlocalize template filters to force or avoid the localization of a value

#### Using django-localflavor to validate form fields

- django-localflavor is a third-party module that contains a collection of utils, such as form fields or model fields, that are specific for each country
- It's very useful for validating local regions, local phone numbers, identity card numbers, social security numbers, and so on
- Install django_localflavor by `pip install django-localflavor==3.0.1`
- Register it in the `settings.py`
- Add the United States zip code field so that a valid US zip code is required to create a new order
- Edit the forms.py file of the orders application and import the USZipCodeField() from the us package of localflavor
- The local components provided by localflavor are very useful for adapting your application to specific countries

### Building a Recommendation Engine

- A recommendation engine is a system that predicts the preference or rating that a user would give to an item. The system selects relevant items for a user based on their behavior and the knowledge it has about them. Nowadays, recommendation systems are used in many online services. They help users by selecting the stuff they might be interested in form the vast amount of avialable data that is irrelevant to them. 
- Offering good recommendations enhances user engagement. E-commerce sites also benefit from offerin relevant product recommendations by increasing their average revenue per user. 
- You will suggest products based on historical sales, thus identifying products that are usually bought together. You are going to suggest complementary products in two different scenarios:
    - Product detail page: display a list of products that are usually bought with the given product. This will be displayed as users who bought this also bought X, Y, Z. You need a data structure that allows you to store the number of items that each product has been bought toegther with the product being displayed.
    - Cart detail page: Based on the rpdocuts users add to the cart, you are going to suggest products that are usually bought together with these ones. In this case, the score you calculate to obtain related products has to be aggregated.
- Redis will store products that are purchased together.

#### Recommending Products based on Previous Purchases

- recommend products to users based on what they have adeded to the cart. Therefore, store a key in Redis for each product bought on your site. The product key will contain a Redis sorted set with scores. 
- You will increment the score by 1 for each product bought together every time a new purchase is completed. The sorted set will allow you to five scores to products that are bought together.
- Install the `redis-py` in your environment using `pip install redis==3.4.1`
- Edit the settings.py and add the Redis settings to it (HOST, PORT, DB). 
- These are the required settings to establish a connection with the Redis server. Create a new file inside the shop application directory and name it `recommender.py` 
    - the Recommender class willl allow you to store product purchases and retrieve product suggestions for a given product or products
    - the get_product_key() method receives an ID of a Product object and builds the Redis key for the sorted set where related products are stored, which looks like product:[id]:purchased_with
    - the product_bought() method receives a list of Product objects that have been bought together (belong ot the same order)
        - get the product ID of the given Products objects
        - iterate over the produc IDs. For each ID, iterate again over the product IDs and skip the same product so that you get the products that are bought togehter.
        - get the Redis product key for each product bought using the get_product_id() method. 
        - Increment the score of each product ID contained in the sorted set by 1. The score represents the times another product has been bought together with the given product. 
- You know have a method to store and score the products that were bought together. Next, write a method to retrieve the products that were bought together for a given list of products. It is named: suggest_products_for():
    - parameters:
        - products: is a list of Product objects to get recommendations for. It can contain one or more products.
        - max_results: This is an integer that represents the max number of recommendations to return. 
    - functionality:
        - get the productID for the given Product object
        - if only one product is given, retrieve the ID of the products that were bought together with the given product, ordered by the total number of times that they were bought together with ZRANGE command of Redis. Limit the number of results to the number specified in the max_results attribute. 
        - If more than one product is given, you generate a temporary Redis key built with the IDs of the products.
        - Combine and sum all scores for the items, contained in the sorted set of each of the given products. Done with Redis ZUNIONSTORE. This command performs a union of the sorted sets with the given keys, and stores the aggregated sum of scores of the elements ina  new Redis key. Save the scores in the temp key. 
        - Since you aggregate scores, obtain the same products you are getting recommendationsfor. Remove them from the generated sorted set using ZREM. 
        - Retrieve the IDs of the products from the temporary key, ordered by their score using the ZRANGE command. Limit the number of results to the number specified in the max_results attribute. Then, remove the temp key.
        - get the Product objects with the given IDs and order the products in the same order as them.
- Add a function to clear the recommendations clear_purchases().
- Try it by running the redis server via src/redis-server
- Run `python manage.py shell`: Make sure that you have at least four different products in your database. Retrieve four different products by their names
- Add some test purchases to the engine; to have scored some scores.
- Actiavet a language to retrieve translated products and get product recommendations to buy together with a given single product.
- You can see that the order for recommended products is based on their score. Let's get recommendations for multiple products with aggregated scores
- You can see that the order of the suggested products matches the aggregated scores
- You have verified that your recommendation algorithm works as expected
- Edit the views.py file of the shop application to integrate the engine into the system & add the functionality to retrieve a maximum of four recommended products in the product_detail vie
- Edit the shop/product/detail.html template of the shop application and add the following code after {{ product.description|linebreaks }}
- You are also going to include product recommendations in the cart. The recommendations will be based on the products that the user has added to the cart.
- Edit views.py inside the cart application, import the Recommender class, and edit the cart_detail view
- Edit the cart/detail.html template of the cart application

### Summary

- You created a coupon system using sessions
- learnt internationalization & localization
- installed Rosetta in your project
- translated URL patterns and you created a language selector to allow users to switch the language of the site
- django-parler to translate models and you used django-localflavor to validate localized form fields
- finally you built a recommendation engine