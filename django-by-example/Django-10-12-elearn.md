# 2020-Django 3 by Example - Chapter 10-13: E-Learning Platform

## Infrastructure E-Learning Platform

### Setting up the virtual environment
mkdir env
python3 -m venv env/educa 
source env/educa/bin/activate

### Installing the modules
pip3 install Django;
pip3 install Pillow==7.0.0;
pip3 install django-braces==1.14.0
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

- Create the auth template inside the courses application
    - templates/base.html/registration/ login.html and logged_out.html
- First change the base.html file to extend it later. It defines:
    - title: block for other templates to add a custom title for each page.
    - content: main block for content. All templates that extend the base template will add content to this block. 
    - domready: Located inside the $(document).ready() function of jQuery. It allows to execute code when the DOM has finished loading. 
- CSS styles go into the static/ directory of the courses application. 

- Edit the registration/login.html and the logout.html templates with standardized functions. 

#### Creating class-based views

- Build views to create, edit, and delete courses. Use class-based views for this. Edit the `views.py` file of the courses application by adding:
```python
ManageCourseListView(ListView): 
    model = Course
    template_name = 'courses/manage/course/list.html'
    
    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(owner = self.request.user)
```

- This is the ManageCourseListView view that inherits from Django's generic ListView. 
- Override the get_queryset() method of the view to retrieve only courses created by the current user. To prevent users from editing, updating or deleting courses they did not create, you will also need to override the get_queryset() method in the create, update and delete views. 
-  When you need to provide a specific behavior for several class-based views, use mixins.

#### Using mixins for class-based views

- Mixins are a special kind of multiple inheritance for a class. You can use them to provide common discrete functionality that, when added to other mixins, allows to define the behavior of a class. Main use cases: 
    - You want to provide multiple optional features for a class.
    - You want to use a particular feature in several classes.
- Django comes with several mixins that provide additional functionality.
- Create a mixin class that includes a common behavior, and use it for the course view. Edit the `views.py` of the courses application and modify and add classes:
    - OwnerMixin(object): get_queryset
    - OwnerEditMixin(object): form_valid
    - OwnerCourseMixin(OwnerMixin): 
            - model = Course
            - fields: subject, title, slug, overview
            - success_url: reverse_lazy('manage_course_list')
    - OwnerCourseEditMixin(OwnerCourseMixin, OwnerEditMixin): form.html
    - ManageCourseListView(OwnerCourseMixin, ListView): list.html
    - CourseCreateView(OwnerCourseMixin, ListView): pass
    - CourseCreateView(OwnerCourseMixin, UpdateView): pass
    - CourseDeleteView(OwnerCourseMixin, DeletView): delete.html
    
- In this code, you create the OwnerMixin and OwnerEditMixin mixins. You will use these mixins together with the ListView, CreateView, UpdateView, and DeleteView views provided by Django. OwnerMixin implements the get_queryset() method, which is used by the views to get the base QuerySet. Your mixin will override this method to filter objects by the owner attribute to retrieve objects that belong to the current user (request.user).
- OwnerEditMixin implements the form_valid() method, which is used by views that use Django's ModelFormMixin mixin, that is, views with forms or model forms such as CreateView and UpdateView. form_valid() is executed when the submitted form is valid. The default behavior for this method is saving the instance (for model forms) and redirecting the user to success_url. You override this method to automatically set the current user in the owner attribute of the object being saved.
- Your OwnerMixin class can be used for views that interact with any model that contains an owner attribute. 
- You also define an OwnerCourseMixin class that inherits OwnerMixin and provides the attributes for child views: model, fields, success_url.
- A OwnerCourseMixin is defined that inherits from OwnerMixin and provides the attributes for child views: 
    - model: the model used for querysets, it is used by all views
    - fields: the fields of the model to build the form of the CreateView and UpdateView views
    - success_url: Used by CreateView, UpdateView, and DeleteView to redirect the user after the form is succesfully submitted or the object is deleted. 
