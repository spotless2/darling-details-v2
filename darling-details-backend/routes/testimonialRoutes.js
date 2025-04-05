const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');

// GET all testimonials
router.get('/', testimonialController.getAllTestimonials);

// POST create a new testimonial
router.post('/', testimonialController.createTestimonial);

// DELETE a testimonial by ID
router.delete('/:id', testimonialController.deleteTestimonial);

// PUT update a testimonial by ID
router.put('/:id', testimonialController.updateTestimonial);

module.exports = router;