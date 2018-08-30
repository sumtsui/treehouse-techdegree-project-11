const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StepSchema = Schema({
  stepNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

const ReviewSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  postedOn: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Invalid rating value'],
    max: [5, 'Invalid rating value'],
  },
  review: {
    type: String
  }
});

const CourseSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    validate: {
      // not working!!!
      validator: v => v.length === 0,
      message: 'Title can not be empty'
    }
  },
  description: {
    type: String,
    required: true
  },
  estimatedTime: {
    type: String
  },
  materialsNeeded: {
    type: String
  },
  steps: [StepSchema],
  reviews: [
    {
      type: Schema.ObjectId,
      ref: 'Review',
      default: []
    }
  ]
});

const Course = mongoose.model('Course', CourseSchema);
const Review = mongoose.model('Review', ReviewSchema);

module.exports = Course
module.exports.Review = Review;