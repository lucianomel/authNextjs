# authNextjs

  

## To test:

open one terminal, `npm run dev`

open other terminal, `npm test`

  

## To deploy:

In construction. Should move middleware to root for now, tests not available for that directory setup.

  

### .env

> JWT_SECRET_KEY="somesupersecretkey or whatever"
> 
> API_PASSWORD="choose a password, hash it with salt 16. here the hash"
> 
> NODE_ENV="production"

  

### .env.local

> MY_CLIENT_PASSWORD=the password you chose
> 
> NODE_ENV=development
> 
> PORT="3000"