- The OwnerCourseEditMixin mixin is defined with the attribute `template_name` which is used for the Createview and UpdateView views.
- OwnerCourseMixin: 
    - ManageCourseListView: lists the courses created by the user. It inherits from OwnerCourseMixin and ListView. It defines a specific template_name attribute for a template to list courses.
    - CourseCreateView: Uses a model form to create a new Course object. It uses the fields defined in OwnerCourseMixin to build a model form and also subclasses CreateView. It uses the template defined in OwnerCourseEditMixin.
    - CourseUpdateView: Allows the editing of an existing Course object. It uses the fields defined in OwnerCourseMixin to build a model form and also subclasses UpdateView. It uses the template defined in OwnerCourseEditMixin.
    - CourseDeleteView:  Inherits from OwnerCourseMixin and the generic DeleteView. It defines a specific template_name attribute for a template to confirm the course deletion.

#### Working with groups and permissions

- Restrict access to views so that only instructors have permission to create and manage courses. 
- Django's auth framework includes a permission system that allows you to assign permissions to users and frouips. You are going to create a group for instructor users and assign permissions to create, update, and delete courses.
- Run the dev server, and add new Group object. Add the name Instructors, and choose all permissions, except the subject ones
- There are four different permissions for each model: view, add, change, delete. 
- Create a new user, and add him to the instructors group.

##### Restricting access to class-bassed views

- Restrict access to the views so that only legit users can add, change or delete course objects. Use two provided mixins:
    - LoginRequiredMixin: Replicates the login_required decorator's functionality.
    - PermissionRequiredMixin: Grants access to the view to users with a specific permission. Rmb that superusers automatically have all permissions. 
- Edit the `views.py` file of the courses application and import the two mixins
- Make OwnerCourseMixin inherit LoginRequiredMixin and PermissionRequiredMixin
- Add a permission_required attribute to the course views. This checks whether the user accessing the view has the permission specified in the permission_required attribute. Your views are now only accessible to users with proper permissions. Then add a `permission_required` to the course views. PermissionRequiredMixin checks that the user accessing the view has the permission specified in the permission_required attribute. Your views are now only accessible to users with proper permissions. 
- Create URLs for these views. Create a `urls.py` in the courses application: with patterns min/, create/, edit/, delete/. These are the urls patterns for the list/create/edit/delete course views. Edit the main `urls.py` of Educa to include the URL patterns of the courses application. 
- Create templates for these views: 
    - list.html: for ManageCourseListView in which courses created by current user will be listed. Links to edit, delete or create a new coruse are included. 
    - form.html: used for CourseCreateView and CourseUpdateView. Check whether an object variable is in the context. If objects exist in the context, you know that you are updating an existing course, and you use it int he page title. Otherwise, create a new Course object. 
    - delete.html: this template is for the CourseDeleteView view. It inherits from DeleteView which expects user confirmation to delete an object. The course will be deleted and you will be redirected to the course list page again. 

### Managing course modules and their content

- Build a system to manage course modules and their contents. Build forms that can be used for managing multiple modules per course and different types of content for each module.
- Both modules and their contents will have to follow a specific order and you should be able to reorder them using the CMS.

#### Using formsets for course modules

- Django comes with an abstraction layer to work with multiple forms on the same page. These groups are known as formsets. Formsets manage multiple instances of a certain Form or ModelForm. All forms are submitted at once and the formset takes care of the initial number of forms to display, limiting the maximum number of forms that can be submitted and validating all the forms. 
- Formsets include an is_valid() method to validate all forms at once. You can also provide initial data for the forms and specify how many additional empty forms to display. 
- Courses are divided into a variable number of modules, it makes sense to use formsets to manage them. Create a `forms.py` file in the courses application directory and add code to it:
```python
ModuleFormSet = inlineformset_factory(Course, Module,
fields=['title', 'description'],
extra=2, can_delete=True)
```
- built it with the inlineformset_factory function. Inline formsets are a small abstraction on top of formsets that simplify working with related objects. The function allows to build a model formset dynamically for the Module objects related to a course object. 
    - fields: will be included in each form.
    - extra: allows to set the number of empty extra forms to display the formset. 
    - can_delete: set to True, Django will include a Bool for each form that will be rendered as a checkbox input. Mark the objects that you want to delete. 
    
