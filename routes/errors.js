const express = require('express');
const router = express.Router();
const passport = require('passport'); // multer for parsing multipart form data (files)

//Import controllers
const { addError, deleteError, getErrors } = require('../controllers/error');

// @route   POST /errors
// @desc    Create new error
// @access  Private
router.post('/', addError);

// @route   DELETE /errors/:id
// @desc    DELETE existing error
// @access  Private
router.delete('/:id', passport.authenticate('jwt-admin', { session: false }), deleteError);

// @route   GET /errors
// @desc    GET existing error
// @access  Public
router.get('/', passport.authenticate('jwt-admin', { session: false }), getErrors);

module.exports = router;
