# Overview of base requirements for Writeup.ai

# General Tools

__Redis__ is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker. It supports data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes with radius queries and streams. 



## Asnyc tools
- aiocontextvars==0.2.2
- aiohttp==3.5.4
- aioredis==1.2.0

## Overview
So far I cannot classify these imports because I do not know them

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

hiredis==1.0.0          # Python extension that wraps protocol parsing code in hiredis. It primarily speeds up parsing of multi bulk replies.
hyperlink==19.0.0
idna-ssl==1.1.0
immutables==0.9
incremental==17.5.0
msgpack==0.6.1
multidict==4.5.2
profilehooks==1.11.0
PyHamcrest==1.9.0
python-coveralls==2.9.3
python-slugify==3.0.3  # https://github.com/un33k/python-slugify
pytz==2019.2  # https://github.com/stub42/pytz
PyYAML==5.1.2
redis==3.3.8  # https://github.com/antirez/redis

sentry-asgi==0.2.0
sentry-sdk==0.12.2  # https://github.com/getsentry/sentry-python
twisted==19.7.0
txaio==18.8.1
typing-extensions==3.7.4
websocket-client==0.56.0 # need this for now to profile and find speedups
websockets==8.0.2
whitenoise==4.1.3  # https://github.com/evansd/whitenoise
XlsxWriter==1.2.0
yarl==1.3.0
zope.interface==4.6.0

## Django Classes

django==2.2.5  # https://www.djangoproject.com/
django-allauth==0.39.1  # https://github.com/pennersr/django-allauth
django-cors-headers==3.1.0
django-crispy-forms==1.7.2  # https://github.com/django-crispy-forms/django-crispy-forms
django-environ==0.4.5  # https://github.com/joke2k/django-environ
django-fsm==2.6.1
django-model-utils==3.2.0  # https://github.com/jazzband/django-model-utils
django-redis==4.10.0  # https://github.com/niwinz/django-redis
django-rest-auth==0.9.5
djangorestframework==3.10.3  # https://github.com/encode/django-rest-framework

## Data Science
numpy==1.17.2
pandas==0.25.1
Pillow==6.1.0  # https://github.com/python-pillow/Pillow
