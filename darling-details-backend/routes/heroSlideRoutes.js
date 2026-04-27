const express = require('express');
const router = express.Router();
const heroSlideController = require('../controllers/heroSlideController');
const auth = require('../middleware/auth');

// Public: active slides only (for frontend hero)
router.get('/active', heroSlideController.getActiveSlides);

// Protected: all slides (admin)
router.get('/', auth, heroSlideController.getAllSlides);
router.post('/', auth, heroSlideController.createSlide);
router.put('/:id', auth, heroSlideController.updateSlide);
router.delete('/:id', auth, heroSlideController.deleteSlide);

module.exports = router;
