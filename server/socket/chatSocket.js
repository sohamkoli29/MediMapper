// server/socket/chatSocket.js - Clean version
import Message from '../models/Message.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const chatSocket = (io) => {
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
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
        
      } catch (error) {
        console.error('User online error:', error);
      }
    });

    // Join a specific chat room
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
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

    // Handle disconnect
    socket.on('disconnect', async () => {
      try {
        if (socket.userId) {
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