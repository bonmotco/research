# RestAPI

- RESTAPI means that the API gives you back data as a JSON object. 
- Previous APIs gave back HTML to render but with REST we only want the data, and choose ourselve to display them (e.g. with JS React)

# CRUD (Create, Read, Update, Delete)

Create - POST
Read - GET
Update - PUT
Delete - DELETE

# A Simple API

This is all you need.

<script>
const express = require('express');
const app = express();
app.get('/greetings', (req, res)=>{
    res.json({greeting: 'Hello World!'});
});
app.listen(3000, () => console.log('Quote API listening on port 3000!'));
</script>

# Planning out the API

These are the tasks we are doing:

// Send a GET request to /quotes to READ a list of quotes
// Send a GET request to /quotes/:id to READ(view) a quote
// Send a POST request to /quotes to  CREATE a new quote 
// Send a PUT request to /quotes/:id to UPDATE (edit) a quote
// Send a DELETE request to /quotes/:id DELETE a quote 
// Send a GET request to /quotes/quote/random to READ (view) a random quote

Above mutliple endpoints are the same, this is because you want to reach similar endpoints at the same time.

# GET a Quote, GET all Quotes

Pretty easy, just return the whole data, or match the ID and return that quote.

<script>
// Setting up express
const express = require('express');
const app = express();

// Send a GET request to /quotes to READ a list of quotes
app.get('/quotes', (req, res)=>{
    res.json(data);
});

// Send a GET request to /quotes/:id to READ(view) a quote
app.get('/quotes/:id', (req, res)=>{ // colon tells that it is a URL parameter
// print with console.log(req.params.id) >>> you have access to the id sent by the client
    const quote = data.quotes.find(quote => quote.id == req.params.id); // find quotes in db
    res.json(quote);
});
</script>

# 