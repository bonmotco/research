# Book 3: 2019-Designing Microservices with Django.epub
Book is okay and gives an overview but I did not really learn to many things and the projects are not nicely done. Maybe try another one with more code samples and annotations.


## Chapter 1 - What are Microservices?

- Understanding the Microservice
- Was kinda related to what you once did with David from Senacor on Microservice presentations.

## Chapter 2 - A Pinch of Django

1. Getting started:
```python
pip install django;
django-admin startproject tizza
python manage.py runserver
```

2. Django Apps: second layer of logic in folder structure
- To run an app: `python3 manage.py startapp pizza`
-  Visit localhost:8000
3. Django and ORMs: Consider which data will you need
- The Pizza: models.py in Django is needed to get started with ORMs
```python3
from django.db import models

class Pizza(models.Model):
  title = models.CharField(max_length = 120)
  description = models.CharField(max_length=240)
```
- Migrations: generated scripts from your models that you can use to automatically scaffold your databases `python3 manage.py makemigrations` will create a migration plan
- Migration Plans: Python files that contain database operations in order of execution that will run on the database.  `python3 manage.py migrate`
- On migrations: with two shell commands Django creates a whole database: it collects all models, registers them in memory, and parses their metadata (cols, indexes, sequences)

4. Communication with Views
- exposing data through Django's views. They are essentially endpoints that you can utilize to return various types of data to your customers, including the HTML pages in their browsers

## Chapter 3 - Anatomy of a MS

- Backend Services: Talks a lot about data structures, and user data availability for different services. Not a very deep chapter.
- Design Principles: SOLID
  1. Single responsibility principle: one single reason to change.
  2. open-close principle: open to extension but closed to modification
  3. Liskov substitution principle: if you have subtypes in your program the instances of the said types should be replaceable by the subtypes without breaking your program
  4. Interface segregation principle: many client interfaces are btter than a few big abstract ones
  5. Dependency inversion principle: System should depend on abstractions, not concretions.

## Chapter 4 - Communication

### Rest and Synchronous world: REpresentational State Transfer
- The Django REST Framework. It has to be registered in the settings.py as an application.
```python3
pip3 install djangorestframework
```
- __Serializer__ to translate into Json
- __View sets__ describes what type of query should run when we try to access the resource itself
- __Routers__ map RESTful resources to standardized set of URLs.

### Asynchronous world - RabbitMQ <<<
- Producers: part of RabbitMQ that are going to assemble and publish the messages we would like to have consumed asynchronously
- Exchange: logical separator of your message types. E.g., users to users, and likes to likes. Not used widely.
- Routing key: make sure the right message goes to the right place.
- Consumers: systems that are interested in this message can create a queue and bind it to the exchange with the given routing key.

Async best practices:

- Message payloads: make sure that when the message producer changes the message payload, the consumers don't get confused and run into exceptions.
- Handling broker outages: when the central queueing component system stops working, there could be a myriad of issues: lost messages, disconnected producers and consumers. Avoid this by proper monitoring and alerting systems over the broker cluster.

## Chapter 5 - From Monolith to Microservice
 - not relevant

## Chapter 6 - Scaling Development

- Scaffolding: means using a tool like cookiecutter for Django to set the basic framework of a project.


# 2018-Building_Django_2.0_Web_Applications 2018

This book has some django projects that are about starting a django web page, connecting it to a database etc.
I guess it is not of crazy use.

# 2016-Django Project Blueprints

Chapter 1 - Setting up a blog with user accounts

Annotation: Potentially interesting continue with this book.
Went for more modern books from 2020 because it was from 2016 and about setting up a blog. Come on!
