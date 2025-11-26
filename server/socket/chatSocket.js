// server/socket/chatSocket.js - UPDATED with Video Call Support
import Message from '../models/Message.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const chatSocket = (io) => {
  const connectedUsers = new Map();
  const activeVideoCalls = new Map(); // Track active video calls

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User goes online
    socket.on('user_online', async (userId) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return;
        }

        connectedUsers.set(userId, socket.id);
        socket.userId = userId;
        
        await User.findByIdAndUpdate(userId, { 
          online: true, 
          lastActive: new Date() 
        });
        
        socket.broadcast.emit('user_status_change', { 
          userId, 
          online: true 
        });
        
        console.log('User online:', userId);
      } catch (error) {
        console.error('User online error:', error);
      }
    });

    // Join a specific chat room
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log('User joined chat:', chatId);
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, message, filePath, senderRole } = data;

        if (!senderId || !receiverId || !senderRole) {
          return;
        }

        if (!message?.trim() && !filePath) {
          return;
        }

        const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          senderRole: senderRole,
          message: message?.trim() || null,
          filePath: filePath || null,
          fileType: filePath ? 'other' : null
        });

        await newMessage.save();

        await newMessage.populate('sender', 'name profilePicture role');
        await newMessage.populate('receiver', 'name profilePicture role');

        const senderSocketId = connectedUsers.get(senderId);
        const receiverSocketId = connectedUsers.get(receiverId);
        
        const chatId = [senderId, receiverId].sort().join('_');
        
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_sent', newMessage);
        }
        
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', newMessage);
        }
        
        io.to(chatId).emit('receive_message', newMessage);

      } catch (error) {
        console.error('Send message error:', error);
      }
    });

    // Delete message
    socket.on('delete_message', async (data) => {
      try {
        const { messageId, senderId } = data;

        if (!messageId || !senderId) {
          return;
        }

        const message = await Message.findById(messageId);
        
        if (!message) {
          return;
        }

        if (message.sender.toString() !== senderId) {
          return;
        }

        message.deleted = true;
        message.message = null;
        await message.save();

        const chatId = [message.sender.toString(), message.receiver.toString()].sort().join('_');
        io.to(chatId).emit('message_deleted', {
          messageId: message._id
        });

      } catch (error) {
        console.error('Delete message error:', error);
      }
    });

    // ==================== VIDEO CALL EVENTS ====================

    // Initiate video call
    socket.on('initiate_video_call', (data) => {
      const { to, caller } = data;
      const receiverSocketId = connectedUsers.get(to);
      
      if (receiverSocketId) {
        console.log('Initiating video call from', caller.id, 'to', to);
        
        // Store active call
        activeVideoCalls.set(caller.id, to);
        activeVideoCalls.set(to, caller.id);
        
        io.to(receiverSocketId).emit('incoming_video_call', {
          from: caller.id,
          caller: caller
        });
      } else {
        // User is offline
        socket.emit('user_offline', {
          userId: to
        });
      }
    });

    // Accept video call
    socket.on('accept_video_call', (data) => {
      const { to, from } = data;
      const callerSocketId = connectedUsers.get(to);
      
      if (callerSocketId) {
        console.log('Video call accepted by', from);
        io.to(callerSocketId).emit('video_call_accepted', {
          from: from
        });
      }
    });

    // Reject video call
    socket.on('reject_video_call', (data) => {
      const { to } = data;
      const callerSocketId = connectedUsers.get(to);
      
      if (callerSocketId) {
        console.log('Video call rejected');
        io.to(callerSocketId).emit('video_call_rejected');
      }
      
      // Remove from active calls
      activeVideoCalls.delete(socket.userId);
      activeVideoCalls.delete(to);
    });

    // End video call
    socket.on('end_video_call', (data) => {
      const { to } = data;
      const otherUserSocketId = connectedUsers.get(to);
      
      if (otherUserSocketId) {
        console.log('Video call ended');
        io.to(otherUserSocketId).emit('video_call_ended');
      }
      
      // Remove from active calls
      activeVideoCalls.delete(socket.userId);
      activeVideoCalls.delete(to);
    });

    // WebRTC Signaling - Offer
    socket.on('video_call_offer', (data) => {
      const { to, offer } = data;
      const receiverSocketId = connectedUsers.get(to);
      
      if (receiverSocketId) {
        console.log('Forwarding offer to', to);
        io.to(receiverSocketId).emit('video_call_offer', {
          from: socket.userId,
          offer: offer
        });
      }
    });

    // WebRTC Signaling - Answer
    socket.on('video_call_answer', (data) => {
      const { to, answer } = data;
      const callerSocketId = connectedUsers.get(to);
      
      if (callerSocketId) {
        console.log('Forwarding answer to', to);
        io.to(callerSocketId).emit('video_call_answer', {
          from: socket.userId,
          answer: answer
        });
      }
    });

    // WebRTC Signaling - ICE Candidate
    socket.on('ice_candidate', (data) => {
      const { to, candidate } = data;
      const otherUserSocketId = connectedUsers.get(to);
      
      if (otherUserSocketId) {
        io.to(otherUserSocketId).emit('ice_candidate', {
          from: socket.userId,
          candidate: candidate
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      try {
        if (socket.userId) {
          console.log('User disconnected:', socket.userId);
          
          // If user was in a video call, notify the other user
          const otherUserId = activeVideoCalls.get(socket.userId);
          if (otherUserId) {
            const otherUserSocketId = connectedUsers.get(otherUserId);
            if (otherUserSocketId) {
              io.to(otherUserSocketId).emit('video_call_ended');
            }
            activeVideoCalls.delete(socket.userId);
            activeVideoCalls.delete(otherUserId);
          }
          
          connectedUsers.delete(socket.userId);
          
          await User.findByIdAndUpdate(socket.userId, { 
            online: false, 
            lastActive: new Date() 
          });
          
          socket.broadcast.emit('user_status_change', { 
            userId: socket.userId, 
            online: false 
          });
        }
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });
  });

  return io;
};

export default chatSocket;