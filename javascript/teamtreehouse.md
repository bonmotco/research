JavaScript Fullstack Course by TeamTreeHouse

## JS Basics
- === > is a strict value operator and it checks whether two strings are strictly equal
    - Always use strictly either ‘===‘ or ‘!==‘
    - ‘===‘ also checks the type hence a ‘3’ and 3 are not the same (str and int)
- If you compare strings then numbers come always before letter strings (‘100’ < ‘Apple’ => True)
- Booleans are non-capitalised in JavaScript
- + is the unary plus operator and makes a number makes (parseInt)
- Operators are: 
    - && = and (both must hold true), 
    - || = or (one must hold true) > true and false are non-capitalised in JS
    - Combinations of multiple comparisons possible, e.g. ( score === 0 && ships <= 0 && time === 0)

## JS Numbers

- Figure out type of an object via: typeof <object>
    - parseFloat: takes even number of a string if string starts with it (4.99 EUR => 4.99) 
    - parseInt: NaN for e.g. strings, cuts floats off (e.g., 202.99 => 202)
    - unary + turns a string into a numeric value (e.g., +pi === 3.14 returns true)
- Functions start with function thisFunction() { do … }

- Global Scope vs. Function Scope: Scope is the context in which variables are visible
    - Global scope: Declared values outside any function can be accessed from inside functions (let can be overwritten, const won’t)
    - Function scope: If you define variables inside different functions but use ‘let’ or ‘const’ when defining them to avoid dependencies, they are only available within the function and the function call
    - 

- Function declarations: 
    - e.g. function goToCoffeeShop(drink, pastry) { … }
    - Work with keyword function 
    - You can only have one return value, e.g. return result;
    - You can fill the function with arguments, and define default values for them, 

- Function expressions: 
    - e.g., const getRandomNumber = function(upper) { … } ;
    - if you assign a function without a name (aka anonymous function) to a e.g. const object like getRandomNumber; make sure you append a ; at the end of the curly-braces
    - You can call a function declaration before it is declared in the file: named hoisting (i.e. The JavaScript engine moves function declarations to the top of their scope before code execution)
    - Function expressions only load when the script reaches on it (can’t get before initialisation)

- Arrow functions:
    - e.g. const getRandomNumber = (upper) => { … };
    - example: const square = (x) => { return x*x }; here the function is replaced with an arrow (=>)
    - Self anonymous, don’t have a name
    - Mostly behave like functions expression (not hoisted)
    - Parameters go into brackets and use it inside the function
    - Newer syntax, function declarations are hosted while arrow functions are not
    - Advantage of short arrow syntax aka call-back - later
    - Syntax with different parameters:
        - No parameter: just () -  getRandomNumber = () => { … };
        - One parameter: just <parameter> - getRandomNumber = upper => { … };
        - Multiple parameters: with brackets - getRandomNumber = (lower, upper) => { … };
    - One-liners: 
        - const square = x => {x * x};
        - Const greeting = () => alert(`Greetings, Marlone`);

- Docs annotations style: [description], @params, @returns and cheat sheet

- Error handling: 
    - instead of console.log, you can ‘throw Error(‘Please insert a number’);  

## JS Loops

- Loops types: while, do … while, for
- While:
    - Usually use a counter with it, that is being increased
    - Checks condition first, then the loop runs.
- Do … while: 
    - Difference to while loop: will always execute code block once, before the condition is checked.
    - Mostly the same except, when you need to do something at least once. 
- Hint: instead of counter +=1, you can write counter++; counter-- decrements the counter
- For:
    - For loop is more compact than while loops
    - for ( let counter = 0; counter < 10; counter++ ) { …. }
        - aka for ( let i = 0; i < 10; I++ ) { …. }
- Editing elements on a document / web page:
    - Select the  html-tag with the querySelector(‘main’):
    - Define a variable let html = ‘’;
    - Fill html += ‘something’
    - Append it the html to the document via: main.innerHTML = html; >>> do this last to do it only once

## JS Functions

Templates literal: 
- interpolation if you add math or functions
- Do not worry about spaces as in concatenation
- Support multiline strings without the need to escape \n with /backslash


