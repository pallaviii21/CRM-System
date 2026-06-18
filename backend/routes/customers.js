const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { protect } = require('../middleware/auth');

// @desc    Get all customers for logged-in user (with search and status filters)
// @route   GET /api/customers
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = { userId: req.user._id };

    // Filter by status if provided
    if (status && status !== 'All') {
      query.status = status;
    }

    // Text search by name, email, or company if provided
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
      ];
    }

    // Fetch customers sorted by newest first
    const customers = await Customer.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get single customer details
// @route   GET /api/customers/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    return res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Add new customer
// @route   POST /api/customers
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, email, phone, company, status, value, notes } = req.body;

    if (!name || !email || !company) {
      return res.status(400).json({ success: false, error: 'Please include name, email, and company' });
    }

    const customer = await Customer.create({
      userId: req.user._id,
      name,
      email,
      phone,
      company,
      status: status || 'New',
      value: value || 0,
      notes,
    });

    return res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

// @desc    Update customer details
// @route   PUT /api/customers/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

// @desc    Update customer lead status quick-action
// @route   PATCH /api/customers/:id/status
// @access  Private
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['New', 'Contacted', 'Converted'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid status (New, Contacted, or Converted)' });
    }

    let customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    customer.status = status;
    await customer.save();

    return res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    await Customer.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
