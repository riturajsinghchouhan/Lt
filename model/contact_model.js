import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  request: String,
  service: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('contact', contactSchema);
