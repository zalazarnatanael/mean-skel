# MEAN skel

Base skeleton to write apps with the MEAN stack. Developed by the [LateralView](https://lateralview.co) team.

[![Build Status](https://travis-ci.org/LateralView/mean-skel.svg?branch=master)](https://travis-ci.org/LateralView/mean-skel) [![Code Climate](https://codeclimate.com/github/LateralView/mean-skel/badges/gpa.svg)](https://codeclimate.com/github/LateralView/mean-skel)

The app allows user sign-up, account activation, login, logout and profile edition. The activation process uses mail confirmation with the Mandrill library. If you don't set the Mandrill API key, you'll see the activation link in the console.

```sh
...
GET /favicon.ico 304 2.113 ms - -
ACTIVATION LINK: http://localhost:8080/activate/E1JpEbZw
POST /api/users/ 200 388.902 ms - 27
...
```

### Installation

```sh
$ git clone git@github.com:LateralView/mean-skel.git
$ cd mean-skel
$ npm install
$ grunt @ENV
```

**@ENV** is the environment where you want to run the app (local | development | staging | production). It allows to create a config file for the frontend depending on the environment. Set the **gruntfile.js** file accordingly

### Configuration

Before running the app, set the database host, base URL, Mandrill API key and S3 keys in the **env.json** file.
If S3 keys and/or bucket name are not set no errors will be thrown, but the files will not upload at all (for example in profile picture upload).
Also, don't forget to run the mongoDB server.

### Run the App

```sh
$ node server.js
```

### Tests

Tests (backend side only) are written with [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/)

```sh
$ npm test
```

# Directory Structure

```
mean-skel
│   .gitignore
│   config.js
│   env.json
│   gruntfile.js
│   package.json
│   README.md
│   server.js
│
└───app
    │   ...
    │
└───node-modules
    │   ...
    │
└───public
    │   ...
    │
└───test
    │   ...
└───apidoc
    │   ...
```

* **App Folder** -> Backend logic.
* **Public Folder** -> Frontend: Angular app.
* **Test Folder** -> Unit Tests.
* **Apidoc Folder** -> Documentation from API descriptions in the source code. Created when running **grunt @ENV**
* **env.json** -> Backend configuration depending on the environment.
* **gruntfile.js** -> Grunt configuration. Run tasks and create config files depending on the environment.
* **server.js** -> Express server.

### Backend

```
app
└───handlers
    │   usersHandler.js
    │   ...
    │
└───helpers
    │   mailer.js
    │   ...
    │
└───middleware
    │   auth.js
    │   ...
    │
└───models
    │   user.js
    │   ...
└───routes
    │   routes.js
```

* **Handlers Folder** -> Request handlers executed in each route in **routes.js**. New handlers must be registered in **server.js** file:

```javascript
...
// Request Handlers
var handlers = {
    users: require('./app/handlers/usersHandler'),
    // Add new one here
};
...
```

* **Helpers Folder** -> Shared functions within the backend
* **Middleware Folder** -> Express middleware. Add new middleware to the Express App in **server.js** or **routes.js**. The **auth.js** file cotains a middleware to authenticate routes with the authentication token. If authentication succeeds, it saves the current user in the request object
* **Models Folder** -> Mongoose models
* **Routes Folder** -> Express routes

### Frontend

```
public
└───app
    │   app.config.js
    │   app.js
    │   app.routes.js
    │
    ├───controllers
    │   │   mainCtrl.js
    │   │   userCtrl.js
    │   │   ...
    │
    └───directives
    │   │   navbar.js
    │   │   ...
    │
    └───services
    │   │   authService.js
    │   │   flashService.js
    │   │   userService.js
    │   │   ...
    │
    └───views
    │   │   index.html
    │
    │   ├───pages
    │   │   │   home.html
    │   │   │   login.html
    │   │   │   ...
    │   │
    │   ├───shared
    │   │   │   formMessages.html
    │   │   │   navbar.html
    │   │   │   ...
    │   │
    │   ├───users
    │   │   │   activate.html
    │   │   │   edit.html
    │   │   │   new.html
    │   │   │   ...
    │   │
└───assets
    │───css
    │   │   style.css
    │   │   ...
    │
    ├───img
    │
    ├───js
    │   │   ui-bootstrap-custom-tpls-0.13.0.min.js
    │   │   ...

```

The Angular app structure is inspired in the rails RESTful organization. The controllers, services, directives and settings modules are initialized and injected in the **app.js** file.

* The **Auth interceptor** adds the authentication token to each http request and handles the non-authenticated requests.

    *app.js*
    ```javascript
    ...
    angular.module("skelApp", ["ngMessages", "ui.bootstrap", "app.routes", "controllers", "services", "directives", "settings"])
      .config([ '$httpProvider', function($httpProvider) {
        // add token to http requests
        $httpProvider.interceptors.push('AuthInterceptor');
      }]);
    ...
    ```
* The **Flash service** provides two functions: *setMessage* and *setErrors*. **setMessage** shows confirmation alerts after a route change, and **setErrors** shows error alerts in the current scope. It uses the **Alert** directive from [UI Bootstrap](https://angular-ui.github.io/bootstrap/)

    *userCtrl.js*
    ```javascript
    ...
    User.create(vm.userData)
        .success(function(data) {
          vm.processing = false;
          if (!data.errors) {
            flash.setMessage("Please check your email and follow the activation instructions.");
            $location.path("/login");
          } else
            flash.setErrors(data);
        });
    ...
    ```
* In the **app.config.js** file you can set the Angular app settings. i.e.: the main path.

    *app.config.js*
    ```javascript
    ...
    angular.module("settings")
      .constant("config", {
        main_path: "/home"
      });

    ...
    ```


Happy coding!
