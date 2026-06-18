const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { protect } = require('../middleware/auth');

// @desc    Get dashboard metrics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Counts
    const totalCustomers = await Customer.countDocuments({ userId });
    const newLeads = await Customer.countDocuments({ userId, status: 'New' });
    const contactedLeads = await Customer.countDocuments({ userId, status: 'Contacted' });
    const convertedLeads = await Customer.countDocuments({ userId, status: 'Converted' });

    // Get trend data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const customersByMonth = await Customer.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 },
          newCount: {
            $sum: { $cond: [{ $eq: ["$status", "New"] }, 1, 0] }
          },
          contactedCount: {
            $sum: { $cond: [{ $eq: ["$status", "Contacted"] }, 1, 0] }
          },
          convertedCount: {
            $sum: { $cond: [{ $eq: ["$status", "Converted"] }, 1, 0] }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Fill in last 6 months list so there is always data even if empty
    const timeline = [];
    const tempDate = new Date(sixMonthsAgo);
    for (let i = 0; i < 6; i++) {
      const m = tempDate.getMonth();
      const y = tempDate.getFullYear();
      const monthLabel = `${monthNames[m]} ${y.toString().slice(-2)}`;
      
      const dbMonth = customersByMonth.find(c => c._id.month === (m + 1) && c._id.year === y);
      timeline.push({
        name: monthLabel,
        total: dbMonth ? dbMonth.count : 0,
        newLeads: dbMonth ? dbMonth.newCount : 0,
        contacted: dbMonth ? dbMonth.contactedCount : 0,
        converted: dbMonth ? dbMonth.convertedCount : 0
      });
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    // Get recent activities (last 5 customers added or updated)
    const recentActivities = await Customer.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(6);

    return res.json({
      success: true,
      data: {
        summary: {
          totalCustomers,
          newLeads,
          contactedLeads,
          convertedLeads,
        },
        timeline,
        recentActivities: recentActivities.map(c => ({
          _id: c._id,
          name: c.name,
          company: c.company,
          status: c.status,
          updatedAt: c.updatedAt
        }))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
