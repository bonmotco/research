# Async Programming

## What is Asynchronous Programming?

Intro

Understanding Sync and Async Code

Examples 

## Async JavaScript with Callbacks

Introducing the Project

Async Programming and Callback Functions

Implement a Callback

Stepping Through Async Code

Managing Nested Callbacks

Callback Functions Review

## Understanding Promises

What is a Promise?

A Promise represents the eventual completion of an asynchronous operation. Promises provide a straightforward alternative for composing and managing asynchronous code, without having to write too many callbacks, or spend extra time figuring out what the program should do.

A promise is pending while you are waiting. Promise guarantees a future value (positive, negative) no matter what.

Create a Promise

States: Pending, Fulfilled, Rejected
Creation: 
- Create a promise instance using the Promise() constructor
- Define what should happen when the promise is fulfilled or rejected
- Consume the value of a fulfilled promise, or provide a rejection reason for a rejected promise

<script>
    const order = false;

    const breakfastPromise = new Promise( (resolve, reject) => {
        setTimeout(() => {
            if (order) {
                resolve('Your order is ready. Come and get it!'); //just changes status to resolved
            } else {
                reject( Error('Oh no! Prob with order!') );
            }
        }, 3000); 
    });

    console.log(breakfastPromise);
    // Promise needs to be collected with THEN or CATCH

    breakfastPromise
        .then( val => console.log(val) )
        .catch( err => console.log(err ))

</script>

- Promises let you handle errors with a method called: catch()
- 

Handle Mutliple Promises with Promise.all

- allows to wait for all individual promise objects 
- it's an all or nothing operation

Perform Cleanup with finally()

- gets always executed, use at the very end
- put the 'hide button at the finally e.g.

Using Fetch

- fetch() uses only one argument: 'api.com' >>> 
- 

<script>

const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

function getProfiles(json) {
  const profiles = json.people.map( person => {
    const craft = person.craft;
    return fetch(wikiUrl + person.name)
            .then( response => response.json() )
            .then( profile => {
              return { ...profile, craft };
            })
            .catch( err => console.log('Error Fetching Wiki: ', err) )     
  }); 
  return Promise.all(profiles);
}

function generateHTML(data) {
  data.map( person => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    section.innerHTML = `
      <img src=${person.thumbnail.source}>
      <span>${person.craft}</span>
      <h2>${person.title}</h2>
      <p>${person.description}</p>
      <p>${person.extract}</p>
    `;
  });
}

btn.addEventListener('click', (event) => {
  event.target.textContent = "Loading...";

  fetch(astrosUrl)
    .then( response => response.json() )
    .then(getProfiles)
    .then(generateHTML)
    .catch( err => {
      peopleList.innerHTML = '<h3>Something went wrong!</h3>';
      console.log(err);
    })
    .finally( () => event.target.remove() )
});

</script>

## Exploring Async/Await

What is Async/Await?

- from callbacks to promises to fetch
- in ES2017 they introduced: async / await
- async / await is the same as promises

async: defines an asynchronous function defined like:
    __async__ function fetchData(url){
        const response = await fetch(url);
        const data = await response.json();
        
        return data
    }
    
await: 
- pauses the execution of an async function and waits for the resolution of a promise
- resumes execution and returns the resolved value
- pausing execution is not going to cause blocking behaviour
- valid only inside functions marked async

there is no .then method

async always returns a promise: that promise resolves with the value returned by the async function, or rejects with an error thrown from within the function

### Convert Promise Handling to __Async__/Await



### Combine Async / Await with Promises

### Error Handing with try...catch