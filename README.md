# Node OIDC provider + client w/ Docker

This is a Node.js repository to setup an example OIDC provider and client via docker-compose.

Both OIDC client and provider were created using the blog posts by [Nitesh Singh](https://medium.com/@nitesh_17214):
 - OIDC provider blog post: ["OAuth 2.0 Authorization Server using Nodejs and ExpressJS (Part-1)"](https://medium.com/@nitesh_17214/oauth-2-0-authorization-server-using-nodejs-and-expressjs-cf65860fed1e)
 - OIDC client blog post: ["How to create OIDC Client in Nodejs"](https://medium.com/@nitesh_17214/how-to-create-oidc-client-in-nodejs-b8ea779e0c64)

# Quickstart

To spin up both client and provider, simply issue
```
docker-compose build
docker-compose up
```

Provider is listening on http://localhost:8080
Client is listening on http://localhost:8081

Navigate to http://localhost:8081 to test it out! (Instructions are provided in the blog post above)
