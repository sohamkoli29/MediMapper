import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { 
      username, 
      password, 
      role, 
      name, 
      email, 
      specialization, 
      qualification, 
      experience 
    } = req.body;

    // Validation
    if (!username || !password || !role || !name || !email) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      username,
      password: hashedPassword,
      role,
      name,
      email
    });

    await user.save();

    // If doctor, create doctor profile
    if (role === 'doctor') {
      const doctor = new Doctor({
        user: user._id,
        specialization: specialization || 'General',
        qualification: qualification || 'MBBS',
        experience: experience || 0
      });
      await doctor.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Remove password from response
    const userResponse = {
      id: user._id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error during registration' 
    });
  }
});

// Login user
// In server/routes/auth.js - Update the login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body; // Remove role from destructuring

    // Validation - remove role check
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }

    // Find user by username or email (without role filter)
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Update user online status
    user.online = true;
    user.lastActive = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role // Use the role from user document
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Remove password from response
    const userResponse = {
      id: user._id,
      username: user.username,
      role: user.role, // This will be either 'patient' or 'doctor'
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      online: user.online
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error during login' 
    });
  }
});
router.get('/verify-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user data
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update online status
    user.online = true;
    user.lastActive = new Date();
    await user.save();

    const userResponse = {
      id: user._id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      online: user.online
    };

    res.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});
export default router;