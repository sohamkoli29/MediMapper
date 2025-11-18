import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  role: { 
    type: String, 
    enum: ['patient', 'doctor'], 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  profilePicture: { 
    type: String, 
    default: null 
  },
  phoneNumber: { 
    type: String, 
    default: null 
  },
  address: { 
    type: String, 
    default: null 
  },
  resetToken: { 
    type: String, 
    default: null 
  },
  resetTokenExpiry: { 
    type: Date, 
    default: null 
  },
  online: { 
    type: Boolean, 
    default: false 
  },
  lastActive: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

export default User;