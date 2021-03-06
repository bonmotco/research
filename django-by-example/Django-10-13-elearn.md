# 2020-Django 3 by Example - Chapter 10-13: E-Learning Platform

## Infrastructure E-Learning Platform

### Setting up the virtual environment
mkdir env
python3 -m venv env/educa
source env/educa/bin/activate
pip3 install -r requirements.txt

### Sync Database with the models
python3 manage.py makemigrations
python3 manage.py migrate

### Setting up an Admin-account
python3 manage.py createsuperuser

### Start the server
python manage.py runserver

### Installing Memcached
brew install memcached
open new shell and `memcached -l 127.0.0.1:11211`

### Initialize the Redis server
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make

#### Starting Redis
redis-server

### Server blocked? - just type:
thisisunsafe


### Testing Chatting

- Open the URL http://127.0.0.1:8000/chat/room/1/ in your browser, replacing 1 with the id of an existing course in the database. With a logged-in user who is enrolled on the course, write a message and send it.
- Then, open a second browser window in incognito mode to prevent the use of the same session. Log in with a different user, also enrolled on the same course, and send a message.
- You will be able to exchange messages using the two different users and see the user and time, with a clear distinction between messages sent by the user and messages sent by others.

## Chapter 10: Building an E-Learning Platform (357-412)
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

## Chapter 11: Rendering and Caching Content (413-442)

Used model inheritance and generic relations to create course contents. Now, access course contents, create a student registration system, and manage student enrollment onto courses. Learn how to cache data with Django cache framework.

### Displaying courses

- For course catalog build two functionalities: list all available courses && display a single course overview
- Edit `views.py` of courses application by adding the CourseListView(TemplateResponseMixin, View):
    - Retrieve all subjects, using the ORM's annotate() method with the Count() aggregation function to retrieve the total number of courses for each subject.
    - Retrieve all available courses, inlcuding the total number of modules contained in each course.
    - If a subject slug URL parameter is given, retrieve the corresponding subject object and limit the query to the courses that belong to the given subject.
    - Use the render_to_response() method provided by TemplateResponseMixin to render the object to a template and return an HTTP response.
- Create a detail view for displaying a single course overview via CourseDetailView(DetailView)
    - View inherits from Django's DetailView.
    - Specifu the model and the template_names attributes.
    - Django's DetailView expects a primary key (pk) or slug URL parameter to retrieve a single object for the given model. The view renders the template specified in template_name, including the Course object in the template context variable object
- Edit the main `urls.py` in the educa project by adding the URL pattern to it.
- Edit the `urls.py` of the courses application and add course_list_subject (CourseListView) and course_detail (CourseDetailView)
- Build the templates for the views:
    - list.html: template for listng all courses. Create an HTML list to display all Subject objects and build a link to the course_list_subject URL for each of them. Add a selected HTML class to highlight the current subject if a subject is selected. Iterate over every Course object, displaying the total number of modules and the instructor's name. Left sidebar contains all subjects and the number of courses for each of them.
    - detail.html: Displays the overview and details for a single course.

### Adding student registration

Create a new application via `startapp students` named students and register it in the `settings.py` under INSTALLED_APPS

#### Creating a student registration view

- Edit the `views.py` of the students application with a StudentRegistrationView(CreateView) class:
    - template_name: registration.html
    - form_class: UserCreationForm
    - success_url: reverse_lazy('student_course_list')    
- def form_valid(): method is executed when valid form data has been posted. It has to return an HTTP response. Override this method ot log the user in after they have successfully signed up.
- Create a `urls.py` and the register pattern to it
- EDit the main `urls.py` of the educa project and include th URL for the students application.
- Create the `registration.html` and test the server.

#### Enrolling on courses

- After users create accounts they should be able to enroll in courses. To store enrollments, create a many-to-many relationshop between the `Course` and `User` models. Edit `models.py` of the courses application and add the students manytomany field to it; `makemigrations` and `migrate`.
- Now, you can associate students with the courses on which they are enrolled.
- Create `forms.py` in the student application with class CourseEnrollForm(forms.Form) with `course = ModelChoiceField` on which the user will be enrolled. A HiddenInput widget is used to not show this field to the user. Use this form in the CourseDetailView view to display a button to enroll.
- Edit the `views.py` file of the students application and
    - StudentEnrollCourseView: it handles students enrolling on courses. The view inherits from the LoginRequiredMixin mixin so that only logged-in users can access the view. It also inherits from Django's FormView view, since you handle a form submission. You use the CourseEnrollForm form for the form_class attribute and also define a course attribute for storing the given Course object. When the form is valid, you add the current user to the students enrolled on the course
    - def get_success_url: returns the URL that the user will be redirected to if the form was successfully submitted. This method is equivalent to the success_url attribute. Then, you reverse the URL named student_course_detail.
- Edit the `urls.py` of the student application, and add 'enroll-course/'.
- Edit the `views.py` of the course application, and modify CourseDetailView (extend for get_context_data function: You use the get_context_data() method to include the enrollment form in the context for rendering the templates. You initialize the hidden course field of the form with the current Course object so that it can be submitted directly)
- Edit the `courses/course/detail.html` template and insert a enrolling button: this is the button for enrolling on courses. If the user is authenticated, you display the enrollment button, including the hidden form that points to the student_ enroll_course URL. If the user is not authenticated, you display a link to register on the platform

### Accessing the course contents

- You need a view for displaying the courses that students are enrolled on, and a view for accessing the actual course contents.
- Edit the `views.py` of the student application and add StudentCourseListView(LoginRequiredMixin, ListView): This is the view to see courses that students are enrolled on. It inherits from LoginRequiredMixin to make sure that only logged in users can access the view. It also inherits from the generic ListView for displaying a list of Course objects. You override the get_queryset() method to retrieve only the courses that a student is enrolled on; you filter the QuerySet by the student's ManyToManyField field to do so
- Also add a StudentCourseDetailView(DetailView)
    - `get_queryset()`: You override the get_queryset() method to limit the base QuerySet to courses on which the student is enrolled
    - with an additional `def get_context_data()`: set a course module in the context if the module_id URL parameter is given. Otherwise, you set the first module of the course. This way, students will be able to navigate through modules inside a course
- Edit the `urls.py` of the students application: and add urls to `courses/`, `course/<pk>/`, and `course/<pk>/<module_id>/`
    - `list.html`: This template displays the courses that the student is enrolled on. Remember that when a new student successfully registers with the platform, they will be redirected to the student_course_list URL. Let's also redirect students to this URL when they log in to the platform
        - Edit the settings.py file of the educa project and import `reverse_lazy` and `LOGIN_REDIRECT_URL = reverse_lazy('student_course_list')` : This is the setting used by the auth module to redirect the student after a successful login if no next parameter is present in the request. After a successful login, a student will be redirected to the student_course_list URL to view the courses that they are enrolled on
   - `detail.html`: This is the template for enrolled students to access the contents of a course. First, you build an HTML list including all course modules and highlighting the current module. Then, you iterate over the current module contents and access each content item to display it using {{ item.render }}. You are going to add the render() method to the content models next. This method will take care of rendering the content properly.

#### Rendering different types of content

