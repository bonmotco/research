# Book 3: 2019-Designing Microservices with Django.epub

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

- Rest and Synchronous world: REpresentational State Transfer
- The Django REST Framework
- Asynchronous world - RabbitMQ <<<


## Chapter 5 - From Monolith to Microservice
 - not relevant

 ## Chapter 6 - Scaling Development

 - at least figure out what scaffolding is
