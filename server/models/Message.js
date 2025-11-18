// server/models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  senderRole: { 
    type: String, 
    enum: ['doctor', 'patient'], 
    required: true 
  },
  message: { 
    type: String, 
    required: function() {
      return !this.filePath && !this.deleted; // Message is required if no file and not deleted
    }
  },
  filePath: { 
    type: String, 
    default: null 
  },
  fileType: {
    type: String,
    enum: ['image', 'pdf', 'video', 'other', null],
    default: null
  },
  deleted: {
    type: Boolean,
    default: false
  },
  read: {
    type: Boolean,
    default: false
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;