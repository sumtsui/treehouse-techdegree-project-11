// load the defined variables from .env
require('dotenv').config();

const env = process.env.NODE_ENV;

const development = {
  // map config variable to the environment variable defined in .env
  jwtPrivateKey: process.env.COURSE_REVIEW_jwtPrivateKey,
  db: 'mongodb://localhost:27017/course-api'
};

const test = {
  jwtPrivateKey: process.env.COURSE_REVIEW_jwtPrivateKey,
  db: 'mongodb://localhost:27017/course-api-test'
};

const config = {
  development,
  test
};

module.exports = config[env];