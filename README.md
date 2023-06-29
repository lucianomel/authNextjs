# authNextjs

A next.js server that authenticates all routes using the next.js built in middleware. It's a simple single user authentication.

## To test:

Go to root folder, then:

1. open one terminal, run
```batch
npm run dev
```
2. open another terminal, run
```batch
npm test
```

## To run the server

```batch
npm run dev
```

## ENVIROMENT VARIABLES:

Replace with the following (don't copy paste, read)

### .env

```batch
JWT_SECRET_KEY="somesupersecretkey or whatever"
API_PASSWORD="choose a password, hash it with salt 16. here the hash"
NODE_ENV="production"
```
  

### .env.local

```batch
MY_CLIENT_PASSWORD="the password you chose"
NODE_ENV="development"
PORT="3000"
```