- Provide a way to render each type of content. Edit the `models.py` file of the courses application and add the `render()` method to the class `ItemBase` model: This method uses the render_to_string() function for rendering a template and returning the rendered content as a string. Each kind of content is rendered using a template named after the content model. You use self._meta.model_name to generate the appropriate template name for each content model dynamically. The render() method provides a common interface for rendering diverse content
- create a file structure in the `templates/courses` directory of the courses application with `content/`:
    - `text.html`: `{{ item.content|linebreaks }}`
    - `file.html`: `<p><a href="{{ item.file.url }}" class="button">Download file</a></p>`
    - `image.html`: `<p><img src="{{ item.file.url }}" alt="{{ item.title }}"></p>`
        - in order to use media files go to `settings.py` of the project and add the MEDIA_URL and MEDIA_ROOT settings.
        - edit the main `urls.py` and add relevant imports (settings, static) and add settings.DEBUG to the end.
    - `video.html`: `{% load embed_video_tags %} {% video item.url "small" %}`
        - You also have to create a template for rendering Video objects. You will use django- embed-video for embedding video content. django-embed-video is a third-party Django application that allows you to embed videos in your templates, from sources such as YouTube or Vimeo, by simply providing their public URL.
        - pip3 install django-embed-video==1.3.2
        - Edit settings.py file and add INSTALLED_APPS

- Your project is now ready to upload and serve media files. The Django development server will be in charge of serving the media files during development (that is, when the DEBUG setting is set to True). Remember that the development server is not suitable for production use.

### Using the cache framework

- HTTP requests to your web application usually entail database access, data processing, and template rendering. This is much more expensive in terms of processing than serving a static website. The overhead in some requests can be significant when your site starts getting more and more traffic. This is where caching becomes precious. By caching queries, calculation results, or rendered content in an HTTP request, you will avoid expensive operations in the following requests. This translates into shorter response times and less processing on the server side
- Django includes a robust cache system that allows you to cache data with different levels of granularity. You can cache a single query, the output of a specific view, parts of rendered template content, or your entire site.
- Items are stored in the cache system for a default time. You can specify the default timeout for cached data
- This is how you will usually use the cache framework when your application gets an HTTP request:
    1. Try to find the requested data in the cache.
    2. If found, return the cached data.
    3. If not found, perform the following steps:
        - perform the query or processing required to obtain the data
        - save the generated data in the cache
        - return the data

#### Available cache backends

Django has several cache backends:

- backends.memcached.MemcachedCache or backends.memcached
- PyLibMCCache: A Memcached backend. Memcached is a fast and efficient memory-based cache server. The backend to use depends on the Memcached Python bindings you choose
- backends.db.DatabaseCache: Use the database as a cache system
- backends.filebased.FileBasedCache: Use the file storage system. This serializes and stores each cache value as a separate file
- backends.locmem.LocMemCache: A local memory cache backend. This the default cache backend
- backends.dummy.DummyCache: A dummy cache backend intended only for development. It implements the cache interface without actually caching anything. This cache is per-process and thread-safe

#### Installing Memcached

- You are going to use the Memcached backend. Memcached runs in memory and it is allotted a specified amount of RAM. When the allotted RAM is full, Memcached starts removing the oldest data to store new data
- If you are using macOS, you can install Memcached with the Homebrew package manager using the command brew install memcached.
- After install: open the shell and `memcached -l 127.0.0.1:11211`
- After installing Memcached, you have to install its Python bindings. You can do this with the following command: pip install python-memcached==1.59

#### Cache setting

- CACHES: A dict containing all available caches for the project.
- CACHES_MIDDLEWARE_ALIAS: the cache alias to use for storage.
- CACHES_MIDDLEWARE_KEY_PREFIX: the prefix to use for cache keys. Set a prefix to avoid collisions if you share the same cache between several sites.
- CACHES_MIDDLEWARE_SECONDS: the default number of seconds to cache pages.

- The caching system for the project can be configured using the CACHES setting. This setting allows you to specify the configuration for multiple caches. Each cache included in the CACHES dictionary can specify the following data:

    - BACKEND: The cache backend to use.
    - KEY_FUNCTION: A string containing a dotted path to a callable that takes a prefix, version, and key as arguments and returns a final cache key.
    - KEY_PREFIX: A string prefix for all cache keys, to avoid collisions.
    - LOCATION: The location of the cache. Depending on the cache backend, this might be a directory, a host and port, or a name for the in-memory backend.
    - OPTIONS: Any additional parameters to be passed to the cache backend.
    - TIMEOUT: The default timeout, in seconds, for storing the cache keys. It is 300 seconds by default, which is five minutes. If set to None, cache keys will not expire.
    - VERSION: The default version number for the cache keys. Useful for cache versioning.

#### Adding Memcache to your project

- Edit the `settings.py` file of the educa project and add CACHES with BACKEND and LOCATION.

##### Monitoring Memcached  

- In order to monitor Memcached, you will use a third-party package called django-memcache-status. This application displays statistics for your Memcached instances in the administration site: pip3 install django-memcache-status==2.2
- Edit the `settings.py` file and add 'memcache_status' to the INSTALLED_APPS setting
- Edit the `admin.py` of the courses application and add memcache admin index site.
- Make sure Memcached is running, start the development server in another shell window and open http://127.0.0.1:8000/admin/ in your browser. Log in to the administration site using a superuser.
- The block contains a bar graph that shows the cache load. The green color represents free cache, while red indicates used space. If you click the title of the box, it shows detailed statistics of your Memcached instance

#### Cache levels

Django provides the following levels of caching, listed here by ascending order of granularity:

- Low-level cache API: Provides the highest granularity. Allows you to cache specific queries or calculations.
- Template cache: Allows you to cache template fragments.
- Per-view cache: Provides caching for individual views.
- Per-site cache: The highest-level cache. It caches your entire site.

#### Using the low-level cache API

- The low-level cache API allows you to store objects in the cache with any granularity. It is located at django.core.cache.
- Let's take a look at how the cache API works. Open the shell with the command python manage.py shell and write `cache.set('musician', 'Django Reinhardt', 20)`:
    - access the default cache backend and use set(key, value, timeout) to store a
    - key named 'musician' with a
    - value that is the string 'Django Reinhardt'
    - for 20 seconds. If you don't specify a timeout, Django uses the default timeout specified for the cache backend in the CACHES setting.
- `>>> cache.get('musician') > 'Django Reinhardt'` but only for the first 20 seconds. Then, no value will be returned.
- Cache a QuerySet. You perform a QuerySet on the Subject model and store the returned objects in the 'my_subjects' key:
```python
>>> from courses.models import Subject
>>> subjects = Subject.objects.all()
>>> cache.set('my_subjects', subjects)
```
- Let's retrieve the cached data:
```python
>>> cache.get('my_subjects')
<QuerySet [<Subject: Mathematics>, <Subject: Music>, <Subject: Physics>, <Subject: Programming>]>
```
- Cache some queries in your views. Edit the `views.py` file of the courses application and add the cache import. In the get() method of the `CourseListView()` add `cache.set('all_subjects', subjects)`.
- In this code, you try to get the all_students key from the cache using cache. get(). This returns None if the given key is not found. If no key is found (not cached yet or cached but timed out), you perform the query to retrieve all Subject objects and their number of courses, and you cache the result using cache.set().
- Take a look at Curr Items, which should be 1. This shows that there is one item currently stored in the cache. Get Hits shows how many get commands were successful and Get Misses shows the get requests for keys that are missing. The Miss Ratio is calculated using both of them.