## JS Arrays

- Problem of storing 100 shopping items
- Array example: const shoppingList = [ ‘Hat’, ‘Egg’, ‘Cap’, ’Cream’ ]; > break up over multiple lines to make it easier to read / edit
- Arrays in JavaScript are 0-based
- Elements can be accessed via array[0]; they return ‘undefined’ if element is not existent
- Array Adding elements:
    - shoppingList.length; > returns length of array
    - shoppingList.push(‘item1’, ‘item2’); > add one or more elements to the end of an array
    - shoppingList.unshift(‘item0’); > add elements to the beginning of an array
- Array Removing elements:
    - shoppingList.pop() - returns and removes the last element, it does not accept elements
    - shoppingList.shift() - removes the first element of an array, also doesn’t take an argument
- Array Combining arrays / spread:
    - Creating a copy and spreading it out to fill another array with ‘…’; 
    - Example:
        - const middle = [ ‘lettuce’, ‘cheese’,  ‘patty’]; 
        - const buns = [ ‘top bun’, ‘bottom bun’]; 
        - const burger = [ ‘top bun’, …middle,  ‘bottom bun’]; 
    - Combining to full arrays: const whole_burger = […middle, …buns];
    - even when elements in one source array change, the spread operator does not update it in the combined array (it is a copy)
    - You can do math operations with spread, e.g. 
        - const numbers = [1,2,3];
        - Math.max(numbers); >> returns undefined, whereas
        - Math.max(…numbers); >> spreads the array out and returns the highest value
- Looping over Arrays with ‘for’
    - Mind setting the length to arr.length & to access the items in the array via arr[i] 
- Join: takes an array and takes a string, and creates all arrays, e.g., via daysInWeek.join(‘ ’)
- Includes: daysInWeek.includes(‘Monday’) and returns true or false whether Monday is in the array daysInWeek
- IndexOf: arr.indexOf(‘Monday’) will return zero (since Monday is the first day/item of the week array)
- Multidimensional Arrays: if one or more arrays are in an array
    - Example: const array = [[1,2,3], [3,4,5], [6,7,8]] 
    - Access first nested array with array[0]
    - Access second element in third nested array with array[2][1] via concatenating the indices keep this flexible via array[I][j]

## JS Objects

- Example of an object:
    - Const person = { name: ‘Edward’ }; the object person, has a name property that got assigned Edward
- Accessing an object: 
    - const message = `My name is ${person.name}`;
- Set the value of an object’s property:
    - person.name = ‘Edvard’;
- Appending a property
    - person.age = 37;
    - person.skills = [‘Python’, ‘JavaScript’, ‘HTML’];
- Joining multiple elements
    - const message = `My name is ${person.name} and my skills are ${person.skills.join(‘, ’).}`;
- For () in loops:
    - You have to use bracket notation to access the property values!
    - example: for ( let key in object ) { //do something }
    - Access properties: for (let key in person) { console.log( key ) } would log all the properties: name, age, skills
    - Access the values of the properties: for (let propName in person) { console.log( propName[skills] ) } would return all the skills
- Object.keys() and .values()
    - The Object.keys() method returns an array containing the property names (or keys) of an object. >> Object.keys(person)
    - The Object.values() method returns an array of a given object's property values, in the same order as provided by a for...in loop >> Object.values(person)
    - You can use the spread operator to copy key/value pairs from one object to another. This merging happens e..g via const person = { …name, …role };
- 

## JS - the DOM


A simple example
- Selecting a part of a web page: const myHeading = document.getElementByID(‘myHeading’);
- Add an event listener: myHeading.addEventListener(‘click’, () => {myHeading.style.color = ‘red’} });
Select an element by ID
- document.getElementById(‘myHeading’)
- document.getElementById(‘myButton’)
- document.getElementById(‘myTextInput’)
- Get the value of a textfield with myTextInput.value;
- Select the <input> element with the ID linkName and store its value in the variable inputValue. WITH var inputValue = linkName.value;
Select all elements of a particular type
- const els = document.getElementsByTagName(‘p’)
- const myList = document.getElementsByTagName(‘li’) 
- myList[I].style.color = ‘purple’;
Selecting elements with the same name class
- Select by Same Class Name:
    - Accepts IDs, Queries, etc.
    - document.querySelector(‘li’): returns only first matching element on the page
    - document.querySelectorAll(‘li’): returns collection of all list items on the page
    - Select by ID with a starting #-symbol: document.querySelector(‘#myHeading’) 
    - Select by Class: document.querySelector(‘.error-not-purple’) >>> make sure you think of the dot!
    - Select by HTML attribute: document.querySelector(‘[id=myHeading]’)
