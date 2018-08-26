// loads the defined variables from .env
require('dotenv').config();

// map variable name to the environment variable defined in .env
const config = {
  jwtPrivateKey: process.env.COURSE_REVIEW_jwtPrivateKey
};

module.exports = config;