##### Cache based on dynamic data

- you will want to cache something that is based on dynamic data. In these cases, you have to build dynamic keys that contain all the information required to uniquely identify the cached data.
- Edit the `views.py` file of the courses application and modify the `CourseListView` view
- Cache both all courses and courses filtered by subject. You use the all_courses cache key for storing all courses if no subject is given. If there is a subject, you build the key dynamically with `f'subject_{subject.id}_courses'`.
- It is important to note that you can't use a cached QuerySet to build other QuerySets, since what you cached are actually the results of the QuerySet
- Instead, you have to create the base QuerySet `course.objects.annotate(total_ modules=Count('modules'))`, which is not going to be executed until it is forced, and use it to further restrict the QuerySet with all_courses.
- `filter(subject=subject)` in case the data was not found in the cache.

#### Caching template fragments

- Caching tempaltes is a higher-level approach
- Load the cache template tags in your template using {% load cache %}. Then, you will be able to use the {% cache %} template tag to cache specific template fragments. You will usually use the template tag as follows `{% cache 300 fragment_name %} ... {% endcache %}`
- The {% cache %} template tag has two required arguments: the timeout in seconds and a name for the fragment. If you need to cache content depending on dynamic data, you can do so by passing additional arguments to the {% cache %} template tag to uniquely identify the fragment
- Edit the `/students/course/detail.html` of the students application and add `{% load cache %}` right after the `{% extends %}` tag
- then cache the content in `module contents` block; You cache this template fragment using the name module_contents and passing the current Module object to it. Thus, you uniquely identify the fragment. This is important to avoid caching a module's contents and serving the wrong content when a different module is requested
- Regarding Language: If the USE_I18N setting is set to True, the per-site middleware cache will respect the active language. If you use the {% cache %} template tag, you have to use one of the translation-specific variables available in templates to achieve the same result, such as{% cache 600 name request.LANGUAGE_CODE %}.

#### Caching views

- You can cache the output of individual views using the cache_page decorator located at django.views.decorators.cache. The decorator requires a timeout argument (in seconds)
- Edit the `urls.py` file of the students application and add the `cache_page` import. Then, apply the `cache_page` decorator to the student_course_detail and student_course_detail_module URL patterns
```python
path('course/<pk>/', cache_page(60 * 15)(views.StudentCourseDetailView.as_view()), name='student_course_detail'
```
- Now, the result for the StudentCourseDetailView is cached for 15 minutes.

##### Using per-site cache

- This is the highest-level cache. It allows you to cache your entire site. To allow the per-site cache, edit the settings.py file of your project and add the UpdateCacheMiddleware and FetchFromCacheMiddleware classes to the MIDDLEWARE setting.
- Remember that middleware are executed in the given order during the request phase, and in reverse order during the response phase. UpdateCacheMiddleware is placed before CommonMiddleware because it runs during response time, when middleware are executed in reverse order. FetchFromCacheMiddleware is placed after CommonMiddleware intentionally because it needs to access request data set by the latter
- Add settings to the `settings.py`: alias, seconds, and key_prefix
- In these settings, you use the default cache for your cache middleware and set the global cache timeout to 15 minutes. You also specify a prefix for all cache keys to avoid collisions in case you use the same Memcached backend for multiple projects. Your site will now cache and return cached content for all GET requests.
- You have done this to test the per-site cache functionality. However, the per-site cache is not suitable for you, since the course management views need to show updated data to instantly reflect any changes.
- __The best approach to follow in your project is to cache the templates or views that are used to display course contents to students.__
- __Define your cache strategy wisely and prioritize the most expensive QuerySets or calculations.__

### Summary

- In this chapter, you implemented the public views for the course catalog.
You built a system for students to register and enroll on courses.
- You also created the functionality to render different types of content for the course modules.
- You learned how to use the Django cache framework and you installed and monitored the Memcached cache backend.

## Chapter 12: Building a RESTful API (443-466)

- You will create a RESTful API for your e-learning platform. An
API allows you to build a common core that can be used on multiple platforms like websites, mobile applications, plugins, and so on. For example, you can create an API to be consumed by a mobile application for your e-learning platform.
- If you provide an API to third parties, they will be able to consume information and operate with your application programmatically. An API allows developers to automate actions on your platform and integrate your service with other applications or online services.
- You will build a fully featured API for your e-learning platform.

### Building a RESTfil API

- When building an API, there are several ways you can structure its endpoints and actions, but following REST principles is encouraged. The REST architecture comes from Representational State Transfer.
- RESTful APIs are resource-based; your models represent resources and HTTP methods such as _GET, POST, PUT, or DELETE_ are used to retrieve, create, update, or delete objects.
- Common formats to exchange data in RESTful APIs are JSON and XML. You will build a RESTful API with JSON serialization for your project.
- The functionalities will be: retrieve subjects, retrieve available courses, retrieve course contents, enroll on a course.

### Installing Django REST framework

- Django REST framework allows you to easily build RESTful APIs for your project.
- Install it via `pip3 install djangorestframework==3.11.0` and actiavte the app in the INSTALLED_APPS in `settings.py` as `rest_framework`. Also add the "DEFAULT_PERMISSION_CLASSES'.
- You can provide a specific configuration for your API using the REST_FRAMEWORK setting. REST framework offers a wide range of settings to configure default behaviors.
- The DEFAULT_PERMISSION_CLASSES setting specifies the default permissions to read, create, update, or delete objects. You set DjangoModelPermissionsOrAnonReadOnly as the only default permission class.
- This class relies on Django's permissions system to allow users to create, update, or delete objects, while providing read-only access for anonymous users. You will learn more about permissions later in the Adding permissions to views section.

### Defining serializers

- After setting up the REST framework, you need to specify how your data will be serialized. Output data has to be serialized in a specific format, and input data will be deserialized for processing. The framework provides classes to build serializers for single objects:
    - Serializer: Provides serialization for normal Python class instances.
    - ModelSerializer: Provides serialization for model instances.
    - HyperlinkedModelSerializer: The same as ModelSerializer, but it represents object relationships with links rather than primary keys.

- Create the following structure inside the courses application: `api/__init__.py, serializers.py`. You will build API functionality inside the api directory to keep everything well organized. Edit the `serializers.py` file by setting a class SubjectSerializer(serializers.ModelSerializer) with:
    - model = Subject
    - fields = ['id', 'title', 'slug']
- Serializers are defined in a similar fashion to Django's Form and ModelForm classes. The Meta class allows you to specify the model to serialize and the fields to be included for serialization. All model fields will be included if you don't set a fields attribute.
- In an example, you get a Subject object, create an instance of SubjectSerializer, and access the serialized data. You can see that the model data is translated into Python native data types.

### Understanding parsers and renderers

- The serialized data has to be rendered in a specific format before you return it in an HTTP response.
- Likewise, when you get an HTTP request, you have to parse the incoming data and deserialize it before you can operate with it.
- REST framework includes renderers and parsers to handle that.
- Given a JSON string input, you can use the JSONParser class provided by REST framework to convert it to a Python object.
- REST framework also includes Renderer classes that allow you to format API responses.
    - The framework determines which renderer to use through content negotiation by inspecting the request's Accept header to determine the expected content type for the response.
    - Optionally, the renderer is determined by the format suffix of the URL. For example, the URL http://127.0.0.1:8000/api/data.json might be an endpoint that triggers the JSONRenderer in order to return a JSON response.
