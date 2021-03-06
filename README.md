# edk-route-verifier
[![CircleCI](https://circleci.com/gh/cloudify-cosmo/cloudify-stage.svg?style=svg)](https://circleci.com/gh/qooban/edk-route-verifier)


### Setup
#### Prerequisities
* [Git](https://git-scm.com)
* [NodeJS](https://nodejs.org) >= v8.x
* [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) (necessary only for testing, you need to enable access to the following APIs: Google Maps Elevation API, Google Maps Embed API, Google Maps JavaScript API)
* [Google Chrome](https://www.google.com/chrome/) (necessary only for testing)

#### Dependencies
1. Install the following packages globally:
```
npm install -g browserify
npm install -g uglify-js
```
2. Fetch dependencies for application:
```
npm install
```
3. Fetch dependencies for test server:
```
cd server && npm install
```

### Bundle
To create output Javascript bundle file - `routeVerifier.js` you need to issue:
```
npm run bundle
```
That command takes all code from `src` directory and with use of [browserify](http://browserify.org/) and [uglify-js](http://lisperator.net/uglifyjs/) libraries creates `routeVerifier.js` and `routeVerifier.js.min` in `server/static/js` directory.

### Test 

Tests are developed using [NightwatchJS](http://nightwatchjs.org/) framework. All test-related code is stored in `test` subdirectory.

Test server is [ExpressJS](https://expressjs.com/) web server serving pages with KML routes visualization and automatic route  verification sections.

#### Server
The following steps shall be done to run test server:
1. Create configuration file `config.json` in [server](server) directory (see [server/config.json.template](server/config.json.template) for details)
2. Start test server: 
```
npm start
```
3. Open in browser: `http://localhost:7777/<route_id>`, where `<route_id>` is name of KML file without extension. 

**NOTE**: For the page to be displayed correctly `<route_id>.kml` must be present in resources path (defined in configuration file).
 
#### Execution
1. Start server: 
```
npm start
```
2. Run tests: 
```
npm test
```
or if you want to run specific test / test-case:
```
npm test -- --test './test/tests/<test-filename.js>' --test-case '<test-case-name>'
```

#### Development

This section describes how to develop new tests.

1. Add resources
    * Put `<route_id>.kml` (input KML file) in resources directory
    * Put `<route_id>_route_params.json` (route parameters response JSON) in resources directory

2. Create new test in [test/tests](test/tests) directory
    * For the **automated verification** testing - add new test-case in `verification.js` test file. All the available assertion commands are defined in  [page.js](test/pages/page.js) file
    * For the **error handling** - add new test-case in `errors.js` test file 

3. Run new test locally (see [Execution](#execution) section) or using CircleCI (see [Continuous Integration](#continuous-integration) section)

### Continuous Integration
[CircleCI](https://circleci.com/gh/qooban/edk-route-verifier) web application is used as for CI management. See [.circleci/config.yml](.circleci/config.yml) file for details of the build and test job configuration.

You can create your own branch, push it remote and CI will start automatically. That way you can test your code even if you don't have local environment configured (NodeJS, Google Chrome, Google Maps API Key, etc.).