- Edit the `views.py` of the courses application and add:
    - CourseModuleUpdateView(TemplateResponseMixin, View): formset.html
    - with TemplateResponseMixin being: takes charge of rendering templates and returning an HTTP response. It requires a template_name attribute that indicates the template to be rendered and provides the render_to_reponse() method to pass it a context and render the template. 
    - get_formset(): to avoid repeating the code to build the formset. It creates a ModuleFormSet object for the given Course object with optional data. 
    - dispatch(): This method is provided by the View class. It takes an HTTP request and its parameters and attempts to delegate to a lowercase method that matches the HTTP method used. A `get` request is delegated to the get() method and a `post` request to post(). In this method, you use get_object_or_404() to get the Course object for the given id parameter that belongs to the current user. Include this code in the dispatch() method because you need to retrieve the course for both GET and POST requests. Save it to the course attribute of the view to make it accessible to other methods. 
    - get(): Executed for GET requests. Build an empty ModuelFormSet formset and render it to the template together with the current Course object using the render_to_reponse() method provided by the TemplateResponseMixin. 
    - post(): Executed for POST requests.
        - build a module formset instance using the submitted data
        - execute the is_valid method of the formset to validate all of its forms
        - if the formset is valid, save it. Anything will be applied to the database, then you redirect to manage_course_list URL. If it is not valid, render errors instead. 
- Edit the `urls.py` of the courses applicatin and add a `<pk>/module/` URL pattern to it. 
- Create a new directory inside the courses/manage template directory and name it module. Craete the formset.html template in which a `<form>` HTML element is included in the formset. You also include the management form. It includes hidden fields to control the initial, total, minimum, and maximum number of forms. 
- Edit the courses/manage/course/list.html template and add a `course_module_update` link to it. 
- The formset includes a form for each Module object contained in the course. After these, two empty extra forms are displayed. 


#### Adding content to course modules

- Now, add content to course modules. You have four different type of content: text, video, image, and file. You could consider creating for different views, however a more generic approach will be used: Create a view that handles creating or updating the objects of any content model. Edit the `views.py` file of the courses application and add the code to it: 
    - class ContentCreateUpdateView(TemplateResponseMixin, View): 
    - get_model(): check that the given model name is one of the four content models. Then, use Django's apps module to obtain the actual class for the given model name. If the given model name is not one of the valid ones, return NONE.
    - get_form(): build a dynamic form using the modelform_factory() function of the form's framework. Since you are going to build a form for the Text, Video, Image, and File models, you use the exclude parameter to specify the common fields to exclude from the form and let all other attributes be included automatically. By doing so, you do not have to know which fields to include depending on the model. 
    - dispatch(): receives the following URL parameters and stores the corresponding module, model, content object as class attributes:
        - module_id: the ID for the module that the content is/will be associated with. 
        - model_name: The model name of the content to create/update
        - id: the ID of the object that is being updated. It's NONE to create new objects.
    - get(): executed when a GET request is received. Build the model form for the Text, Video, Image or File instance that is being updated. Otherwise, pass no instance to create a new object, since self.obj is None if no ID is provided. 
    - post(): executed when a POST request is received. Build the model form, passing any submitted data and files to it. Then it is validated, if it is valid, create a new object and assign request.user as its owner before saving it to the database. Check for the id parameter. If no ID is provided, you know the user is creating a new object instead of updating an existing one. If this is a new object, create a Content object for the given module and associate the new content with it. 
- Edit `urls.py` file of the courses application:
    - module_content_create: create new objects and add them to a module. It includes module_id (allows linking the new content object) and model_name (specifies the content model to build the form for) params.
    - module_content_upgrade: update an existing object. Includes previous params to identify the content being updated.
- Create a new directory inside the courses/manage/ template directory and name it content. Create the `form.html` it is the template for the ContentCreateUpdateView view. In this,
    - check whether an object variable is in the context. If object exists in the context, you are updating an existing object. Otherwise, create a new one.
    - Include enctype="multipart/form-data" in the <form> HTML element because the form contains a file upload for the File and Image content models. 
    - Run the dev server, and click 'Edit module'; open the shell and obtain the ID of the most recently created module. 
    - Don't submit as it will fail as there is no moduel_content_list URL. 