- REST framework uses two different renderers. You can change the default renderer classes with the DEFAULT_RENDERER_ CLASSES option of the REST_FRAMEWORK setting.
    - You use the JSONRenderer to render the serialized data into JSON
    - BrowsableAPIRenderer provides a web interface to easily browse your API.

### Building list and detail views

- REST framework comes with a set of generic views and mixins that you can use to build your API views. They provide the functionality to retrieve, create, update, or delete model objects.
- To create list and detail views to retrieve Subject objects, create a new file inside the courses/api/ directory and name it `views.py`.
- create two classes:
    - class SubjectListView(generics.ListAPIView)
    - class SubjectDetailView(generics.RetrieveAPIView)
    - Both views have the following attributes:
        - queryset: The base QuerySet to use to retrieve objects
        - serializer_class: The class to serialize objects
- Let's add URL patterns for your views. Create a new file inside the courses/api/ directory, name it `urls.py`:
    - path('subjects/',views.SubjectListView.as_view(), name='subject_list')
    - path('subjects/<pk>/', views.SubjectDetailView.as_view(), name='subject_detail')
- Edit the main `urls.py `file of the educa project and include the API patterns
- Run the server and try `curl http://127.0.0.1:8000/api/subjects/` which will give you the contents.
- To obtain a more readable, well-indented JSON response, you can use curl with the json_pp utility: `curl http://127.0.0.1:8000/api/subjects/ | json_pp`
- The HTTP response contains a list of Subject objects in JSON format.
- Retrieving data:
    - If your operating system doesn't come with curl installed, you can download it from https://curl.haxx.se/dlwiz/.
    - Instead of curl, you can also use any other tool to send custom HTTP requests, including a browser extension such as Postman, which you can get at https://www.getpostman.com/.    

### Creating nested serializers

- You are going to create a serializer for the Course model. Edit the api/ serializers.py file of the courses application by adding: class CourseSerializer(serializers.ModelSerializer)
- You will get a JSON object with the fields that you included in CourseSerializer. You can see that the related objects of the modules manager are serialized as a list of primary keys.
- You want to include more information about each module, so you need to serialize Module objects and nest them. Modify the previous code of the api/serializers. py file of the courses application.
- You define ModuleSerializer to provide serialization for the Module model. Then, you add a modules attribute to CourseSerializer to nest the ModuleSerializer serializer.
    - You set many=True to indicate that you are serializing multiple objects.
    - The read_only parameter indicates that this field is read-only and should not be included in any input to create or update objects.
- Open the shell and create an instance of CourseSerializer again. Render the serializer's data attribute with JSONRenderer. This time, the listed modules are being serialized with the nested ModuleSerializer serializer.

### Building custom API views

- REST framework provides an APIView class that builds API functionality on top of Django's View class.
The APIView class differs from View:
    - by using REST framework's custom Request and Response objects,
    - and handling APIException exceptions to return the appropriate HTTP responses.
    - It also has a built-in authentication and authorization system to manage access to views.
- You are going to create a view for users to enroll on courses. Edit the api/views.py file of the courses application:
```python
class CourseEnrollView(APIView)
    def post(self, request, pk, format=None):
        course = get_object_or_404(Course, pk=pk) course.students.add(request.user)
        return Response({'enrolled': True})
```
1. You create a custom view that subclasses APIView.
2. You define a post() method for POST actions. No other HTTP method will
be allowed for this view.
3. You expect a pk URL parameter containing the ID of a course. You retrieve the course by the given pk parameter and raise a 404 exception if it's not found.
4. You add the current user to the students many-to-many relationship of the Course object and return a successful response.
- Edit the api/urls.py file and add the URL pattern for the CourseEnrollView.
- Theoretically, you could now perform a POST request to enroll the current user on a course. However, you need to be able to identify the user and prevent unauthenticated users from accessing this view.

### Handling Auth

- REST framework provides authentication classes to identify the user performing the request. If authentication is successful, the framework sets the authenticated User object in request.user. If no user is authenticated, an instance of Django's AnonymousUser is set instead.
- REST framework provides the following authentication backends:
    - `BasicAuthentication`: This is HTTP basic authentication. The user and password are sent by the client in the Authorization HTTP header encoded with Base64.
    - `TokenAuthentication`: This is token-based authentication. A Token model is used to store user tokens. Users include the token in the Authorization HTTP header for authentication.
    - `SessionAuthentication`: This uses Django's session backend for authentication. This backend is useful for performing authenticated AJAX requests to the API from your website's frontend.
    - `RemoteUserAuthentication`: This allows you to delegate authentication to your web server, which sets a REMOTE_USER environment variable.
- You can build a custom authentication backend by subclassing the BaseAuthentication class provided by REST framework and overriding the authenticate() method.
- You can set authentication on a per-view basis, or set it globally with the DEFAULT_ AUTHENTICATION_CLASSES setting.
- Note: Authentication only identifies the user performing the request. It won't allow or deny access to views. You have to use permissions to restrict access to views.
- Add BasicAuthentication to your view:
    - Edit the api/views.py file of the courses application and add an authentication_classes attribute to CourseEnrollView.
    - Users will be identified by the credentials set in the Authorization header of the HTTP request.

### Adding permissions to views
- REST framework includes a permission system to restrict access to views. Some of the built-in permissions of REST framework are:
    - AllowAny: Unrestricted access, regardless of whether a user is authenticated or not.
    - IsAuthenticated: Allows access to authenticated users only.
    - IsAuthenticatedOrReadOnly: Complete access to authenticated users. Anonymous users are only allowed to execute read methods such as GET, HEAD, or OPTIONS.
    - DjangoModelPermissions: Permissions tied to django.contrib.auth. The view requires a queryset attribute. Only authenticated users with model permissions assigned are granted permission.
    - DjangoObjectPermissions: Django permissions on a per-object basis.
- If users are denied permission, they will usually get one of the following HTTP error codes:
    - HTTP 401: Unauthorized.
    - HTTP 403: Permission denied.
- Edit the api/views.py file of the courses application and add a permission_classes attribute to CourseEnrollView() by importing isAuthenticated.
- You include the IsAuthenticated permission. This will prevent anonymous users from accessing the view. Now, you can perform a POST request to your new API method.
- Run the dev server and make a post request: `curl -i -X POST http://127.0.0.1:8000/api/courses/1/enroll/` which will respond with a 401
- You got a 401 HTTP code as expected, since you are not authenticated. Let's use basic authentication with one of your users. Run the following command, replacing student:password with the credentials of an existing user: `curl -i -X POST -u student:password http://127.0.0.1:8000/api/courses/1/ enroll/` which will return a `200 OK`.
- You can access the administration site and check that the user is now enrolled on the course.

### Creating viewsets and routers

- ViewSets allow you to define the interactions of your API and let REST framework build the URLs dynamically with a Router object.
- By using viewsets, you can avoid repeating logic for multiple views.
- Viewsets include actions for the following standard operations:
    - Create operation: create()
    - Retrieve operation: list() and retrieve()
    - Update operation: update() and partial_update()
    - Delete operation: destroy()
