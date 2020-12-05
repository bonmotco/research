# Using NPM as a Task Runner

NPM can be used as a task runner, meaning it can run scripts that you define. 

For this you have to adapt the package.json file, at scripts!

E.g. you can create a "copy": "cp src/*.html build/ & cp src/*.css build/" script (the one ampersand does both copies in parallel)

Also, you can "build": "npm run copy-files && npm run uglify"; // this runs two scripts to build an app. The double ampersand makes them build sequentially. 