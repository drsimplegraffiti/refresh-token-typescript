##### Source: https://codevoweb.com/node-typescript-mongodb-jwt-authentication/

##### Setup
yarn init

yarn add -D typescript

npx tsc --init

```tsconfig.json
{
  "compilerOptions": {
    "target": "es2016",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "strictPropertyInitialization": false,
    "skipLibCheck": true
  }
}


```


#### Install dependencies
> yarn add @typegoose/typegoose bcryptjs config cookie-parser dotenv express jsonwebtoken lodash mongoose redis ts-node-dev zod cors

#### Install the devDependencies
> yarn add -D morgan typescript

##### type definitions
> yarn add -D @types/bcryptjs @types/config @types/cookie-parser @types/express @types/jsonwebtoken @types/lodash @types/morgan @types/node @types/cors

#### docker compose
> docker-compose up -d

---

Login to compass
> mongodb://edemziddah:password123@localhost:6000/jwtAuth?authSource=admin


##### Generating publick and private keys
How to Generate Private and Public keys for JWT Authentication

Generating the private and public keys yourself can be challenging so am going to use this website: http://travistidwell.com/jsencrypt/demo/ to easily generate them.

On the website, you can use either 4096 bits or 2046 bits as the key size but am going to use 4096 bits. After selecting the key size, click on the “Generate New Key” button to generate the keys.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ucv005k83bm42c5v09l3.png)



Now let’s visit this website:https://www.base64encode.org/ to encode both keys in base64. Copy each of the keys and paste it into the “Encode to Base64 format” Textarea then click on the “Encode” button. Ensure you encode the private key first before encoding the public key.
Ensure your change the destination to ASCII and choose CRLF(Windows) as the line separator. 

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9uztstsfzwcquqzsic9g.png)

After each encoding copy the encoded key and paste it into the .env file respectively.


---

#### connect to redis



![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lykgoix2fsrzassb5k7q.png)




![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6p6liy5ffmws0ggdhh1r.png)


#### register user
> localhost:8000/api/auth/register
```json
{
    "name":"ABayomi",
    "password":"12345678",
    "email":"ab@gmail.com",
    "passwordConfirm":"12345678"
}
```

#### login user
> localhost:8000/api/auth/login
```json
{
      "password":"12345678",
    "email":"ab@gmail.com",
}
```

Response
```json
{
    "status": "success",
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDRiN2QzMjdhMDlmZjZmZDY5NDQ4ZmUiLCJpYXQiOjE2ODI2NjkzNjMsImV4cCI6MTY4MjY3MDI2M30.wX9eAiH3eTtW_aGcHFDZJLrQmERv_L7_UcH9jde86wlbE4L-eep3xE6fMdTZczOt_l7I5RGU9bRdEv9Ax-DfRHBj56mZOD7gIuDtz8lE0glRgjyzJWbrAnx0UA4sxk-gf50RiraLduzlMAfl-4da8A0mbgLWbn2utPHcISxi9BEoGUklv5JsUoWVFDWN9EQeYsVPbeIIP3zMJh_MqqxwvvFvPW_tp3HWr5voHpN6pTGnJx850a1_yoUm8zjl3Dvvce1C6FxpY_xCqR6Y1CUvrIjfjmGc9JocGD_AoXxCmLG7gC2CXnI4-HNncmMSKxGHnnVRrFApq5_FB2NHdG-DvHt4QxgueULytdM_cRQN9sDxu3y6BY0Z9JZ6Dri9wKmKwRdxdtL5CYuXa3eompWaif5TSngOXBDDsYgVhqEBQX2eQxL20h7I0LDNsCbVa17dOfQuV-8iH8okqLU5apuzofD_o3iBvn3L7rt8NwFvB2oIHSXrPvpLiRrFw3OEmVnvogZgzCYdFvcTdG5AkXLfl3_efTZr9NR50GI5eoYlx6jHIBVOIfNxZs8z3Njl_o_IPt3wV4g04wJyQEkTRFBU_OU6082A80daZ8ZwhjaWva2erBcTrms7gKvpLqI8tif_L3e-jHUOYVFfNUzNcG2IPY92IOT6TsC_zHG0s_St1bQ"
}
```

#### get user
> localhost:8000/api/users/me

Response
```json
{
    "status": "success",
    "data": {
        "user": {
            "_id": "644b7d327a09ff6fd69448fe",
            "name": "ABayomi",
            "email": "io@gmail.com",
            "role": "user",
            "createdAt": "2023-04-28T08:00:50.239Z",
            "updatedAt": "2023-04-28T08:00:50.239Z",
            "__v": 0
        }
    }
}
```


---


##### Get all users
> localhost:8000/api/users
Bearer Token

Response
```json
{
    "status": "fail",
    "message": "You are not allowed to perform this action"
}
```