- Let's create a viewset for the Course model. Edit the `api/views.py` file
    - You subclass ReadOnlyModelViewSet, which provides the read-only actions list() and retrieve() to both list objects, or retrieves a single object.
- Edit the `api/urls.py` file and create a router for your viewset.
- You create a DefaultRouter object and register your viewset with the courses prefix.
- The router takes charge of generating URLs automatically for your viewset.
- Open http://127.0.0.1:8000/api/ in your browser. You will see that the router lists all viewsets in its base URL: You can access http://127.0.0.1:8000/api/courses/ to retrieve the list of courses.

### Adding additional action to viewsets

- You can add extra actions to viewsets. Let's change your previous CourseEnrollView view into a custom viewset action.
- Edit the `api/views.py` file and modify the CourseViewSet class.
    - Import action decorator
    - add @action decorator to the function enroll()
        - ACtion decorator with param detail=True to specify that this in an action to be performed on a single object.
        - decorator allows you to add custom attributes for the action. You specify that only the post() method is allowed for this view and set the auth and permission classes.
        - Use self.get_object() to retrieve the Course object.
        - Add the current user to the students many-to-many relationship and return a custom success response.
- Edit the `api/urls.py` and remove the enroll path
- Edit the `api/views.py` and remove the CourseEnrollView class
- The view to enroll is now automatically generated by the router. The URL remains the same, since it's built dynamically using your action name `enroll`.

### Creating custom permissions

- You want students to be able to access the contents of the courses they are enrolled on.
- Only students enrolled on a course should be able to access its contents.
- The best way to do this is with a custom permission class.
- Django provides a BasePermission class that allows you to define the following methods:
    - has_permission(): View-level permission check.
    - has_object_permission(): Instance-level permission check.
- These methods return True to grant access, or False otherwise.
- Create a new file in `courses/api/` named `permissions.py`.
- You subclass the BasePermission class and override the has_object_ permission().
- You check that the user performing the request is present in the students relationship of the Course object.
- You are going to use the IsEnrolled permission next.

### Serializing course contents

- You need to serialize course contents. The Content model includes a generic foreign key that allows you to associate objects of different content models.
- Yet, you added a common render() method for all content models in the previous chapter. You can use this method to provide rendered contents to your API.
- Edit the `api/serializers.py` file of the courses application:
    - class ItemRelatedField(serializers.RelatedField)
    - class ContentSerializer(seralizers.ModelSerializer)
- Define a custom field by subclassing the RelatedField serializer field provided by REST framework and overriding the to_representation() method.
- You define the ContentSerializer serializer for the Content model and use the custom field for the item generic foreign key.
- You need an alternative serializer for the Module model that includes its contents, and an extended Course serializer as well. Edit the `api/serializers.py` file
- Let's create a view that mimics the behavior of the `retrieve()` action, but includes the course contents. Edit the `api/views.py` file, and add `@action def contents()` for the `class CourseViewSet(viewsets.ReadOnlyModelViewSet)` class
    - Use the action decorator with the parameter detail=True to specify an action that is performed on a single object.
    - You specify that only the GET method is allowed for this action.
    - You use the new CourseWithContentsSerializer serializer class that
includes rendered course contents.
    - You use both IsAuthenticated and your custom IsEnrolled permissions. By doing so, you make sure that only users enrolled on the course are able to access its contents.
    - You use the existing retrieve() action to return the Course object.
- Open http://127.0.0.1:8000/api/courses/1/contents/ in your browser. If you access the view with the right credentials, you will see that each module of the course includes the rendered HTML for course contents.
- You have built a simple API that allows other services to access the course application programmatically. REST framework also allows you to handle creating and editing objects with the ModelViewSet viewset.

### Consuming the REST API

- Now that you have implemented an API, you can consume it in a programmatic manner from other applications.
    - Interact with the API using JavaScript in the frontend of your application, in a similar fashion to the AJAX functionalities
    - Consume the API from applications built with Python or any other programming languages.
- Create a simple Python application that uses the RESTful API to retrieve all available courses and then enrolls a student on all of them.
- You will learn how to authenticate against the API using HTTP basic authentication, and perform GET and POST requests.
- Use the Python Requests library to consume the API: Requests is the most popular HTTP library for Python.
- It abstracts the complexity of dealing with HTTP requests and provides a very simple interface to consume HTTP services.
- Install requests via `pip3 install requests==2.23`;
- Create a new directory next to the educa project directory and name it api_ examples.
- Create a new file inside the api_examples/ directory and name it enroll_all.py.
    - You import the Requests library and define the base URL for the API.
    - You use requests.get() to retrieve data from the API by sending a GET request to the URL http://127.0.0.1:8000/api/courses/. This API endpoint is publicly accessible, so it does not require any authentication.\
    - You use the json() method of the response object to decode the JSON data returned by the API.
    - You print the title attribute of each course.
    - __Run the api call with: `python3 enroll_all.py`__
- Extend `enroll_all.py` with credentials, and a requests.posts to enroll in all courses via getting the course-ids.
    - You define the username and password of the student you want to enroll on courses.
    - You iterate over the available courses retrieved from the API.
    - You store the course ID attribute in the course_id variable and the title attribute in the course_title variable.
    - You use requests.post() to send a POST request to the URL http://127.0.0.1:8000/api/courses/[id]/enroll/ for each course. This URL corresponds to the CourseEnrollView API view, which
allows you to enroll a user on a course. You build the URL for each course using the course_id variable. The CourseEnrollView view requires authentication. It uses the IsAuthenticated permission and the BasicAuthentication authentication class. The Requests library supports HTTP basic authentication out of the box. You use the auth parameter to pass a tuple with the username and password to authenticate the user using HTTP basic authentication.
    - If the status code of the response is 200 OK, you print a message to indicate that the user has been successfully enrolled on the course.
    - __Run the api call with: `python3 enroll_all.py`__
- You have successfully enrolled the user on all available courses using the API. You will see a Successfully enrolled message for each course in the platform. As you can see, it's very easy to consume the API from any other application. You can effortlessly build other functionalities based on the API and let others integrate your API into their applications.

### Summary

-  Learned how to use Django REST framework to build a RESTful API for your project.
- Created serializers and views for models, and you built custom API views. - You also added authentication to your API and you restricted access to API views using permissions.
- Discovered how to create custom permissions, and you implemented viewsets and routers.
- Finally, you used the Requests library to consume the API from an external Python script.

## Chapter 13: Building a Chat Server (467-496)

- In this chapter, you will build a chat server for students using Django Channels.
- Students will be able to access a different chat room for each course they are enrolled on.

### Creating a chat application

- Implement a chat server to provide students with a chat room for each course.
- Students enrolled in a course will be able to access the course chat room and exchange messages in real-time with Channels.
- Channels is a Django application that extends Django to handle protocols that require long-running connections, such as WebSockets, chatbots, or MQTT (a lightweight publish/subscribe message transport commonly used
in Internet of things projects).
- With Channels implement real-time or asynchronous functionalities into your project in addition to your standard HTTP synchronous views.
- You will start by adding a new application to your project. The new application will contain the logic for the chat server.
- Create a new application in educa via `django-admin startapp chat` and register it in `settings.py` under INSTALLED_APPS.

