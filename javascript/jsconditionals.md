## Three data files: 

- simple truthy data set
- a multiconditional depending on the day
- an empty file called shortcurcuit.

>>> They can be improved!

##

<script>
switch (day) {
    case 0:
        // statement to execute
        console.log('Sunday');
        break; // never miss the break statement!!
    case 1:
        // statement to execute
        console.log('Monday');
        break;
    default:
        console.log('Invalid day.');
        break;
}
</script>

>>> For testing against a single value this saves typing compared to if statements, e.g.:

<script>
var day = 1;
if(day === 0) {
	console.log('Sunday');
} else if (day === 1) {
	console.log('Monday');
} else if (day === 2) {
	console.log('Tuesday');
} else if (day === 3) {
	console.log('Wednesday');
} else if (day === 4) {
	console.log('Thursday');
} else if (day === 5) {
	console.log('Friday');
} else if (day === 6) {
	console.log('Saturday');
} else {
	console.log('Invalid Day');
}
</script>

## The Tenary Operator 

Named this way because it involes three expressions.

Syntax:

<boolean> ? <expression if true> : <expression if false>
    
Classic:
<script>
var isTrue = true;
if(isTrue) {
	console.log('yes');
} else {
	console.log('no');
}
</script>

Simple way:
<script>
? :
// that is simply it:
isTrue ? console.log('yes') : console.log('no');   
</script>

Expression way:
<script>
var yesOrNo = isTrue ? 'yes' : 'no';   
console.log(yesOrNo);
</script>

## Short Curcuit Evaluation

<script>
function isAdult( age ) {
  return age && age >= 18;
}
//console.log(isAdult(33));
function countToFive(start = 1) {
  for(var i = start; i <= 5; i +=1) {
    console.log(i);
  }
}
//countToFive(0);
function greet(name) {
  name && console.log('Hi, ' + name + '!');
}
greet("Sam");
</script>
