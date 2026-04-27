const HeroSlide = require('../models/heroSlide');

exports.getAllSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.findAll({ order: [['order', 'ASC'], ['createdAt', 'ASC']] });
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slides', error: error.message });
  }
};

exports.getActiveSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.findAll({
      where: { active: true },
      order: [['order', 'ASC'], ['createdAt', 'ASC']]
    });
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slides', error: error.message });
  }
};

exports.createSlide = async (req, res) => {
  try {
    const { title, subtitle, description, imageUrl, ctaText, ctaLink, order, active } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ message: 'Title and imageUrl are required' });
    }
    const slide = await HeroSlide.create({ title, subtitle, description, imageUrl, ctaText, ctaLink, order, active });
    res.status(201).json(slide);
  } catch (error) {
    res.status(500).json({ message: 'Error creating slide', error: error.message });
  }
};

exports.updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const slide = await HeroSlide.findByPk(id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    await slide.update(req.body);
    res.status(200).json(slide);
  } catch (error) {
    res.status(500).json({ message: 'Error updating slide', error: error.message });
  }
};

exports.deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const slide = await HeroSlide.findByPk(id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    await slide.destroy();
    res.status(200).json({ message: 'Slide deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting slide', error: error.message });
  }
};
