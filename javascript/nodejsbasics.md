## Node.js Basics

- Node can make js code run outside the browser. It is like 'python3 method.py' but 'node app.js'.
- Imports are handled via 'require'; documentation can be found at nodejs.org.
- Process is: set the request, collect the response, parse it toString.
- APIs are easily accessed via https.get().

<script>
    // filename : nodesjsbasics.js
    // require https module
    const https = require('https');
    // const username = 'chalkers'
    function printMessage(username, badgeCount, points) {
        const message = `${username} has ${badgeCount} total bagde(s) and ${points} points in JavaScript`;
        console.log(message);
    }
    function getProfile(username) {
        // Connect to URL look at Node JS documents HTTPs
        const request = https.get(`https://teamtreehouse.com/${username}.json`, response => {
            let  body = '';
            // console.dir(response.statusCode);
            response.on('data', data => {
                body += data.toString();
            });
            response.on('end', () => {
                // console.log(body);
                // console.log(typeof(body))
                // Parse the data
                const profile = JSON.parse(body);
                // console.dir(profile);
                printMessage(username, profile.badges.length, profile.points.JavaScript);
            })
        });
    }
    // process object
    // console.dir(process.argv);
    const users = process.argv.slice(2);
    // const users = ['chalkers', 'alenaholligan', 'davemcfarland'];
    users.forEach(getProfile);
</script>

### Error Handling

You can use 'try ... catch' in the case of errors, as: 
<script>
try {
  const jsonString = 'This is not a JSON String';
  const jsonObject = JSON.parse(jsonString);
} catch (error) {  
  console.error(error.message);
}
</script>

- errors can also fall on the status code (200)
- API moved: 301
- Removed/not found: 404

<script>
       const request = https.get(`https://teamtreehouse.com/${username}.json`, response => {
            if (response.statusCode == 200) {
                    // do the parsing
            } else {
                const message = `There was an error getting the profile for ${username} (${response.statusCode})`;
                const statusCodeError = new Error(message);
                printError(statusCodeError);
            };
        });
</script>

The code above prints out a nice error message in case that there is a statusCode different than 200.

Next you can take the whole code except the arguments and move them into a separate file named profile.js. This can be imported via adding:

const profile = require('./profile.js');

__But this is going to throw an error because you have to explicitly export the function you want at the end of the file. This is pretty dumb.__

module.exports.profile = getProfile; >> this would be required as profile
module.exports.get = getProfile; >> this would be required (imported) as get

Annotations: the path to the js needs to include './'.

