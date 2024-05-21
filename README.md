# Summary

In this repo you will find 2 folders:

* `./server`:  A Node.js express server
* `./star-wars`: A React application

You will need to run both of these for the application to run properly.

## Quick start

### Docker Container

To run the whole project as containers locally, navigate to the root folder, and run:
```shell
docker-compose up -d
```
The first time it may take a while because Docker must build the images.

### Development server

To run in development mode, you must start each application separatly.

### Server
To run a development server, first navigate to the `./server` application, and run the following:
```shell
npm run init
```
This will install dependencies and create your first build. Now you can run:
```shell
npm run dev
```
To start the development server with nodemon file watcher. Or serve your production build for testing:
```shell
npm run serve
```

### App
To run the app, go to the app folder at `./star-wars`, an run:
```shell
npm run init
```
This will install dependencies and create your first build. Now you can run:
```shell
npm start
```
To start the development server with nodemon file watcher. Or serve your production build for testing:
```shell
npm run serve
```

## Tests

Unit tests were used in the api to validate server responses.
In the seed folder, you will find 2 data sets, one specific for testing.
First run the jest tests in the api:
```shell
cd api && npm run test
```
this will update the database with seed data for testing.

Some e2e tests have been imeplemented using **Cypress** in the app layer, to run the existsing tests, start by opening the **Cypress** dashboard:
```shell
npm run cy:open
```
Make sure to run the api jest tests at least once to have the test seed data, otherwise Cypress tests will fail.
With the dashboard open, select **e2e** tests, and you will see a list with the available tests to run.

OR you may run it headless in the console:
```shell
npm run cy:run
```
