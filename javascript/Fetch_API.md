# Workshop The Fetch API

## What is the Fetch API?

Modern interface native to the browser > FetchAI; doesn't use JQuery.

AJAX: a combination of technologies that let you build pages that update without requiring a page load.

XMLHttpRequest (XHR): an API that provides functionality for transferring data betwen a browser and a server.

FetchAPI:

- Easy to use
- Completely __promise-based__
- Clean and simple
- Built into browser

## Write a Basic Fetch Request

To make a request use the global fetch method that takes one mandatory argument, the path to the resource.

Example (does not need an API): 

fetch('https://dog.ceo/api/breeds/image/random')
  .then(response => response.json())
  .then(data => console.log(data.message))

- fetch works with promises: represents an eventual result of a request; similar to callbacks
- fetch returns a promise

## Displaying the Content

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

fetch('https://dog.ceo/api/breeds/list')
  .then(response => response.json())
  .then(data => generateOptions(data.message))

fetch('https://dog.ceo/api/breeds/image/random')
  .then(response => response.json())
  .then(data => generateImage(data.message))

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function generateOptions(data) {
  const options = data.map(item => // map over array` 
    <option value='${item}'>${item}</option>
  `).join('');
  select.innerHTML = options;
}

function generateImage(data) {
  const html = `
    <img src='${data}' alt>
    <p>Click to view images of ${select.value}s</p>
  `;
  card.innerHTML = html;
}

## Create a Reusable Fetch Function

// Write a Wraper function that allows to deal with the 
// response, and makes the two response-lines in the previous 
// video obsolete.

function fetchData(url) {
  return fetch(url)
            .then(res => res.json())
}

fetchData('https://dog.ceo/api/breeds/list')
  .then(data => generateOptions(data.message))

fetchData('https://dog.ceo/api/breeds/image/random')
  .then(data => generateImage(data.message))

Create a breed in the helper function:
<script>
function fetchBreedImage() {
  const breed = select.value;
  const img = card.querySelector('img');
  const p = card.querySelector('p');  
fetchData(`https://dog.ceo/api/breed/${breed}/images/random`)
.then(data => {
  img.src = data.message;
  img.alt = breed;
  p.textContent = `Click to view more ${breed}s`;
})
}
</script>


## Handling Errors

- To account for an error just add a catch method to the end of the fetch data sequences
- Make sure you chain it to the fetchData() meta function
- You need to write a checkStatus function that can be used in the fetchData  function to display the error and not only log it to the console

## Managing Multiple Requests with Promise.all

- we fetch the breeds and the images...combine these! with the Promise.all() method: it joins two or more promises, then we determine what to do next
- move both fetchData promises into the array of Promise.all, then do a new .then() method, it more readable

## Posting Data with fetch()

<script>
function postData(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const comment = document.getElementById('comment').value;
const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, comment }) 
  }
fetch('https://jsonplaceholder.typicode.com/comments', config)
    .then(checkStatus)
    .then(res => res.json())
    .then(data => console.log(data))
}
</script>

- the default method is get, hence you need to change the parameter to 'POST'
- write it as a config and pass it as a second variable to fetch









