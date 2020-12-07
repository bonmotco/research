# JS Closures

With this global variable count, dogs and birds are being counted on the same variable. This is pretty bad!

<script>
var count = 0;
function countBirds() {
  count += 1;
  return count + ' birds';
}
function countDogs() {
  count += 1;
  return count + ' dogs';
}
</script>

Non-professional solution: create two variables, i.e. dogCount and BirdCount...but thats too noobie.

## Closures!

A Closure is a function with access to its own private variables. These variables are hidden from other functions.
The inner function has access to the outer functions scope. So it can acess the dogs number. 

<script>
var birds = 3;
function dogHouse() {
	var dogs = 8;
  function showDogs(){
    console.log(dogs);
  }
  return showDogs;
}
var getDogs = dogHouse();
getDogs(); // 8
</script>

# Meta Closure

<script>
function outerFunction() {
    var someCount = 0;
    function innerFunction() {
        someCount++
        console.log('Called ' + someCount + " times.");
    }
    return innerFunction;   
}
counter1 = outerFunction();
counter2 = outerFunction();
counter1(); // Called 1 times
counter2(); // Called 2 times
</script>

# Fixing Our Problems with Closures

<script>
function makeBirdCounter() {
  var count = 0;
  return function (){
    count += 1;
    return count + 'birds';
      }
}
function makeDogCounter() {
var count = 0;
  return function (){
    count += 1;
    return count + 'dogs';
      }
}
</script>

Every scope is second, even if you create a second dogCounter.

## Optimize even more

<script>
function makeCounter(noun) {
  var count = 0;
  return function (){
    count += 1;
    return count + ' ' + noun;
      }
}
</script>

# Real World Applications

- Distribute JS modules to prevent variable conflicts
- Middleware in Express