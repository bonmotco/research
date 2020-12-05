# Intro to npm basics

## Install a package

npm install <package> (in the example bcrypt is installed)
=> This is only available in the workspace / folder of the project.
=> to use it globally install it with 
npm install <package> -g
    
    
## Create a package.json file

package.json files contain all the dependencies of a project. You can create it with:
'npm init' and then walkthrough all the questions in the process of creation.

## npm install colors --save

That will be added to the package.json file.

## Installing all dependencies

just via 'npm install'

## Installing testing package mocha in the dev environment

via 'npm install mocha --save-dev'

by default npm thinks you are installing in dev not in production environment. Hence, npm install will also install dev dependencies like 'mocha'.
To avoid this/or make it the production folder: 'NODE_ENV=production npm install'

# Keeping the project dependencies up to date

"brcypt": "^1.2.3" is called semantic versioning, semVer

1.x.x: is a major version: new code won't be compatible with old code
x.2.x: is a minor version: introducing new features that hopefully do not break old running code
x.x.3: is a patch version: this includes only bugfixes that shall not have an influence on the functionality
^ means that minor releases are automatically installed
~ means that patch releases are automatically installed

Update packages via 'npm update'

## Uninstall:

npm uninstall colors 
npm uninstall colors --save (will remove it permanently,and also from the package.json file)

global ones are uninstalled like this: 

npm uninstall http-server -g