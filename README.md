# Apoco backend code challenge

## How to run

First clone the repo, then run

```
docker-compose up --build
```

This will build the app, start the database, run unit tests, seed the db and start the app. The app then runs on `localhost:3000` and you can find swagger on `localhost:3000/api-docs`.

### Tests

Should you feel like running the tests separately, you can use `docker-compose run test-unit` to run the unit tests and `docker-compose run test-e2e` to run the end-to-end tests. For the latter you need a working seeded database, which you have unless you stop it.

### Envs

For the sake of simplicity and the fact that it won't be used in any production code anywhere, I have hardcoded the DB and all the localhosts instead of properly providing relevant configurable envs. I felt like that is out of scope for the project.

## Tech Stack

git, Node.js, yarn, TypeScript, Docker, Jest, Swagger, MongoDB, Mongoose, NestJS.

## Authentication

For the sake of not overengineering it I am treating `username:password` as a token. The dabatase looks like I would assume it might look in a real use case - it has a username and a password. In such a use case, the password would be a hash, not plain text, it would be checked just once and a token would be issued that would then be used for authentication.

### Where is it applied

Intentionally this authentication happens only on some of the endpoints. I was thinking along the way that the basic pokemon catalogue (find by ID, find by exact name match and getting the types) might be public but advanced features would accessible only to authenticated users.

It could easily be argued that creating new users and pokemons endpoints shouldn't be accessible without authentication (or at all). Indeed, but since the authentication was supposed to be more of a draft than overengineered I felt like this falls into the same category.

## A note on Bruno

On my last project we were using [Bruno](http://usebruno.com/) for API testing and documentation. I kinda liked it and naturally used it also here during development. In the current state in the repo it is more of a dev tool then an attempt at documenting anything or running the entire collection as a complete test suite. I kept it there nevertheless; I just wanted to make this clear.