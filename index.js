const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const passportjwt = require('passport-jwt');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect to Database
mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
  console.log('Connected To DB: ' + config.database);
});

mongoose.connection.on('error', (err) => {
  console.log('DB Error: ' + err);
});

const app = express();
const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

const users = require('./routes/users');

app.use('/users', users);

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => res.sendFile(path.resolve('client/build', 'index.html')));
}

app.listen(port, ()=> {
  console.log("Server started on port " + port);
});