#### Implementing the chatroom view

- Provide students with a different chat room for each course. Create a view for students to join the chat room of a given course but only for enrolled students.
- Edit `views.py` of the chat application: with a function `def course_chat_view()`:
    - @login_required decorator to prevent any non-authenticated user from accessing the view.
    - View receives a required course_id parameter that is used to retrieve the course with the given id.
    - Access the courses that the user is enrolled on through the relationship courses_joined and retrieve the course with the given id from that subset of courses.
    - If the course with the given id does not exist or the user is not enrolled on it, you return an HttpResponseForbidden response, which translates to an HTTP response with status 403.
    - If the course with the given id exists and the user is enrolled on it, you render the chat/room.html template, passing the course object to the template context.
- Create a new file `urls.py` inside the chat application, and add the intial url pattern. In this you define the course_chat_room URL pattern, including the course_id parameter with the int prefix, as you only expect an integer value here.
    - Include the new URL pattern in the main project `urls.py` of educa under the `chat/` path.
- Create a template for the course_chat_room view. This template will contain an area to visualize the messages that are exchanged in the chat and a text input with a submit button to send text messages to the chat.
    - Create `templates/chat/room.html` that extends `base.html`
    - In the template, you define a <div> HTML element with the chat ID that you will use to display the chat messages sent by the user and by other students.
    - You also define a second <div> element with a text input and a submit button that will allow the user to send messages.
    - You include the domready block defined by the base.html template, which you are going to implement later using JavaScript, to establish a connection with a WebSocket and send or receive messages.

#### Deactivating per-site cache

- In chap 11, we added a site-wide cache to your Django project. Now, you will need to follow a more granular approach for caching to prevent the chat room pages from being cached. You will deactivate the per-site cache to avoid site-wide caching and only use caching where needed.
- Edit the settings.py file and comment out the `UpdateCacheMiddleware` and `FetchFromCacheMiddleware` classes of the MIDDLEWARE setting.

### Real-time Django with Channels

- You are building a chat server to provide students with a chat room for each course.
- Students enrolled on a course will be able to access the course chat room and exchange messages.
- This functionality requires real-time communication between the server and the client. The client should be able to connect to the chat and send
or receive data at any time.
- There are several ways you could implement this feature using AJAX polling or long polling in combination with storing the messages in your database or Redis.
- However, there is no efficient way to implement a chat server using a standard synchronous web application.
- You are going to build a chat server using asynchronous communication through ASGI.

#### Async Applications using ASGI

- Django is usually deployed using Web Server Gateway Interface (WSGI), which is the standard interface for Python applications to handle HTTP requests.
- However, to work with asynchronous applications, you need to use another interface called ASGI, which can handle WebSocket requests as well.
- ASGI is the emerging Python standard for asynchronous web servers and applications.
- Channels extends Django to handle not only HTTP, but also protocols that require long-running connections, such as WebSockets and chatbots.
- WebSockets provide full-duplex communication by establishing a persistent, open, bidirectional Transmission Control Protocol (TCP) connection between servers and clients.

#### The request/response cycle using Channels

- Sync cycle with HTTP requests:
    - When an HTTP request is sent by the browser to the web server, Django handles the request and passes the HttpRequest object to the corresponding view.
    - The view processes the request and returns an HttpResponse object that is sent back to the browser as an HTTP response.
    - There is no mechanism to maintain an open connection or send data to the browser without an associated HTTP request.
- Async cycle with websockets:
    - Channels replaces Django's request/response cycle with messages that are sent across channels.
    - HTTP requests are still routed to view functions using Django, but they get routed over channels.
    - This allows for WebSockets message handling as well, where you have producers and consumers that exchange messages across a channel layer.
    - Channels preserves Django's synchronous architecture, allowing you to choose between writing synchronous code and asynchronous code, or a combination of both.

### Installing Channels

- Edit the `settings.py` of the educa project, and add channels to the INSTALLED_APPS setting to activate it.
- Channels expects you to define a single root application that will be executed for all requests.
- You can define the root application by adding the ASGI_APPLICATION setting to your project. This is similar to the ROOT_URLCONF setting that points to the base URL patterns of your project.  
- You can place the root application anywhere in your project, but it is recommended to put it in a project-level file named routing.py.
- Create a new file inside the educa project directory next to the settings.py file and name it `routing.py`, add `applicaton = ProtocolTypeRouter` to it, and add the line `ASGI_APPLICATION = 'educa.routing.application'` to the project.
    - This defines the main ASGI application that will be executed when serving your Django project through ASGI. Use the ProtocolTypeRouter class provided by Channels as the main entry point of your routing system.
    - ProtocolTypeRouter takes a dictionary that maps communication types like http or websocket to ASGI applications.
    - You instantiate this class with an empty dictionary that later you will fill with a route for your chat application WebSocket consumer.
- When Channels is added to the INSTALLED_APPS setting, it takes control over the runserver command, replacing the standard Django development server.
    - Besides handling URL routing to Django views for synchronous requests, the Channels development server also manages routes to WebSocket consumers.
    - Check that the output contains the line Starting ASGI/Channels version 2.4.0 development server.
    - HTTP requests continue to behave the same as before, but they get routed over channels.

- Now that Channels is installed in your project, you can build the chat server for courses:

    1. Set up a consumer: Consumers are individual pieces of code that can handle Websockets in a very similar way to traditional HTTP views. You will build a consumer to read and write messages to a communication channel.
    2. Configure routing: Channels provides routing classes that allow you to combine and stack your consumers. You will configure URL routing for your chat consumer.
    3. Implement a Websocket client: When the student accesses the chat room, you will connect to the WebSocket from the browser and send or receive messages using JavaScript.
    4. Enable a channel layer: Channel layers allow you to talk between different instances of an application. They're a useful part of making a distributed real-time application. You will set up a channel layer using Redis.

### Writing a consumer

- Consumers are the equivalent of Django views for async applications. As mentioned, they handle Websockets in a similar way to how traditional views handle HTTP requests.
- Consumers are ASGI applications that can handle messages, notifications, and other htings.
- Unlike Django views, consumersare built for long-running communication. URLs are mapped to consumers through routing classes that allow to combine and stack consumers.

- Implement a basic consumer that is able to accept WebSocket connections and echoes every message it receives from the WebSocket back to it: This initial functionality will allow the student to send messages to the consumer and receive back the messages it sends.
- Create a new file inside the chat application directory and name it `consumers.py` with class `ChatConsumer(WebsocketConsumer)`: this class inherits from the Channels WebsocketConsumer class to implement a basic WebSocket consumer.
    - connnect(): Called when a new connection is received. You accept any connection with self.accept(). You can also reject a connection by calling self.close().
    - disconnect(): Called when the socket closes. You use pass because you don't need to implement any action when a client closes the connection.
    - receive(): Called whenever data is received. You expect text to be received as text_data (this could also be binary_data for binary data). You treat the text data received as JSON. Therefore, you use json.loads() to load the received JSON data into a Python dictionary. You access the message key, which you expect to be present in the JSON structure received. To echo the message, you send the message back to the WebSocket with self. send(), transforming it in JSON format again through json.dumps().

### Routing

