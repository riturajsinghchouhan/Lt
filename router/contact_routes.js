import express from 'express';
import Contact from '../model/contact_model.js';

const router = express.Router();

// Submit contact
router.post('/submit', async (req, res) => {
  try {
    await Contact.create(req.body);
    res.send({ success: true, message: 'Thanks for contacting us!' });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to save contact' });
  }
});

// Get all contacts (for admin)
router.get('/all', async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.send(contacts);
});

export default router;
