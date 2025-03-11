# Apoco backend code challenge

## How to run

First clone the repo, then run

```
docker-compose up --build
```

This will build the app, start the database, run unit tests, seed the db and start the app. The app then runs on `localhost:3000` and you can find swagger on `localhost:3000/api-docs`.

### Tests

Should you feel like running the tests separately, you can use `docker-compose run test-unit` to run the unit tests and `docker-compose run test-e2e` to run the end-to-end tests. For the latter you need a working seeded database, which you have unless you stop it.

## Tech Stack

git, Node.js, yarn, TypeScript, Docker, Jest, Swagger, MongoDB, Mongoose, NestJS.

## Authentication

For the sake of not overengineering it I am treating `username:password` as a token. The dabatase looks like I would assume it might look in a real use case - it has a username and a password. In such a use case, the password would be a hash, not plain text, it would be checked just once and a token would be issued that would then be used for authentication. 

## A note on Bruno

On my last project we were using [Bruno](http://usebruno.com/) for API testing and documentation. I kinda liked it and naturally used it also here during development. In the current state in the repo it is more of a dev tool then an attempt at documenting anything or running the entire collection as a complete test suite. I kept it there nevertheless; I just wanted to make this clear.