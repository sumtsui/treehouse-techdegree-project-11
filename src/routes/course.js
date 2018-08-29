const Joi = require('joi');
const express = require('express');
const router = express.Router();
const Course = require('../models/course.model');
const { Review } = require('../models/course.model');
const auth = require('../middleware/auth');

/*
  Course Route
*/

// get courses
router.get('/', (req, res, next) => {
  Course
    .find()
    .sort('title')
    .exec((err, courses) => {
      if (err) return next(err);
      res.status(200).json(courses)
    })
});

// get single course
router.get('/:id', (req, res, next) => {
  Course
    .findById(req.params.id)
    .populate('user', 'fullName')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'fullName'
      }
    })
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
router.post('/', auth, (req, res, next) => {
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
router.put('/:id', auth, (req, res, next) => {
  const { error } = validateEdit(req.body);
  if (error) return res.status(400).send(error.details.map(i => i.message).join(', '));

  const updatedCourse = req.body;
  Course
    .findByIdAndUpdate(req.params.id, updatedCourse, { new: true }, (err, course) => {
      if (err) {
        err.status = 400;
        if (!course) {
          err.status = 404;
          err.message = 'Course not found for given ID'
        }
        next(err);
      }
      else res.send(204);
    })
})

// create new review
router.post('/:id/reviews', auth, async (req, res, next) => {
  let course = null;
  // try to catch wrong course id error
  try {
    course = await Course.findById(req.params.id);
  } catch(err) {
    if (err.name === 'CastError') {
      err.status = 400;
      err.message = 'Course not found for given ID';
    }
    next(err);
  }
  
  // prevent lecturer reviewing own courses
  if (req.user._id == course.user._id) {
    const err = new Error('Course creators can not review their own courses');
    err.status = 403;
    return next(err);
  }

  // try to catch error on saving reviews
  try {
    req.body.user = req.user._id;
    const review = await new Review(req.body).save();
    course.reviews.push(review.id);
    await course.save();
    res.send(204);
  } catch(err) {
    err.status = 400;
    next(err);
  }
})

// delete course
router.delete('/:id', auth, async (req, res, next) => {
  const deletedCourse = await Course.findByIdAndRemove(req.params.id);
  if (!deletedCourse) return res.status(404).send('The course with the given ID can not be found');
  res.send(deletedCourse);
})

function validateEdit(course) {
  const schema = {
    title: Joi.string().min(1).max(120),
    description: Joi.string().min(1).max(2000),
    estimatedTime: Joi.string().min(1).max(9),
    materialsNeeded: Joi.string().min(1).max(2000),
    steps: Joi.array()
  };
  return Joi.validate(course, schema, { abortEarly: false });
}

module.exports = router;