- Define a URL to route connections to the ChatConsumer consumer you have implemented.
- Channels provides routing classes that allow you to combine and stack consumers to dispatch based on what the connection is.
- You can think of them as the URL routing system of Django for asynchronous applications.
- Create a new file inside the chat application directory and name it `routing.py` with: `websocket_urlpatterns = [ re_path(r'ws/chat/room/(?P<course_id>\d+)/$', consumers.ChatConsumer)]`
    - This code matches the URL pattern with the ChatConsumer class from the `chat/consumers.py` file.
    - Use Django's `re_path` to define the path with regular expressions. The URL includes an integer parameter called course_id. This parameter will be available in the scope of the consumer and will allow you to identify the course chat room that the user is connecting to.
- It is a good practice to prepend WebSocket URLs with /ws/ to differentiate them from URLs used for standard synchronous HTTP requests. This also simplifies the production setup when an HTTP server routes requests based on the path.
- Edit the global `routing.py` nect ot the `settings.py` by importing chat.routing, and channels.auth; and integrate the Auth / URLRouter with the application.
    - Use URLRouter to map websocket connections to the URL patterns defined in the websocket_urlpatterns list of the chat application routing file.
    - the ProtocolTypeRouter router automatically maps HTTP requests to the standard Django views if no specific http mapping is provided.
    - The AuthMiddlewareStack class provided by Channels supports standard Django authentication, where the user details are stored in the session. You plan to access the user instance in the scope of the consumer to identify the user who sends a message.

### Implementing the websocket client

- Build a WebSocket client to establish a connection with the WebSocket in the course chat room template and be able to send/receive messages.
- Implement the WebSocket client with JavaScript to open and maintain a connection in the browser. You will use jQuery for interaction with Document Object Model (DOM) elements. Edit the `chat/room.html` template of the chat application and modify the domready block:

```python
var url = 'ws://' + window.location.host +
    '/ws/chat/room/' + '{{ course.id }}/';
var chatSocket = new WebSocket(url);
```
-  Define a URL with the WebSocket protocol, which looks like ws:// (or wss:// for secure WebSockets, just like https://).
    - You build the URL using the current location of the browser, which you obtain from window.location.host.
    - The rest of the URL is built with the path for the chat room URL pattern that you defined in the routing.py file of the chat application.
    - You write the whole URL instead of building it via its name because Channels does not provide a way to reverse URLs.
    - You use the current course id to generate the URL for the current course and store the URL in a new variable named url.
    - You then open a WebSocket connection to the stored URL using new WebSocket(url). You assign the instantiated WebSocket client object to the new variable chatSocket.
- Run the server and check the output. Besides the HTTP GET requests for the page and its static files, you should see two lines including WebSocket HANDSHAKING and WebSocket CONNECT.
- The Channels development server listens for incoming socket connections using a standard TCP socket.
- The handshake is the bridge from HTTP to WebSockets.
- In the handshake, details of the connection are negotiated and either party can close the connection before completion. Remember that you are using self.accept() to accept any connection in the connect() method of the ChatConsumer class implemented in the consumers.py file of the chat application. The connection is accepted and therefore you see the WebSocket CONNECT message in the console.
- If you use the browser developer tools to track network connections, you can also see information for the WebSocket connection that has been established.
- Now that you are able to connect to the WebSocket, it's time to interact with it. You will implement the methods to handle common events, such as receiving a message and closing the connection. Edit the `chat/room.html` template of the chat application and modify the domready block.
```python
{% block domready %}
#   [...] var url/var chatSocket (see above).

    chatSocket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var message = data.message;
        var $chat = $('#chat');
        $chat.append('<div class="message">' + message + '</div>');
        $chat.scrollTop($chat[0].scrollHeight);
    };
    chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
    };
{% endblock %}
```
- The JS code does the following:
    - `onmessage`:
        - fired when data is received through the websocket
        - parse the message, that you expect in JSON format and access its message attribute
        - append a new div elem with the message to the HTML elem of the chat ID (adds new messages to chat log while keeping all previous ones)
        - Scroll the chat log to the bottom to ensure the new message is seen by scrolling the total scrollable height of the chat log
    - `onclose`: fired when connection is closed. You don't expect to close it, and therefore, throw an error.
- Send messages to the socket. Append the `chat/room.html` template:
```python
var $input = $('#chat-message-input');
var $submit = $('#chat-message-submit');
$submit.click(function() {
    var message = $input.val();
    if(message) {
        chatSocket.send(JSON.stringify({'message': message}));
        $input.val('');
        $input.focus();
    }
});
```
- Define a function for the click event of the submit button, which you select with the ID 'chat-message-submit'. When the button is clicked:
    - Read the message entered by the user from the value of the text input elements with the ID chat-message-input
    - Check whether the message has any content with if(message). If the user has entered a message, form JSON content using `stringify`
    - Send the JSON through the Webscoket via `send`
    - Clear the contents of the text input with `$input.val('')`
    - Return focus to the text with `$input.focus`
- Improve usability by give focus to the text input as soon as page loads:
```python
$input.focus();
$input.keyup(function(e) {
    if (e.which === 13) {
    $submit.click();
    }
});
```
- Give focus to the text input
    - define a function for keyup() event: listen if user presses ENTER (code 13)
    - fire the click event on the submit button to send the message to the websocket.
- Run the server to test the now working chat. However, the chat server is not able to broadcast messages to other clients. If you open a second browser tab and enter a message, the message will not appear on the first tab. In order to build communication between consumers, you have to enable a channel layer.

### Enabling a channel layer 484

- Channel layers allow you to communicate between different instances of an application.
- A channel layer is the transport mechanism that allows multiple consumer instances to communicate with each other and with other parts of Django.
- In your chat server, you plan to have multiple instances of the ChatConsumer consumer for the same course chat room: Each student who joins the chat room will instantiate the WebSocket client in their browser, and that will open a connection with an instance of the WebSocket consumer.
- You need a common channel layer to distribute messages between consumers.

#### Channels and Groups

- Channel layers provide two abstractions to manage communications:
    - Channel: Think of a channel as an inbox where messages can be sent to or as a task queue. Each channel has a name. Messages are sent to a channel by anyone who knows the channel name and then given to consumers listening on that channel.
    - Group: Multiple channels can be grouped into a group. Each group has a name. A channel can be added or removed from a group by anyone who knows the group name. Using the group name, you can also send a message to all channels in the group.
- You will work with channel groups to implement the chat server. By creating a channel group for each course chat room, the ChatConsumer instances will be able to communicate with each other.

#### Setting up a channel layer with Redis

- Redis is the preferred option for a channel layer, though Channels has support for other types of channel layers.
- Redis works as the communication store for the channel layer.
- Install Channels Redis & Redis in the virtual environment, and activate it in the `settings.py` file of the educa project as CHANNEL_LAYERS = {}: it defines the configuration for the channel layers available to the project.
- Define a default channel layer using the `RedisChannelLayer` backend. Initialize the Redis server and send a test message.
```python
>>> import channels.layers
>>> from asgiref.sync import async_to_sync
>>> channel_layer = channels.layers.get_channel_layer()
>>> async_to_sync(channel_layer.send)('test_channel', {'message': 'hello'})
>>> async_to_sync(channel_layer.receive)('test_channel')

You should get the following output:

    {'message': 'hello'}
```
#### Updating the consumer to broadcast messages

