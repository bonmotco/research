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
