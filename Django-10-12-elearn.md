# 2020-Django 3 by Example - Chapter 10-13: E-Learning Platform

## Infrastructure E-Learning Platform

### Setting up the virtual environment
mkdir env
python3 -m venv env/educa 
source env/educa/bin/activate

### Installing the modules
pip3 install Django;
pip3 install Pillow==7.0.0;
<!--
pip3 install social-auth-app-django==3.1.0;
pip3 install django-extensions==2.2.5; 
pip3 install werkzeug==0.16.0; 
pip3 install pyOpenSSL==19.0.0;
pip3 install easy-thumbnails==2.7;
pip3 install --upgrade certifi;
pip3 install redis==3.4.1;
-->

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
- pip install necessary modules (Django, pillow)
- django-admin startproject educa
- django-admin startapp courses
- register the courses app in the INSTALLED_APP setting in `settings.py`

### Building the course models
- The e-learning platform will offer courses on various subjects. Each course will be divided into a configurable number of modules, and each module will contain a configurable number of contents.
- The contents will be of various types: text, file, image, or video. The structure is `Subject > Course > Module > Content (type)`
- In `models.py` of the courses application add classes:
    - subject: title, slug
    - course: owner (FK), subject (FK), title, slug, overview, created
    - module: course (FK), title, description
- Each course is divided into several modules, therefore, the `module` model contains a FK field that points to the `course` model
- run `makemigrations` to migrate the course models, then sync them to the database via `migrate`. 

#### Registering the models in the administration site

- Add the course models to the admin site. Edit the `admin.py` file inside the `courses` application directory and add the code to it
    - subjectAdmin(): list_display, prepopulated fields
    - ModuleInline(): model = Module
    - CourseAdmin(): list_display, list_filter, search_fields, prepopulated fields, inlines.

#### Using fixtures to provide initial data for models

- sometimes prepopulate the databse with hardcoded data. This is useful to automatically include initial data in the project setup, instead of having to add it manually. 
- Django comes with a simple way to load and dump data from the database into files that are called fixtures. Django supports JSON, XML or YAML. 
- Create a super user, run the server, create several courses in the admin site, then run `dumpdata courses --indent=2`. The dumpdata comment dumps data from the database into the standard output, serialzed in JSON format by default. The resulting structure includes information about the model and its field for Django to be able to load it into the database.
- You can limit the output to the models of an application by providing the application names to the command, or specifying single models for outputting data using the app.Model format. You can also specify the format using the --format flag. By default, dumpdata outputs the serialized data to the standard output. However, you can indicate an output file using the --output flag. The --indent flag allows you to specify indentation. For more information on dumpdata parameters, run python manage.py dumpdata --help. 
- Save the dump to a fixtures file in a new fixtures/ directory in the courses application with mkdir, and `python manage.py dumpdata courses --indent=2 --output=courses/fixtures/ subjects.json`
- Run the dev server, and remove the created subjects. Run `python manage.py loaddata subjects.json` and all subject objects included in the ficture are loaded into the database. 
- By default, Django looks for files in the fixtures directory of each application but you can specify the complete path to the ficture file for the loaddata command. 
- You can also use the FIXTURE_DIRS settings to tell Django additional directoris to look in. 
- Fixtures are useful for setting up initial data, providing sample data, and data required for testing. 
- If you want to load fixtures in model migrations, take a look at Django's documentation about data migrations.

### Creating models for diverse content

- Different types of cotent will be added to the course modules, such as text, images, files, and videos. Therefore, a versatile data model that allows to store diverse content is needed. 
- The convenience of using generic relations to create foreign keys that can point to the objects of any model.
- Create a Content model that represents the modules' contents, and define a generic relation to associate any kind of content
- Edit the `models.py` of the courses application and add the Content model
    - add imports: ContentType, GenericForeignKey 
    - add a class Content: module, content_type, object_id, item
- only content_type and object_id fields have a corresponding column in the database table of this model. The item field allows to retrieve or set the related object directly, and its functionality is built on top of the other two fields. 
- A different model for each type of content will be used. Some are common fields, but they will differ in the actual data they can store.

#### Using model inheritance

Django supports model inheritance. It works similar to standard class inheritance in Python. The options:

- Abstract models: useful when you want to put some common information into several models.
- Multimodal-table model: applicable when each model in the hierachy is considered a complete model by itself.
- Proxy models: useful when you need to change the behavior of a model, e.g. for including addtional methods, changing the default manager, or using different meta options. 

##### Abstract models

- an abstract model is a base class in which you define fields you want to include in all child models. 
- Django does nto create db tables for abstract models. DB models are created for each child model, including fields inherited from the abstract class and the one defined in the child model. 
- mark a model as abstract through including abstract=True in its Meta class. 
- Django will recognize that it is an abstract class, and will not create a db table for it. To create child models, you just need to subclass the abstract model.
- Example, in which Django would create a table for the Text model only, including title, created and body fields: 

