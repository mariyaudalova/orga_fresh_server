const express = require('express');
const router = express.Router();
const passport = require('passport'); // multer for parsing multipart form data (files)

//Import controllers
const { addBrand, updateBrand, deleteBrand, getBrands } = require('../controllers/brands');

// @route   POST /brands
// @desc    Create new brand
// @access  Private
router.post('/', passport.authenticate('jwt-admin', { session: false }), addBrand);

// @route   PUT /brands/:id
// @desc    Update existing brand
// @access  Private
router.put('/:id', passport.authenticate('jwt-admin', { session: false }), updateBrand);

// @route   DELETE /brands/:id
// @desc    DELETE existing brand
// @access  Private
router.delete('/:id', passport.authenticate('jwt-admin', { session: false }), deleteBrand);

// @route   GET /brands
// @desc    GET existing brand
// @access  Public
router.get('/', getBrands);

module.exports = router;
