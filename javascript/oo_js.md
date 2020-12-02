# Object-Oriented JavaScript

## Introduction to Object-Oriented JavaScript

- JS objects have properties and methods
- e.g. Radio: 
    - Properties: station, volume
    - Methods: turn off, change station
- the DOM is an object - DOM elements are objects
    - example method: getElementById()
- Arrays: length  is a property, methods: push, concat, pop

## Object Basics

### Object Literals and Components of Objects

- Properties: are object specific variables that store information in a series of key value pairs. 
- Methods are objects functions that let your object do something or let something be done.
- Object literals are a way to create objects:

- Example dog with three properties and one method:
<script>
  const jean = {
      animal: 'dog',
      age: 1,
      breed: 'french pug',
      bark: function(){
        console.log('Woof!');
      }
  }    
</script>

- encapsulation: putting all properties and methods into one object
- object are defined with colons (:) not equals (=)

### Dot and Bracket Notation

<script>
const ernie = {
    animal: 'dog',
    age: '1',
    breed: 'pug',
    bark: function(){
        console.log('Woof!');
    }
}
// Dot notation
// Accessing properties
console.log(ernie.age);
console.log(ernie.breed);
// Calling a Method
ernie.bark();
// Bracket notation
console.log(ernie['age']);
console.log(ernie['breed']);
ernie['bark']();
// relate value to a variable and then you don't need quotes
var prop = 'breed';
ernie[prop];
</script>

Object Literals Referring to Themselves
Many times, when writing methods for objects, you might want to refer to one of that object's properties. For example, consider the following code:

<script>
const teacher = {
   firstName : "Ashley",
   lastName : "Boucher"
}
</script>

I may want to add a method to this object literal called printName() that will log both the first and last name properties of the teacher variable to the console. To access the value of these properties inside the method, I'll use the this keyword instead of the variable name. This way, you'll always be access the property values attached to that particular object:

<script>
const teacher = {
   firstName : "Ashley",
   lastName : "Boucher",
   printName: function(){
      console.log(this.firstName + this.lastName);
   }
}
</script>

### Changing and Adding Properties

<script>
const ernie = {
    animal: 'dog',
    age: '1',
    breed: 'pug',
    bark: function(){
        console.log('Woof!');
    }
}
// Change Property
ernie.age = 2;
ernie['age'] = 2;
// Add Property
// Is the same for dot and brackets notation
ernie.color = 'black';
</script>

Encapsulation: escribes consolidating an object’s properties and methods into a package and attaching it to a variable.

## Working with Classes in JavaScript

- Imagine you have multiple pets, and they all have overlapping properties, like the method bark, they are not interconnected either
- Class Syntax (development from former Prototype Syntax)
- all properties 'animal' is 'dog' and function is bark > make a class from that name: call the class dog or even a pet class

Example: 
<script>
// First letter capitalized since it is a class
class Pet {
  // special method outlining the properties of the class
  constructor(animal, age, breed, sound) {
    // this has different meanings depending on where it is used
    this.animal = animal;
    this.age = age;
    this.breed = breed;
    this.sound =  sound;
  }
  // don't use function keyword
  speak() {
    console.log(this.sound);
  }
}
// Addded the speak method
const ernie = new Pet('dog', 1, 'pug', 'yip yip');
const vera = new Pet('dog', 8, 'border collie', 'woof woof');
ernie.speak();
vera.speak();
</script>
 
## Getters and Setters

Idea is to increase flexibility. Include logic when accessing objects. 

<script>
class Pet {
  constructor(animal, age, breed, sound) {
    this.animal = animal;
    this.age = age;
    this.breed = breed;
    this.sound = sound;
  }
  // dynamic value can be accessed the same way as the constructor is being accessed
  get activity() {
    const today = new Date();
    const hour = today.getHours();
    if (hour > 8 && hour <= 20) {
      return 'playing';
    } else {
      return 'sleeping';
    }
  }
  speak() {
    console.log(this.sound);
  }
} 
</script>

### Get Method

Get function is never actually attached to the object but can be called with it. Hence, if I console.log ernie the activity will not be printed out. Only if I access it

<script>
const ernie = new Pet('dog', 1, 'pug', 'yip yip');
const vera = new Pet('dog', 8, 'border collie', 'woof woof');
console.log(ernie.activity); // playing
console.log(ernie); // Pet { animal: 'dog', age: 1, breed: 'pug', sound: 'yip yip' }
</script>

### Set Method

A setter method, on the other hand, receives a value and can perform logic on that value if need be. Then it either updates an existing property with that value or stores the value to a new property.
Example:
<script>
set owner(owner) {
    // name of property can never be the same as getter or setter method
    // bcaking property, convention: use the name of the setter function with underscore before it
    this._owner = owner;
    console.log(`setter called: ${owner}`);
  }
</script>

Well, we can see that out setter function was called, but the value of the owner property is being output as undefined. 
Why is that happening?
If you recall, the setter method is storing the value in a backing property. 
In our case, that's actually _owner, not owner.
When we try to retrieve the value of owner by using ernie.owner, for example, we get undefined, meaning the owner property has no assigned value.
To solve this, we've got to create a getter method called owner that returns the value of the backing property. I'll add that right before I set our method.
Awesome, now we have a way to access the owner property.
Let's try to run this again. Great, you'll see that now it's outputting the value Ashley just like expect it to.

### Object Interaction

Put a class Owner {} within the class Pet {} to give details about the owner (address, name)
