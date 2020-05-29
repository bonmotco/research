# Overview of Writeup.ai for me

# General Tools

__Redis__ is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker. It supports data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes with radius queries and streams. 

__CircleCI__ CI that’s built for the cloud. Make the switch from Jenkins. [https://circleci.com/]

__Django REST framework__ Django REST framework is a powerful and flexible toolkit for building Web APIs.

__Google Startup Scripts__ Create and run your own startup scripts on your virtual machines (VMs) to perform automated tasks every time your instance boots up. Startup scripts can perform many actions, such as installing software, performing updates, turning on services, and any other tasks defined in the script. You can use startup scripts to easily and programmatically customize your VM instances, including on new instances at creation time.

__Ansible__ is a universal language, unraveling the mystery of how work gets done. Turn tough tasks into repeatable playbooks. Roll out enterprise-wide protocols with the push of a button.

__Cookiecutter Django__ is a framework for jumpstarting production-ready Django projects quickly.

__Traefik__ Simplify networking complexity while designing, deploying, and running applications. [https://containo.us/traefik/]

__Texteditor__ https://www.slatejs.org/examples/richtext

__Cadd__ Caddy a modern web server supporting HTTP/2 is a quick synopsis on installing Caddy along with a short example configuration file.

# Base Requirements

## Asnyc tools
- aiocontextvars==0.2.2 # Asyncio support for PEP-567 contextvars backport.
- aiohttp==3.5.4 # Async http client/server framework (asyncio)
- aioredis==1.2.0 # asyncio (PEP 3156) Redis support

## General Requirements
- argon2-cffi==19.1.0   # password hasher
- asgiref==3.2.1        # ASGI is a standard for Python asynchronous web apps and servers to communicate with each other, and positioned as an asynchronous successor to WSGI
- asn1crypto==0.24.0    # A fast, pure Python library for parsing and serializing ASN.1 structures.
- async-timeout==3.0.1  # asyncio-compatible timeout context manager.
- autobahn==19.9.3      # You can use Autobahn|Python to create clients and servers in Python speaking just plain WebSocket or WAMP. WebSocket allows bidirectional real-time messaging on the Web and beyond, while WAMP adds real-time application communication on top of WebSocket.
- Automat==0.7.0        # Automat is a library for concise, idiomatic Python expression of finite-state automata (particularly deterministic finite-state transducers).
- celery==4.3.0         # Celery is a simple, flexible, and reliable distributed system to process vast amounts of messages, while providing operations with the tools required to maintain such a system.
- channels==2.2.0       # Channels is a project that takes Django and extends its abilities beyond HTTP - to handle WebSockets, chat protocols, IoT protocols, and more. It’s built on a Python specification called ASGI.
- channels-redis==2.4.0 # A Django Channels channel layer that uses Redis as its backing store, and supports both a single-server and sharded configurations, as well as group support.
- constantly==15.1.0    # A library that provides symbolic constant support. It includes collections and constants with text, numeric, and bit flag values
- contextvars==2.4      # is a Python module to manage contexted variables.
- coreapi==2.3.3        # Core API helpers for Django and Django Rest Framework
- cryptography==2.7     # includes both high level recipes and low level interfaces to common cryptographic algorithms such as symmetric ciphers, message digests, and key derivation functions
- daphne==2.3.0         # Daphne is a HTTP, HTTP2 and WebSocket protocol server for ASGI and ASGI-HTTP, developed to power Django Channels.   
- flower==0.9.3         # Flower is a web based tool for monitoring and administrating Celery clusters.
- hiredis==1.0.0 # Python extension that wraps protocol parsing code in -hiredis. It primarily speeds up parsing of multi bulk replies.
hyperlink==19.0.0 # The humble, but powerful, URL runs everything around us. Chances are you’ve used several just to read this text. Hyperlink is a featureful, pure-Python implementation of the URL, with an emphasis on correctness. 
- idna-ssl==1.1.0 # Patch ssl.match_hostname for Unicode(idna) domains support
- immutables==0.9 # An immutable mapping type for Python.
---
---
- incremental==17.5.0 # Incremental is a small library that versions your Python projects.
- msgpack==0.6.1 # MessagePack is an efficient binary serialization format. It lets you exchange data among multiple languages like JSON. But it's faster and smaller. T
- multidict==4.5.2 # Multidict is dict-like collection of key-value pairs where key might be occurred more than once in the container.
- profilehooks==1.11.0 # It’s a collection of decorators for profiling functions
- PyHamcrest==1.9.0 # PyHamcrest is a framework for writing matcher objects, allowing you to declaratively define “match” rules. There are a number of situations where matchers are invaluable, such as UI validation, or data filtering, but it is in the area of writing flexible tests that matchers are most commonly used
- python-coveralls==2.9.3 # This package provides a module to interface with the https://coveralls.io API.
- python-slugify==3.0.3  # A Python Slugify application that handles Unicode
- pytz==2019.2  # pytz brings the Olson tz database into Python. This library allows accurate and cross platform timezone calculations using Python 2.4 or higher. 
- PyYAML==5.1.2 # YAML is a data serialization format designed for human readability and interaction with scripting languages. PyYAML is a YAML parser and emitter for Python.
- redis==3.3.8  # The Python interface to the Redis key-value store.
- sentry-asgi==0.2.0 # Sentry integration for ASGI frameworks.
- sentry-sdk==0.12.2 # Sentry provides self-hosted and cloud-based error monitoring that helps all software teams discover, triage, and prioritize errors in real-time.
- twisted==19.7.0 # Twisted is an event-based framework for internet applications, supporting Python 2.7 and Python 3.5+. It includes modules for many different purposes, including the following
- txaio==18.8.1 # txaio is a helper library for writing code that runs unmodified on both Twisted and asyncio / Trollius.
- typing-extensions==3.7.4 # Typing Extensions – Backported and Experimental Type Hints for Python
- websocket-client==0.56.0 # websocket-client module is WebSocket client for python. This provide the low level APIs for WebSocket. All APIs are the synchronous functions.
- websockets==8.0.2 # websockets is a library for building WebSocket servers and clients in Python with a focus on correctness and simplicity.
- whitenoise==4.1.3 # Radically simplified static file serving for Python web apps
- XlsxWriter==1.2.0 # XlsxWriter is a Python module for writing files in the Excel 2007+ XLSX file format.
- yarl==1.3.0 # URL library
- zope.interface==4.6.0 # This package provides an implementation of “object interfaces” for Python. Interfaces are a mechanism for labeling objects as conforming to a given API or contract. So, this package can be considered as implementation of the Design By Contract methodology support in Python.

## Django Requirements

- django==2.2.5 # A high-level Python Web framework that encourages rapid development and clean, pragmatic design.
- django-allauth==0.39.1 # Integrated set of Django applications addressing authentication, registration, account management as well as 3rd party (social) account authentication.
- django-cors-headers==3.1.0 # django-cors-headers is a Django application for handling the server headers required for Cross-Origin Resource Sharing (CORS).
- django-crispy-forms==1.7.2 # The best way to have Django DRY forms. Build programmatic reusable layouts out of components, having full control of the rendered without writing HTML in templates. 
- django-environ==0.4.5 # Django-environ allows you to utilize 12factor inspired environment variables to configure your Django application.
- django-fsm==2.6.1 # Django friendly finite state machine support.
- django-model-utils==3.2.0 # Django model mixins and utilities
- django-redis==4.10.0 # Full featured redis cache backend for Django.
- django-rest-auth==0.9.5 # Create a set of REST API endpoints for Authentication and Registration
- djangorestframework==3.10.3 # Web APIs for Django, made easy.

## Data Science Requirements
- numpy==1.17.2 # NumPy is the fundamental package for array computing with Python.
- pandas==0.25.1 # Powerful data structures for data analysis, time series, and statistics
- Pillow==6.1.0  # Python Imaging Library (Fork)

# Local Requirements
- black==19.3b0  # The uncompromising code formatter.
- coverage==4.5.4  # Code coverage measurement for Python
- django-coverage-plugin==1.6.0  # Django template coverage.py plugin
- django-debug-toolbar==2.0  # A configurable set of panels that display various debug information about the current request/response.
- django-extensions==2.2.1  # Extensions for Django like validate_template
- django-test-plus==1.3.1 # django-test-plus provides useful additions to Django's default TestCase
- factory-boy==2.12.0  # A versatile test fixtures replacement based on thoughtbot's factory_bot for Ruby.
- flake8==3.7.8  # the modular source code checker: pep8, pyflakes and co
- ipdb==0.12.2  # exports functions to access the IPython debugger, which features tab completion, syntax highlighting, better tracebacks, better introspection with the same interface as the pdb module.
- mypy==0.720  # Optional static typing for Python
- psycopg2==2.8.3 # psycopg2 - Python-PostgreSQL Database Adapter
- pylint-celery==0.3  # pylint-celery is a Pylint plugin to aid Pylint in recognising and understandingerrors caused when using the Celery library
- pylint-django==2.0.11  # A Pylint plugin to help Pylint understand the Django web framework
- pytest==5.1.3  # pytest: simple powerful testing with Python
- pytest-django==3.5.1  # A Django plugin for pytest.
- pytest-sugar==0.9.2  # pytest-sugar is a plugin for pytest that changes the default look and feel of pytest (e.g. progressbar, show tests that fail instantly).
- Sphinx==2.2.0  # Python documentation generator
- Werkzeug==0.15.5  # Werkzeug is a comprehensive WSGI web application library. It began as a simple collection of various utilities for WSGI applications and has become one of the most advanced WSGI utility libraries.

# Production Requirements

- Collectfast==1.0.0  # Efficiently decide what files to upload using cached checksums, parallel file uploads
- django-anymail[mailgun]==6.1.0  # Sync mailboxes using a distributed task queue
- django-storages[google]==1.7.1  # Support for many storage backends in Django
- gunicorn==19.9.0  # Gunicorn ‘Green Unicorn’ is a Python WSGI HTTP Server for UNIX. It’s a pre-fork worker model ported from Ruby’s Unicorn project. The Gunicorn server is broadly compatible with various web frameworks, simply implemented, light on server resource usage, and fairly speedy.
