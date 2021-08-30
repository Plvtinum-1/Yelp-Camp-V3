const express = require('express');
const router = express.Router();
const { validateReview, isLoggedIn, authorizedReview } = require('../middleware');

const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');

const reviews = require('../controllers/reviews');

router.post('/campgrounds/:id/reviews', isLoggedIn, validateReview, wrapAsync(reviews.postReview));

router.delete('/campgrounds/:id/reviews/:reviewId', isLoggedIn, authorizedReview, wrapAsync(reviews.deleteReview));

module.exports = router;
