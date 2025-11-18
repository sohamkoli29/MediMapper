import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  specialization: { 
    type: String, 
    required: true,
    trim: true
  },
  qualification: { 
    type: String, 
    required: true,
    trim: true
  },
  experience: { 
    type: Number, 
    required: true,
    min: 0
  },
  availability: { 
    type: String, 
    default: '9 AM - 5 PM' 
  },
  status: { 
    type: Boolean, 
    default: false 
  },
  consultationFee: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  bio: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

doctorSchema.index({ user: 1 });
doctorSchema.index({ specialization: 1 });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;