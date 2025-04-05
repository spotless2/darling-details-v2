const Testimonial = require('../models/testimonial');

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      order: [['date', 'DESC']]
    });
    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { name, content, rating } = req.body;
    
    if (!name || !content || !rating) {
      return res.status(400).json({ message: 'Name, content and rating are required' });
    }
    
    const testimonial = await Testimonial.create({
      name,
      content,
      rating,
      date: new Date()
    });
    
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ message: 'Error creating testimonial', error: error.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
    try {
      const { id } = req.params;
      
      const testimonial = await Testimonial.findByPk(id);
      
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      
      await testimonial.destroy();
      
      res.status(200).json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
    }
  };
  
  exports.updateTestimonial = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, content, rating } = req.body;
      
      const testimonial = await Testimonial.findByPk(id);
      
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      
      // Validate input
      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      
      // Update only provided fields
      if (name) testimonial.name = name;
      if (content) testimonial.content = content;
      if (rating) testimonial.rating = rating;
      
      await testimonial.save();
      
      res.status(200).json(testimonial);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      res.status(500).json({ message: 'Error updating testimonial', error: error.message });
    }
  };