- Also you need a view for deleting content: 
    - ContentDeleteView(View): retrieves the Content object with the given ID. It deletes the related object. Finally, it deletes the Content object and redirects the user to the module_content_list URL to list the other contents of the module.
- Edit the `urls.py` of the courses application and at the delete URL to it. 
    
#### Managing modules and their contents

- Create a view to display all modules for a course, and list the contents of a specific module. Edit the `views.py` of the courses application and add:
    - class ModuleContentListView(TemplateResponseMixin, View): the view gets the Module object with the given ID that belongs to the current user and renders a template with the given module. 
- Edit the `urls.py` and add the path
- Create a new template content_list.html: it displays all modules for a course and the contents of the selected module. Iterate over the course modules to display them in a sidebar. Iterate over module's contents and access content.item to get the related data object. Also include links to create new data contents. 
- To know which type of object each of the items is, you need the model name to build the URL to edit the object. 
- Besides, display each item in the template differently based on the type of content it is. Get the model name for an object from the model's Meta class by accessing the object's _meta attribute. Nevertheless, Django does not allow accessing variables or attributes starting with an underscore in templates to prevent retrieving private attributes or calling private methods. Solve this by writing a custom template filter. 
- Edit the course.py module: this is the model_name template filter. You can apply it in templates as object|model_name to get the model name for an object. 
- Edit the templates/courses/.../content_list.html template and add the {% load course %} to it; also edit the href, so that you display the item model name in the template and also use the model name to build the link to edit the object.

#### Reordering models and their contents

- Use a JavaScript drag-n-drop widget to let users reorder the modules of a course by dragging them. After users finish dragging a module, an async request (AJAX) will be launched to store the new module order.

##### Using mixins from django-braces

- django-braces is a third-party module that contains a collection of generic mixins for Django. These mixins provide additional features for class-based views. Use:
    - CsrfExemptMixin: Used to avoid checking the cross-site request forgery (CSRF) token in the POST requests. You need this to perform AJAX POST requests without having to generate a csrf_token. 
    - JsonRequestResponseMixin: parses the request data as JSON and also serializes the response as JSON and returns an HTTP response with the application/json content type.
- Install django-braces via pip, and create a view for the new order module. Add the class to the 'views.py' of the courses application:
    - ModuleOrderView(CsrfExemptMixin, JsonRequestResponseMixin, View)
    - ContentOrderView(CsrfExemptMixin, JsonRequestResponseMixin, View)
- Edit the `urls.py` file of the courses application and add URL patterns to it.
- Implement the drag-and-drop functionality in the template. Use jQuery UI library for this. jQuery UI is built on top of jQuery and it provides a set of interface interactions, effects, and widgets. You will use its sortable element. 
- First, you need to load jQuery UI in the base template. Open the base.html and load the script
- Next edit the content_list.html and add a domready block. In this you define a sortable element for the module list in the sidebare and a different one for the module content list. Both work as: 
    - Define a sortable element for the modules HTML element.  #modules since jQuery uses CSS notation for selectors.
    - Specify a function for the stop event. This event is triggered every time the user finishes sorting an element.
    - Create an empty modules_order dictionary. The keys for this dictionary will be the module IDs, and the values will be the assigned order for each module. 
    - Iterate over the #module children elements. You recalculate the displayed order for each module and get its data-id attribute, which contains the module's ID. Add the ID as the key of the modules_order dict and the new index of the module as the value. 
    - Launch an AJAX POST request to the content_order URL, including the serialized JSON data of modules_order in the request. The ModuelOrderView takes care of updating the order of the modules. 
- The sortable element to order module contents is quite similar to this one. Go back to your browser and reload the page. Now, you will be able to click and drag both modules and their contents to reorder them. 

### Summary

- How to use fixtures to provide intial data for moedls. 
- Using model inheritance, you created a versatile system to manage different types of content for the course modules. 
- Implemented a custom model field to order objects. 
- Use class-based views and mixins. 
- Worked with groups & permissions to restrict access to the views. 
- Used formsets to manages course modules, and built-in a drag-and-drop functionality with jQuery UI. 

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

