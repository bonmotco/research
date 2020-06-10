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

## Useful Insights

### Chapter 1

Existing hacks that run over HTTP (like long polling) send requests at intervals, regardless of whether messages are available, without any knowledge of the state of the server or client. The WebSocket API, however, is different—the server and client have an open connection from which they can send messages back and forth. For the security minded, WebSocket also operates over Transport Layer Security (TLS) or Secure Sockets Layer (SSL) and is the preferred method,
In previous chapters you built simple applications using the WebSocket API both on the server side and on the client. You built a multiclient chat application with Web‐ Socket as the communication layer. 

### Chapter 2 

...briefly discussed using subprotocols with WebSocket. Now you’ll take everything learned thus far and layer another proto‐ col on top of WebSocket.

### Chapter 3

In this chapter you built out a complete chat client and server using the WebSocket protocol. You steadily built a simplistic chat application into something more robust with only the WebSocket API as your technology of choice. Effective and optimized experiences between internal applications, live chat, and layering other protocols over HTTP are all possibilities that are native to WebSocket.
All of this is possible with other technology, and as you’ve probably learned before, there’s more than one way to solve a problem. 
__Comet__ and __Ajax__ are both battle tested to deliver similar experiences to the end user as provided by WebSocket. Using them, however, is rife with inefficiency, latency, unnecessary requests, and unneeded connections to the server. Only WebSocket removes that overhead and gives you a socket that is full-duplex, bidirectional, and ready to rock ‘n’ roll.

### Chapter 4
Introduces STOMP, an acronym for Simple Text Oriented Messaging Protocol, is a simple HTTP-like protocol for interacting with any STOMP message broker. Any STOMP client can interact with the message broker and be interoperable among languages and platforms.

## Running the Websocket server
1. Navigate to folder cd/sebastian/websockets/ch3/.
2. npm install node, uuid.
3. node server.js (maybe change the port from 8181 to something else if you restart it).
4. Open Chrome; navigate to folder and run client.html.
