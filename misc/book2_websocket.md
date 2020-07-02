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