- Edit the ChatConsumer consumer to use the channel layer. Use a channel group for each course chat room. Therefore, use the course id to build the group name. Chat Consumer instances will know the group name and will be able to communicate with each other.
- Edit the `consumer.py` file of the chat application, import the async_to_sync() function and modify the connect() method:

```python
class ChatConsumer(WebsocketConsumer):
   def connect(self):
        self.id = self.scope['url_route']['kwargs']['course_id'] self.room_group_name = 'chat_%s' % self.id
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name )
        self.accept()
        # ...
```
- ChatConsumer is a synchronous WebsocketConsumer consumer, but it needs to call asynchronous methods of the channel layer. Connect():
    - retrieve the course id from the scope to know the course that the chat room is associated with. You access self.scope['url_route'] ['kwargs ']['course_id'] to retrieve the course_id parameter from the URL. Every consumer has a scope with information about its connection, arguments passed by the URL, and the authenticated user, if any.
    - You build the group name with the id of the course that the group corresponds to. Remember that you will have a channel group for each course chat room. You store the group name in the room_group_name attribute of the consumer.
    - You join the group by adding the current channel to the group. You obtain the channel name from the channel_name attribute of the consumer. You use the group_add method of the channel layer to add the channel to the group. You use the async_to_sync() wrapper to use the channel layer asynchronous method.
    - You keep the self.accept() call to accept the WebSocket connection.
- When the ChatConsumer consumer receives a new WebSocket connection, it adds the channel to the group associated with the course in its scope. The consumer is now able to receive any messages sent to the group.
In the same `consumers.py` file, modify the disconnect():
```python
def disconnect(self, close_code):
    async_to_sync(self.channel_layer.group_discard)(
        self.room_group_name,
        self.channel_name )
```
- When the connection is closed, you call the group_discard() method of the channel layer to leave the group. You use the async_to_sync() wrapper to use the channel layer asynchronous method. Next, modify the receive() nethod:
```python
def receive(self, text_data):
    text_data_json = json.loads(text_data)
    message = text_data_json['message']
    async_to_sync(self.channel_layer.group_send)(
        self.room_group_name, { 'type': 'chat_message', 'message': message }
    )
```
- When you receive a message from the WebSocket connection, instead of sending the message to the associated channel, you now send the message to the group. You do this by calling the group_send() method of the channel layer. You use the async_ to_sync() wrapper to use the channel layer asynchronous method.
    - type: The event type. This is a special key that corresponds to the name of the method that should be invoked on consumers that receive the event. You can implement a method in the consumer named the same as the message type so that it gets executed every time a message with that specific type is received.
    - message: The actual message you are sending.
```python
def chat_message(self, event):
    self.send(text_data=json.dumps(event))
```
- You name this method chat_message() to match the type key that is sent to the channel group when a message is received from the WebSocket.
- When a message with type chat_message is sent to the group, all consumers subscribed to the group will receive the message and will execute the chat_message() method.
- In the chat_ message() method, you send the event message received to the WebSocket.

- Try it out!:
    - You will see that the first message is only displayed in the first browser window.
    - When you open a second browser window, messages sent in any of the browser windows are displayed in both of them.
    - When you open a new browser window and access the chat room URL, a new WebSocket connection is established between the JavaScript WebSocket client in the browser and the WebSocket consumer in the server.
    - Each channel gets added to the group associated with the course id passed through the URL to the consumer. Messages are sent to the group and received by all consumers.

#### Adding context to the messages

- Now that messages can be exchanged between all users in a chat room, you probably want to display who sent which message and when it was sent. Let's add some context to the messages.
- Edit `consumers.py` file of the chat application:
    - extend connect() by `self.user = self.scope['user']`:  you retrieve the current user from the scope with self. scope['user'] and store them in a new user attribute of the consumer
    - extend receive() by `now = timezone.now()`:
    - extend async-to-sync by `'user': self.user.username, 'datetime': now.isoformat(),`: consumer receives a message through the WebSocket, it gets the current time using timezone.now() and passes the current user and datetime in ISO 8601 format along with the message in the event sent to the channel group
- Edit the `chat/room.html` of the chat application:
```python
var dateOptions = {hour: 'numeric', minute: 'numeric', hour12: true};
var datetime = new Date(data['datetime']).toLocaleString('en', dateOptions); #  convert the datetime received in the message to a JavaScript Date object and format it with a specific locale

var isMe = data.user === '{{ request.user }}';
var source = isMe ? 'me' : 'other';
var name = isMe ? 'Me' : data.user;

var $chat = $('#chat');
$chat.append('<div class="message ' + source + '">' +
    '<strong>' + name + '</strong> ' +
    '<span class="date">' + datetime + '</span><br>' + message +
    '</div>');
```
- What happens?
    - You now convert the datetime received in the message to a JavaScript Date object and format it with a specific locale.
    - Retrieve the user received in the message and make a comparison with two different variables as helpers to identify the user.
    - The variable source gets the value me if the user sending the message is the current user, or other otherwise. You obtain the username using Django's template language with {{ request.user }} to check whether the message originated from the current user or another user. You then use the source value as a class of the main <div> element to differentiate messages sent by the current user from messages sent by others. Different CSS styles are applied based on the class attribute.
    - The variable name gets the value Me if the user sending the message is the current user or the name of the user sending the message otherwise. You use it to display the name of the user sending the message.
    - You use the username and the datetime in the message that you append to the chat log.

### Modifying the consumer to be fully async

- The ChatConsumer you have implemented inherits from the base WebsocketConsumer class, which is synchronous. Synchronous consumers are convenient for accessing Django models and calling regular synchronous I/O functions. However, asynchronous consumers present a higher performance, since they don't require additional threads when handling requests. Since you are using the asynchronous channel layer functions, you can easily rewrite the ChatConsumer class to be asynchronous.
- Edit the `consumers.py` of the chat application & change the chat consumer class:
```python
async def connect(self):
    self.user = self.scope['user']
    self.id = self.scope['url_route']['kwargs']['course_id']
    self.room_group_name = 'chat_%s' % self.id
    await self.channel_layer.group_add(
        self.room_group_name,
        self.channel_name
    )
    await self.accept()
async def disconnect(self, close_code):
    # leave room group
    await self.channel_layer.group_discard(
    self.room_group_name,
    self.channel_name )
    [... also receive and chat_message]
```
- Changes:
    - The ChatConsumer consumer now inherits from the AsyncWebsocketConsumer class to implement asynchronous calls.
    - You have changed the definition of all methods from def to async def.
    - You use await to call asynchronous functions that perform I/O operations.
    - You no longer use the async_to_sync() helper function when calling methods on the channel layer.

### Integrating the chat with existing views

- Let's add a link for students to join the chat room for each course.
- Edit the students/course/detail.html template of the students application:
    - add the following <h3> HTML element code at the bottom of the <div class="contents"> element
    - Open the browser and access any course that the student is enrolled on to view the course contents. The sidebar will now contain a Course chat room link that points to the course chat room view

### Summary

- You learned how to create a chat server using Channels.
- You implemented a WebSocket consumer and client.
- You also enabled communication between consumers using a channel layer with Redis and modified the consumer to be fully asynchronous.
