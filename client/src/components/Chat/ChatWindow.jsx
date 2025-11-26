// client/src/components/Chat/ChatWindow.jsx - SIMPLIFIED (uses VideoCallContext)
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { useVideoCall } from '../../contexts/VideoCallContext';
import { Send, Paperclip, Video, Trash2, MoreVertical, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ChatWindow = ({ receiver, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const { initiateCall } = useVideoCall();
  const messagesEndRef = useRef(null);

  const currentUserId = user?.id || user?._id;
  const receiverId = receiver?.id || receiver?._id;
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (socket && receiver && user && currentUserId && receiverId) {
      const chatId = getChatId(currentUserId, receiverId);
      
      if (socket.emit) {
        socket.emit('join_chat', chatId);
      }
      
      loadMessages();
      
      const handleNewMessage = (message) => {
        setMessages(prev => {
          const exists = prev.some(msg => msg._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
      };

      const handleMessageSent = (message) => {
        setMessages(prev => {
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join('_');
  };

  const loadMessages = async () => {
    if (!receiver || !user || !currentUserId || !receiverId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chat/history`, {
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

  const handleVideoCall = () => {
    initiateCall(receiver);
  };

  const getMessageKey = (message, index) => {
    if (message._id && message._id !== 'undefined') {
      return message._id;
    }
    return `msg-${message.timestamp}-${index}-${Math.random().toString(36).substr(2, 9)}`;
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Connection Lost</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Please refresh the page to reconnect</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!receiver) {
    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg items-center justify-center p-4">
        <div className="text-center">
          <Video className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Select a chat</h3>
          <p className="text-gray-600 text-sm sm:text-base">Choose a user to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-3 sm:p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-1 sm:mr-2 p-1 hover:bg-blue-700 rounded-full transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          <img
            src={receiver.profilePicture || '/default-avatar.png'}
            alt={receiver.name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm sm:text-base truncate">{receiver.name}</h3>
            <p className="text-xs sm:text-sm opacity-80 capitalize truncate">
              {receiver.role} {receiver.specialization && `• ${receiver.specialization}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <button
            onClick={handleVideoCall}
            className="p-1 sm:p-2 hover:bg-blue-700 rounded-full transition-colors"
            title="Video Call"
          >
            <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-16 sm:h-20">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-500 text-sm sm:text-base">
              <p>No messages yet</p>
              <p className="text-xs sm:text-sm">Start a conversation!</p>
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
              } mb-3 sm:mb-4 group`}
            >
              <div className="relative max-w-[85%] xs:max-w-xs sm:max-w-md lg:max-w-lg">
                <div
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
                    (message.sender._id === currentUserId || message.sender.id === currentUserId)
                      ? message.deleted 
                        ? 'bg-gray-300 text-gray-500 italic'
                        : 'bg-blue-600 text-white'
                      : message.deleted
                        ? 'bg-gray-200 text-gray-500 italic'
                        : 'bg-white text-gray-800 border'
                  }`}
                >
                  {(message.sender._id !== currentUserId && message.sender.id !== currentUserId) && (
                    <p className="text-xs font-semibold text-gray-600 mb-1 truncate">
                      {message.sender.name}
                    </p>
                  )}
                  
                  {message.deleted ? (
                    <div className="flex items-center space-x-2 text-gray-500 text-xs sm:text-sm">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="italic">This message was deleted</span>
                    </div>
                  ) : (
                    <>
                      <p className="break-words text-sm sm:text-base">{message.message}</p>
                      
                      {message.filePath && (
                        <div className="mt-1 sm:mt-2">
                          <a
                            href={message.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm underline flex items-center space-x-1"
                          >
                            <Paperclip className="w-3 h-3" />
                            <span>Attachment</span>
                          </a>
                        </div>
                      )}
                    </>
                  )}
                  
                  <p className={`text-xs opacity-70 mt-1 text-right ${
                    message.deleted ? 'text-gray-400' : ''
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>

                {(message.sender._id === currentUserId || message.sender.id === currentUserId) && 
                 !message.deleted && (
                  <div className="absolute top-0 -right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === message._id ? null : message._id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </button>
                      
                      {menuOpen === message._id && (
                        <div className="absolute right-0 mt-1 w-28 bg-white border rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => deleteMessage(message._id)}
                            className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-gray-100 flex items-center space-x-2"
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
      <div className="p-3 sm:p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-blue-500"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;