Using CSS queries to select page elements
- Select all links within a navbar with descendants: let navigationLinks = document.querySelectorAll('nav a');
- Select all links belonging to list with ID gallery: let galleryLinks = document.querySelectorAll('#gallery a');
- 
- Identical selection via: 
    - const myElement = document.getElementById('myId');
    - const myElement = document.querySelector('#myId');

## JS Making Changes to the DOM
Getting and Setting Text with textContent and innerHTML

- textContent: 
    - Select a constant via the query selector, e.g. const p = document.querySelector(‘p.description’);
    - Add an event for the alteration, e.g. button.addEventListener(‘click’, () => {p.textContent = input.value’’}; this takes the input at the time of the click and changes the paragraph with named description
- innerHTML: 
    - Works the same, e.g. button.addEventListener(‘click’, () => {p.innerHTML = input.value’’}; this takes the input at the time of the click and changes the paragraph with named description
    - However, can do more: like changing the whole list

Changing Element Attributes
- You can just change web page elements by setting a new value
- input.type returns its name ‘text’
- To get the class (exception!): you need input.className (use the className property)
- Input.type = ‘checkbox’ >>> changes the input field to a checkbox
- p.title = ‘List description’; > changes the tooltip (the description) 
- Usually not changed to a line in JavaScript
- Element.class > the class-property won’t work > use className instead!

Styling Elements

- Style attributes can also be overwritten, e.g. <div style=‘background-colour: teal;’></div>
- Make app.js the same structure as HTML elements
- Query a list class with const listDiv = document.querySelector(‘.list’);
- To hide an element set its display property to none, e.g., listDiv.style.display = ‘none’;
- Add functionality with e.g., toggleList.addEventListener(‘click’, () => {if(listDiv.style.display == ‘none’) {listDiv.style.display = ‘block’, toggleList.textContent = ‘Hide list’ } else {listDiv.style.display = ‘none’, toggleList.textContent = ‘Show list’}});
- Do not fire both eventListenerHandlers together! Therefore, make buttons descriptions specific

Creating New DOM Elements

- Create a new constant button ‘new item’ 
- Then add an eventListener to that does the following: let li = document.createElement(‘li’) and then li.textContent = addItemInput.value;

Appending Nodes
- To get a new child you append it to the DOM with Node.appendChild(childElement)
- There is not really a difference between objects and nodes; nodes belong to the DOM tho
- <ul> would be a parent element; <li> the children
- So in order to append any new <li> you first need to identify the <ul> it should be added to
- e.g. addItemButton.addEventListener(‘click’, () => { let ul = document.getElementsByTagName(‘ul’[0]; let li = document.createElement(‘li’); li.textContent = addItemInput.value; }
- List item is not cleared - correct via the value attrribute: addItemInput.value = ‘’;
- Example:
    - var contentDiv = document.getElementById('content');
    - var newParagraph = document.createElement('p');
    - newParagraph.className = 'panel';
    - contentDiv.appendChild(newParagraph);

Removing Nodes
- Node.removeChild()
- Works like appending a node. You need to make sure that you select the parent and then remove the child from it.
- Define both objects for that:
    - Let's remove a list item from the unordered list. First, select the <ul> element and store it in the variable myList. 
    - Next, select the <li> with the ID first and store it in the variable firstListItem. 
    - Finally, remove the <li> element stored in firstListItem from the DOM.
- Example: 
    - var myList = document.querySelector('ul');
    - var firstListItem = document.getElementById('first');
    - myList.removeChild(firstListItem)

## Responding to User Interaction
What is an event?
Mouse
- Click
- Scroll
- dblclick
- Mousedown
- Mouseup
- Mousemove
- Mouseover
- Mouseout
Touch
Keyboard

Functions as Parameters
- Functions are first class citizens meaning they can be used everywhere. He integrates functions into arguments and sets and example with timeout, e.g.

Delaying Execution with setTimeout()
- Window.setTimeout((something) => { console.log(something);} , 3000, ‘Greetings everyone!’ } );

Listening for Events with addEventListener()
- Event handlers are being explained, and functions are in other functions
- First select all listItems at the top of the page with the querySelector via const listItems = document.getElementByTagName(‘li’)
- Then you add an event via: listItems.addEventListener(‘mouseover’, () => {str = str.Upper()}
- You’d create a second handler for ‘mouse out’!
- Loop through all list items by surrounding the code in a for-loop.
- An example:
    - var warning = document.getElementById("warning");
    - var button = document.getElementById('makeItRed');
    - button.addEventListener('click',  () => {
    -   warning.style.background = 'red'
    - });
- The new element doesn’t have the behaviour anymore! 

Event Bubbling and Delegation
- Every click etc. to an element gets send up to the parent, their parent etc.
- They rise up the DOM tree like bubbles :)
- Hence, set an eventListener always on the ancestor! Yet make sure it is in the direct line, but as close as possible. Div that contains the list is the best: listDiv
- Yet we need an event object to understand WHICH object is being handled

The Event Object
- With the event object handler you can get events that are happening printed out. 
- As an example you can print out every object by clicking on it with; all elements clicked will be logged to the console
    - document.addEventListener(‘click’, (event) => { console.log(event.target); }});
- Select the event.target.textContent and act on it with event.target.textContext.toUpperCase();
- To listen for the event, add event as an argument and make sure it is only running on the list item via: If (event.target.tagName == ‘LI’) {} >>> the element has to be allCaps

## 

Traversing the DOM

Using parentNode to Traverse Up the DOM
- To delete a child you need to figure out who the parent is
- It works by getting the parent via:
    - Let paragraph = document.getElementById(‘myParagraph’)
    - Let parent = paragraph.parentNode; //gets you the parent of the child
    - Parent.removeChild(paragraph);
- Example: 
    - listDiv.addEventListener(‘click’, (event) => { if (event.target.tagName == ‘LI’) {let li = event.target; let ul = li.parentNode; ul.removeChild(li); } }
- Always you have to have a constant and a handler in the JS file
- Second example: 
    - var removeMe = document.querySelector('.remove_me');
    - var parent = removeMe.parentNode;
    - parent.removeChild(removeMe)

Using previousElementSibling and insertBefore
- Do not use li.previousSibling to get the previous list element; it does return also elements that are not part of the DOM, since you have to call it twice >> use previousElementSibling instead.
- You use the following to move up an item. Last line makes sure that you are only moving up if it is not the first item already in a list 
    - let prevListItem = li.previousElementSibling;
    - let  ul = li.parentNode;
    - If (prevListItem) { ul.insertBefore(li, prevLi); }
- To move an element down a list use nextElementSibling.
- Another example:
    - var list = document.getElementsByTagName('ul')[0];
    - list.addEventListener('click', function(e) {
    -   if (e.target.tagName == 'BUTTON') {
    -     let p = e.target.previousSibling;
    -     p.className = 'highlight';
    -   }
    - });

Getting All Children of a Node with children
- The first constants are called the: element selections
- Do not have the buttons in the HTML at all, but write them only in JS
- Strategy: write a function attachListItemButtons(li) {
    - Let up = document.createElement(‘button’);
    - up.className = ‘up’;
    - up.textContent = ‘up’;
    - li.appendChild(up); // down, remove
- The initial list items do not come with buttons; therefore we have to append them to the existing list with attachLiustItemButtons()

Getting the First and Last Child
- Const firstListItem = listUl.firstElementChild;
- Const lastListItem = listUl.lastElementChild;
- Then attach color to them with: firstListItem .style.backgroundColor = ‘lightskyblue’;
