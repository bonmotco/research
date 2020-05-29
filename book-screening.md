# Useful books for Infrastructure

Overview over the books I read to get a more profound understanding of the technologies used. Week 3 of Bildungskarenz

## To Dos

- Check for REACT App Introductory Book
- Do the hello world example of book 2: Websockets
- Read on there.


# Book 1: Jorge Acetozi - Pro Java Clustering and Scalability

Full Title: 2017-Jorge Acetozi - Pro Java Clustering and Scalability_ Building Real-Time Apps with Spring, Cassandra, Redis, WebSocket and RabbitMQ-Apress (2017)

## Opinion & Ideas 
- High level crappily written book. 

## Useful Insights
### Redis
- Redis is an extremely fast in-memory NoSQL database in the key-value category, which means you can store a value and associate it with a unique key (for example, name: Jorge Acetozi or numEbookReaders: 1000). Of course, you can also do something much more interesting such as caching with it.
- 7.3.2 Redis Use Cases - Because of its rich data structures, Redis can be used for a wide variety of cases:
    • Caching (including LRU16 strategy)
    • Implementing counters for a number of page views
    • Implementing highly performant queues
    • Implementing publish/subscribe17
    • Compiling metrics and statistics
    • Storing Hypertext Transfer Protocol (HTTP) sessions
    • Building rankings using sorted sets (an ordered set of items by score), such as the most accessed chat rooms
    • Performing operations in sets, such as getting the intersection between two sets
- That’s basically why I chose to use Redis for the chat application.
Redis can be clustered19 both for replication and for sharding, and its distributed architecture is based on a master-slave model

### Polling vs. WebSocket

- Polling: How could UserB get this message transparently (I mean, without having to refresh the whole chat room page)? It’s easy—just make UserB send HTTP requests using Ajax every three seconds to the server to check whether there are messages for that user. If there are messages, then the server appends them to the HTTP response. This is a polling strategy. Not smart because it needs a hand-shake everytime.
- That is where WebSocket can help you. It allows you to open a full-duplex bidirectional TCP connection where both sides (the client and the server) can send frames. These frames are different than HTTP requests. Actually, after a WebSocket connection is opened, all traffic between the client and the server occurs through it, so no HTTP requests are sent anymore. Figure 9-1 shows what a frame looks like.
 
# Book 2: 2015-Andrew Lombardi WebSocket LIGHTWEIGHT CLIENT-SERVER COMMUNICATIONS

## Opinion
- Chapter 1
- Work on Chapter 2, 3

## Useful Insights
- Existing hacks that run over HTTP (like long polling) send requests at intervals, regardless of whether messages are available, without any knowledge of the state of the server or client. The WebSocket API, however, is different—the server and client have an open connection from which they can send messages back and forth. For the security minded, WebSocket also operates over Transport Layer Security (TLS) or Secure Sockets Layer (SSL) and is the preferred method,
- 
- 
- 