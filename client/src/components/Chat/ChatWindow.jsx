// client/src/components/Chat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Paperclip, Video, Trash2, MoreVertical } from 'lucide-react';
import axios from 'axios';

const ChatWindow = ({ receiver, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  // Ensure we have proper IDs
  const currentUserId = user?.id || user?._id;
  const receiverId = receiver?.id || receiver?._id;

  useEffect(() => {
    if (socket && receiver && user && currentUserId && receiverId) {
      const chatId = getChatId(currentUserId, receiverId);
      
      if (socket.emit) {
        socket.emit('join_chat', chatId);
      }
      
      loadMessages();
      
      const handleNewMessage = (message) => {
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
      };

      const handleMessageSent = (message) => {
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
      };

      const handleMessageDeleted = (data) => {
        setMessages(prev => prev.map(msg => 
          msg._id === data.messageId ? { ...msg, deleted: true, message: null } : msg
        ));
      };

      socket.on('receive_message', handleNewMessage);
      socket.on('message_sent', handleMessageSent);
      socket.on('message_deleted', handleMessageDeleted);
      
      return () => {
        socket.off('receive_message', handleNewMessage);
        socket.off('message_sent', handleMessageSent);
        socket.off('message_deleted', handleMessageDeleted);
      };
    }
  }, [socket, receiver, user, currentUserId, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join('_');
  };

  const loadMessages = async () => {
    if (!receiver || !user || !currentUserId || !receiverId) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/api/chat/history', {
        params: {
          user1: currentUserId,
          user2: receiverId
        }
      });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    if (!socket || !socket.emit) {
      alert('Connection error. Please refresh the page.');
      return;
    }

    if (!receiver || !user || !currentUserId || !receiverId) {
      alert('Cannot send message. Please try again.');
      return;
    }

    try {
      const messageData = {
        senderId: currentUserId,
        receiverId: receiverId,
        senderRole: user.role,
        message: newMessage.trim(),
        filePath: file ? file.name : null
      };
      
      socket.emit('send_message', messageData);
      
      // Clear input immediately
      setNewMessage('');
      setFile(null);
      
    } catch (error) {
      alert('Failed to send message. Please try again.');
    }
  };

  const deleteMessage = async (messageId) => {
    if (!socket || !socket.emit) return;

    try {
      socket.emit('delete_message', {
        messageId,
        senderId: currentUserId
      });
      
      setMenuOpen(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initiateVideoCall = () => {
    alert('Video call feature will be implemented soon!');
  };

  // Generate unique key for each message
  const getMessageKey = (message, index) => {
    // Use _id if available, otherwise create a composite key
    if (message._id && message._id !== 'undefined') {
      return message._id;
    }
    // Create a unique key using timestamp and index
    return `msg-${message.timestamp}-${index}-${Math.random().toString(36).substr(2, 9)}`;
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Lost</h3>
          <p className="text-gray-600 mb-4">Please refresh the page to reconnect</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!receiver) {
    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg items-center justify-center">
        <div className="text-center">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a chat</h3>
          <p className="text-gray-600">Choose a user to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-2 p-1 hover:bg-blue-700 rounded-full transition-colors"
            >
              ←
            </button>
          )}
          <img
            src={receiver.profilePicture || '/default-avatar.png'}
            alt={receiver.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{receiver.name}</h3>
            <p className="text-sm opacity-80 capitalize">
              {receiver.role} {receiver.specialization && `• ${receiver.specialization}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <button
            onClick={initiateVideoCall}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
            title="Video Call"
          >
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={getMessageKey(message, index)}
              className={`flex ${
                (message.sender._id === currentUserId || message.sender.id === currentUserId) 
                  ? 'justify-end' 
                  : 'justify-start'
              } mb-4 group`}
            >
              <div className="relative">
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    (message.sender._id === currentUserId || message.sender.id === currentUserId)
                      ? message.deleted 
                        ? 'bg-gray-300 text-gray-500 italic'
                        : 'bg-blue-600 text-white'
                      : message.deleted
                        ? 'bg-gray-200 text-gray-500 italic'
                        : 'bg-white text-gray-800 border'
                  }`}
                >
                  {/* Show sender name for received messages */}
                  {(message.sender._id !== currentUserId && message.sender.id !== currentUserId) && (
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      {message.sender.name}
                    </p>
                  )}
                  
                  {/* Deleted message display */}
                  {message.deleted ? (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm italic">This message was deleted</span>
                    </div>
                  ) : (
                    /* Normal message display */
                    <>
                      <p className="break-words">{message.message}</p>
                      
                      {message.filePath && (
                        <div className="mt-2">
                          <a
                            href={message.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline flex items-center space-x-1"
                          >
                            <Paperclip className="w-3 h-3" />
                            <span>Attachment</span>
                          </a>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Message timestamp */}
                  <p className={`text-xs opacity-70 mt-1 text-right ${
                    message.deleted ? 'text-gray-400' : ''
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>

                {/* Message Actions Menu - Only show for non-deleted messages sent by current user */}
                {(message.sender._id === currentUserId || message.sender.id === currentUserId) && 
                 !message.deleted && (
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === message._id ? null : message._id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </button>
                      
                      {menuOpen === message._id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => deleteMessage(message._id)}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;