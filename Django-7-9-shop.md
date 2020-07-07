# 2020-Django 3 by Example - Chapter 7-9

## Running the Online Shop

### Setting up the virtual environment
mkdir env
python3 -m venv env/myshop 
source env/myshop/bin/activate

#### Installing WeasyPrint
- operating system from https:// weasyprint.readthedocs.io/en/latest/install.html

### Installing the modules
# Chapter 7
pip3 install Django;
pip3 install Pillow==7.0.0;
pip3 install celery==4.4.2;
pip3 install flower==0.9.3;
# Chapter 8
pip3 install braintree==3.59.0;
pip3 install WeasyPrint==51;

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

### Use the STATIC_ROOT setting
python3 manage.py collectstatic

### Server blocked? - just type: 
thisisunsafe

### Testing Payments
Testing credit cards at https:// developers.braintreepayments.com/guides/credit-cards/testing-go-live/python

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
#### Building the Coupon Model
#### Applying a Coupon to the Shopping Cart
#### Applying Coupons to Orders

### Adding Internationalization and Localization
#### Internationalization with Django
#### Preparing your Project for Internationalization
#### Translating Python Code
#### Translating Templates
#### Using the Rosetta Translation Interface
#### Fuzzy Translations
#### URL patterns for Internationalization
#### Allowing Users to Switch Language
#### Translating Models with django-parler
#### Format Localization
#### Using django-localflavor to validate form fields

### Building a Recommendation Engine
#### Recommending Products based on Previous Purchases

### Summary
