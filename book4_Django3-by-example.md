# 2020-Django 3 by Example

Last changed on: June 18, 2020

### Chapter 0: Virtual Environment

- Create the virtual environment: python -m venv my_env
- You can activate the python environment by running the following command: source my_env/bin/activate
- Deactivate the virtual environment: deactivate

- Django (That port is already in use.) remedy: python3 manage.py runserver 800x

- Create a superuser: python manage.py createsuperuser

### Chapter 1: Building a Blog Application

### Terms definition

#### Creating Model Managers 

- Objects: objects is the default manager of every model that retrieves all objects in the database. However, you can also define custom managers for your models. You will create a custom manager to retrieve all posts with the published status.
- Django Views: A Django view is just a Python function that receives a web request and returns a web response. All the logic to return the desired response goes inside the view.
- URLPattern: URL patterns allow you to map URLs to views. A URL pattern is composed of a string pattern, a view, and, optionally, a name that allows you to name the URL project-wide.
- Canonical URLs: A canonical URL is the preferred URL for a resource. You may have different pages in your site where you display posts, but there is a single URL that you use as the main URL for a blog post. 
- Templates: URL patterns map URLs to views, and views decide which data gets returned to the user. Templates define how the data is displayed; they are usually written in HTML in combination with the Django template language.
- Class based views: Class-based views are an alternative way to implement views as Python objects instead of functions. Since a view is a callable that takes a web request and returns a web response, you can also define your views as class methods. Django provides base view classes for this. All of them inherit from the View class, which handles HTTP method dispatching and other common functionalities.
- Mixin: reusable view classes.

Location of files:
- Data models we
- Views were in 
- Templates: HTML templates that are connected with Django Code. Location of templates in templates/blog/base, code is in 
- URLS for blog: 

### In Chapter 1, I learnt:

1. Install Django and learn that a venv is necessary to run a Django project. Activate it by: my_venv/bin/activate; deactivate by 'deactivate'.
2. Learning about the different use of files and folders in a new django project. Learn that apps are part of a Django project.
3. Creating a blog data scheme for the blog app looks like setting up a SQL query. SQLite is integrated since Python 3.3.
4. Creating the admin and the default name is my computer name: sebastian.
5. Querying works just like using a SQL tool.

### Chapter 2: Enhancing Your Blog with Advanced Features

#### To Dos

- Sharing posts via mail
- Adding comments to a post
- Tagging posts
- Recommending similar posts

#### Sharing Posts by Email

1. Create a form for users to fill in their contact data and input
2. Create a view in the views.py file that handles the posted data and sends the email
3. Add a URL pattern for the new view in the urls.py file of the blog application
4. Create a template to display the form

#### Creating a Commenting System

1. Create a model to save comments in the database: it is in the models.py and it is the database structure.
2. Creating a form to submit comments and validate the input data: create the form in ModelForm which takes a predefined Comment model.
3. Add a view that processes the form and saves new comment to the database: 
4. Edit the post detail template to display the list of comments and the form to add a new comment: 

#### Retrieving tags by Similarity

1. Retrieve all tags for the current post: 
2. Get all posts that are tagged with any of those tags:
3. Exclude the current post from that list to avoid recommending the same post:
4. Order the result by the number of tags shared with the current post:
5. Limit the query to the number of posts you want to recommend:


### Chapter 3: Extending Your Blog Application