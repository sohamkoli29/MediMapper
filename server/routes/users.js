import express from 'express';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // This would typically use authentication middleware
    // For now, we'll use a query parameter
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let profile = { ...user.toObject() };

    // If user is a doctor, include doctor details
    if (user.role === 'doctor') {
      const doctorDetails = await Doctor.findOne({ user: userId });
      profile.doctorDetails = doctorDetails;
    }

    res.json({
      success: true,
      user: profile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { userId, name, email, phoneNumber, address } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phoneNumber,
        address
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('user', 'name email profilePicture online lastActive')
      .select('-__v');

    res.json({
      success: true,
      doctors
    });

  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get doctor by ID
router.get('/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.params.id })
      .populate('user', 'name email profilePicture online lastActive');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      doctor
    });

  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// server/routes/users.js - Add this new route
// Get all patients
router.get('/patients', async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password -resetToken -resetTokenExpiry')
      .sort({ name: 1 });

    res.json({
      success: true,
      patients
    });

  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all users (for fallback)
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetToken -resetTokenExpiry')
      .sort({ name: 1 });

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;