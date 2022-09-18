# Authentication-System
A complete Authentication system for your next NodeJS project. 

## Features
1. Register
2. Login 
3. Email verification 
4. Forgot password
5. Reset password
6. Change password
7. User profile
8. Logout

## Packages Used
- [Node.js](https://nodejs.org/es/)
- [Express](https://expressjs.com/)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [JWT](https://www.npmjs.com/package/jsonwebtoken)
- [Multer](https://www.npmjs.com/package/multer)
- [Nodemailer](https://www.npmjs.com/package/nodemailer)
- [Validator](https://www.npmjs.com/package/validator)
- [Dotenv](https://www.npmjs.com/package/dotenv) 
- [Nodemon](https://www.npmjs.com/package/nodemon)

## Installation Process
1. Clone the repo using this command
  ```
  git clone https://github.com/bishalbikram/Authentication-System.git
  ```
    
2. Change directory
  ```
  cd Authentication-System
  ```
    
3. Install npm packages
  ```
  npm install 
  ```
  
## Setup
```
1. Create config folder

2. Since we are using Nodemailer and Gmail to send email, you have to configure google cloud platform 
   to get OAuth client ID, Client secret and Refresh token  

2. Create .env file inside config directory inluding: 
  
  * PORT=3000
  * MONGO_URI=mongodb://127.0.0.1:27017/authenticationsystem
  * MAIL_USERNAME=************************
  * MAIL_PASSWORD=************
  * OAUTH_CLIENTID=************************************************************
  * CLIENT_SECRET=***********************************
  * OAUTH_REFRESH_TOKEN=*******************************************************
  
4. Run node createKeyPair.js file from helpers directory to create Public and Private key for verifying JWT

5. Setup up a local MongoDB database  
```
## Start Development
```
npm run dev
```
