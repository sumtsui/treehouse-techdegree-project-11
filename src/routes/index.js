const express = require('express');
const router = express.Router();

/*
  Index Route
*/

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Course Review API'
  });
});

module.exports = router;