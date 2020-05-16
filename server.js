require('dotenv').config();
const fs = require('fs');
const https = require('https');
const privateKey  = fs.readFileSync(`ssl/${process.env.SSLKEY_NAME}`, 'utf8');
const certificate = fs.readFileSync(`ssl/${process.env.SSLCERT_NAME}`, 'utf8');
const express = require('express');

const credentials = {
  key: privateKey,
  cert: certificate,
};
const app = express();

var httpsServer = https.createServer(credentials, app);

// Enforce https only and handle CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Expose-Headers', 'Authorization');
  if(!req.secure){
    console.log(`${process.env.BASE_URL}${req.url}`);
    res.redirect(`${process.env.BASE_URL}${req.url}`);
  } else {
    next();
  }
});

// Routes
const authRouter = require('./src/routes/auth');

app.use(authRouter);

httpsServer.listen(process.env.PORT);
console.log(`Server started! At ${process.env.BASE_URL}`);