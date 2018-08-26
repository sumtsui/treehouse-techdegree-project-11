const express = require('express');
const router = express.Router();
const Course = require('../models/course.model');
const { Review } = require('../models/course.model');

/*
  Course Route
*/

// get courses
router.get('/', (req, res, next) => {
  Course
    .find()
    .sort('title')
    .exec((err, courses) => {
      if (err) {
        err.status = 400;
        next(err);
      }
      res.status(200).json(courses)
    })
});

// get single course
router.get('/:id', (req, res, next) => {
  Course
    .findById(req.params.id)
    .populate('user')
    .populate('reviews')
    .exec((err, course) => {
      if (!course) {
        const err = new Error('Course not found for given ID');
        err.status = 404;
        next(err);
      }
      else if (err) {
        err.status = 400;
        next(err);
      }
      else res.status(200).json(course)
    })
});

// create new course
router.post('/', (req, res, next) => {
  const course = new Course(req.body);
  course
    .save((err, course) => {
      if (err) {
        err.status = 400;
        next(err);
      }
      else res.send(201);
    })
})

// edit single course
router.put('/:id', (req, res, next) => {
  const updatedCourse = req.body;
  Course
    .findByIdAndUpdate(req.params.id, updatedCourse, { new: true }, (err, course) => {
      if (err) {
        if (!course) {
          err.status = 404;
          err.message = 'Course not found for given ID'
          next(err);
        }
        err.status = 400;
        next(err);
      }
      else res.send(204);
    })
})

// create new review
router.post('/:id/reviews', async (req, res, next) => {
  const review = new Review(req.body);
  try {
    // save new review to the Review collection
    const result = await review.save();
    // find the course the review is submitted to
    const course = await Course.findById(req.params.id);
    // update the reviews array in that course
    course.reviews.push(result.id);
    await course.save();
    res.send(204);
  } catch (err) {
    err.status = 400;
    next(err);
  }
})

module.exports = router;