```python
class BaseContent(models.Model):
    title = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        abstract = True
        
class Text(BaseContent):
    body = models.TextField()
```

##### Multi-table model inheritance

- here each model corresponds to a db table. Django creates a OneToOneField field for the relationship between the child model and its parent model. To us it, subclass an existing model. 
- Django creates a db tabel for both the orig model and the sub-model. 
- Example in which Django would include an automatically generated OneToOneField in the Text model and create a databse table for each model: 

```python
class BaseContent(models.Model):
    title = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)

class Text(BaseContent):
    body = models.TextField()
```

##### Proxy models

- changes the behavior of a model. Both models operate on the db table of the orig model. In the example you define an OrderedContent model that is a proxy for the Content model. This model provides an ordering for QuerySets and an additional created_delta() method. Both methods, Content and OrderedContent, operate on the same db table, and objects are accessible via the ORM through either model:

```python
class BaseContent(models.Model):
    title = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    
class orderedContent(BaseContent):
    class Meta:
        proxy = True
        ordering = ['created']
        
    def created_delta(self):
        return timezone.now() - self.created
```

#### Creating the content models

- the Content model of the courses application contains a generic relation to associate different types of content with it. 
- Different models for each type of content will be created.
- All content models will have some fields in common and additional fields to store custom data. 
- First an abstract model that provides the common fields for all content models will be created.
- Edit the `models.py` file of the courses application.
    - class ItemBase(): owner, title, created, updated, incl. meta mark
    - class Text(ItemBase)
    - class File(ItemBase)
    - class Image(ItemBase)
    - class Video(Itembase)
- The owner field allows you to store which user created the content. Since this field is defined in an abstract class, you need a different related_name for each sub- model. Django allows you to specify a placeholder for the model class name in the related_name attribute as %(class)s. By doing so, related_name for each child model will be generated automatically. Since you use '%(class)s_related' as the related_name, the reverse relationship for child models will be text_related, file_related, image_related, and video_related, respectively  
- Edit the Content model you created previously and modify its content_type field, as follows: add a limit_choices_to argument to limit the ContentType objects that can be used for the generic relation. You use the model__in field lookup to filter the query to the ContentType objects with a model attribute that is 'text', 'video', 'image', or 'file'
- Next migrate the model. 
- You have created models that are suitable for adding diverse content to the course modules. However, there is still something missing in your models: the course modules and contents should follow a particular order. You need a field that allows you to order them easily

#### Creating custom model fields

- Django comes with a complete collection of model fields that you can use to build your models. However, you can also create your own model fields to store custom data or alter the behavior of existing fields.
- You need a field that allows you to define an order for objects. An easy way to specify an order for objects using existing Django fields by adding a PositiveIntegerField to your model.
- Using integers allows to easily specify the order of objects. You can create a custom order field that inherits from PositiveIntegerField and provides additional behavior. 
- There are two relevant functionalities that you will build into the order field: 
    - _Automatically assign an order value when no specific order is provided:_ If there are already two objects, a newly saved one should get order 3 if no specific order has been provided.
    - _Order objects with respect to other fields:_ Course models will be order with respect to the course they belong to, and module contents with respect to the module they belong to. 
- Create a new `fields.py` inside the course application directory ann add:
    - class OrderField(): inherits from PositiveIntegerField
    - with function pre_save(): that overrides the mehtod of the PositiveIntegerField field.
    
#### Adding ordering to module and content objects

- Add the new field to the models. Edit the `models.py` file of the courses application, and import the OrderField class and a field to the Moduel model. Name the new field `order` and specify that the ordering is calculated with respect to the course by setting for_fields=['course']. This means that the order for a new module will be assigned by adding 1 to the last module of the same Course object.
- Module contents also need to follow a particular order. Add an OrderField field to the Content model; finally add ordering for both models.
- Create a new model migration via `makemigrations`: you'll be prompted to set a default value for the new order field. Enter `1` and press Enter to choose *providing a value*. Then, enter `0` as the `default value` for existing records and press Enter. 
- Apply the new migrations by `python3 manage.py migrate` 
- Create a new course via the shell. And add modules to the course and see how their order ist automatically calculated. Test adding more modules.
- The OrderField field does not guarantee that all order values are consecutive. However, it respects existing order values, and always assigns the next order based on the highest existing order

### Creating a CMS

The CMS will allow instructors to create courses and manage their contents. 

#### Adding an Auth System

- Instructors and Students will be instances of the Django's User model through the Django auth system.
- Edit the main `urls.py` file of the educa project and include `login` and `logout` views of Django's framework.

#### Creating the Auth Templates



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

