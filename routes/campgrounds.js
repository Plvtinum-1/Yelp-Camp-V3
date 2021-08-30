const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, authorized, validateCamp } = require('../middleware');

const wrapAsync = require('../utils/wrapAsync');

const campgrounds = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../cloudinary/index');

const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCamp, wrapAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, upload.array('image'), campgrounds.renderNewForm);

router.route('/:id')
    .get(wrapAsync(campgrounds.showCampground))
    .put(isLoggedIn, authorized, upload.array('image'), validateCamp, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, authorized, wrapAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, authorized, wrapAsync(campgrounds.editCampground));

module.exports = router;