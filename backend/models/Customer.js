const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add customer name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add customer email'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please add company name'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Converted'],
    default: 'New',
  },
  value: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes for optimization
customerSchema.index({ userId: 1, status: 1 });
customerSchema.index({ userId: 1, name: 1 });
customerSchema.index({ userId: 1, email: 1 });
customerSchema.index({ userId: 1, company: 1 });

module.exports = mongoose.model('Customer', customerSchema);
