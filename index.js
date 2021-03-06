require('dotenv').config();
const express = require('express');
const bp = require('body-parser');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');
const auth = require('./routes/auth');

const app = express();
// This line lets us accept POST data from axios
app.use(bp.json());
app.use(bp.urlencoded({extended: false}));

mongoose.connect('mongodb://localhost/jwtAuth');

app.use(express.static(__dirname + "/client/build"));

app.use('/auth', auth);

app.get('*', (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
})


var port = process.env.PORT || 3001;

var server = app.listen(port, () => {
  console.log(`Server listening on port: ${port}`)
});

module.exports = server;
