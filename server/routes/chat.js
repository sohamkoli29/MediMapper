// server/routes/chat.js
import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get chat history between two users
router.get('/history', async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    if (!user1 || !user2) {
      return res.status(400).json({
        success: false,
        message: 'Both user1 and user2 parameters are required'
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(user1) || !mongoose.Types.ObjectId.isValid(user2)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    })
      .populate('sender', 'name profilePicture role')
      .populate('receiver', 'name profilePicture role')
      .sort({ timestamp: 1 });

    res.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's conversations
router.get('/conversations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Get distinct users that the current user has chatted with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
              then: '$receiver',
              else: '$sender'
            }
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$receiver', new mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          'user.password': 0,
          'user.resetToken': 0
        }
      }
    ]);

    res.json({
      success: true,
      conversations
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Mark messages as read
router.patch('/read', async (req, res) => {
  try {
    const { userId, senderId } = req.body;

    if (!userId || !senderId) {
      return res.status(400).json({
        success: false,
        message: 'userId and senderId are required'
      });
    }

    await Message.updateMany(
      {
        sender: senderId,
        receiver: userId,
        read: false
      },
      {
        $set: { read: true }
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });

  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
// server/routes/chat.js - Add a debug endpoint
// Debug endpoint to check user IDs
router.get('/debug-users', async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    
    console.log('Debug users:', { user1, user2 });
    
    // Check if users exist
    const user1Exists = await User.findById(user1);
    const user2Exists = await User.findById(user2);
    
    res.json({
      success: true,
      user1: {
        exists: !!user1Exists,
        name: user1Exists?.name
      },
      user2: {
        exists: !!user2Exists,
        name: user2Exists?.name
      },
      params: { user1, user2 }
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error'
    });
  }
});

// Add this temporary debug route to server/routes/chat.js
router.get('/debug', async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    
    console.log('Debug chat request:', { user1, user2 });
    
    // Check if users exist
    const user1Data = await User.findById(user1);
    const user2Data = await User.findById(user2);
    
    res.json({
      success: true,
      user1: {
        exists: !!user1Data,
        name: user1Data?.name,
        role: user1Data?.role
      },
      user2: {
        exists: !!user2Data,
        name: user2Data?.name,
        role: user2Data?.role
      },
      message: 'Debug information'
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error'
    });
  }
});
export default router;