const express = require('express');
const router = express.Router();
const Course = require('../models/course.model');
const { Review } = require('../models/course.model');
const auth = require('../middleware/auth');

/*
  Course Route /api/courses
*/

// get courses
router.get('/', (req, res, next) => {
  Course
    .find()
    .sort('title')
    .then(courses => res.status(200).json(courses))
    .catch(next);
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
    .then(course => res.status(200).json(course))
    .catch(next);
});

// create new course
router.post('/', auth, (req, res, next) => {
  const course = new Course(req.body);
  course
    .save()
    .then(() => res.send(201))
    .catch(next);
})

// edit single course
router.put('/:id', auth, (req, res, next) => {
  // prevent client from changing user
  (req.body.user) ? 
  res.status(400).send('User can not be changed')
  :
  Course
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(() => res.send(204))
    .catch(next)
})

// create new review
router.post('/:id/reviews', auth, async (req, res, next) => {
  Course
    .findById(req.params.id)
    .then(course => preventSelfReview(course))
    .then(course => saveReview(course))
    .then(course => {
      course.save().then(res.send(204))
    })
    .catch(next);
  
  function saveReview(course) {
    return new Promise((resolve, reject) => {
      req.body.user = req.user._id;
      const review = new Review(req.body);
      review.save((err, product) => {
        if (err) reject(err);
        course.reviews.push(review.id);
        resolve(course);
      })
    })
  }

  function preventSelfReview(course) {
    if (req.user._id == course.user._id) {
      const err = new Error('Course creators can not review their own courses');
      err.status = 400;
      throw err;
    }
    return course;
  }
})

// delete course
router.delete('/:id', auth, async (req, res, next) => {
  Course
    .findById(req.params.id)
    .then(course => {
      if (req.user._id != course.user._id) {
        const err = new Error('Only course owner can delete course');
        err.status = 400;
        throw err; 
      }
      else {
        Course.remove({ _id: course._id }).then(() => res.send(200));
      }
    })
    .catch(next);
})

module.exports = router;