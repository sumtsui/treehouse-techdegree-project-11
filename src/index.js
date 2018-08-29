'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('../config');
// load routes
const indexRoute = require('./routes');
const authRoute = require('./routes/auth');
const courseRoute = require('./routes/course');
const userRoute = require('./routes/user');

if (!config.jwtPrivateKey) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

// db connection
mongoose
  .connect(config.db, { useNewUrlParser: true })
  .then(() => {
    console.log(`Successfully connect to ${config.db}`)
    console.log('\nNODE_ENV:', process.env.NODE_ENV);
  })
  .catch(err => {
    console.log('Could not connect to the database\n', err.message);
  })

const app = express();
// set port
app.set('port', process.env.PORT || 3000);
// parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// morgan gives us http request logging
app.use(morgan('dev'));

/* --- Routes --- */
app.use('/', indexRoute);
app.use('/api/auth', authRoute);
app.use('/api/courses', courseRoute);
app.use('/api/users', userRoute);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json(
    err.message
  );
});

// start listening on port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

module.exports = server;
