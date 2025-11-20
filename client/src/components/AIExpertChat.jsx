import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, RotateCcw , Stethoscope,Leaf,Utensils,Brain} from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer'
import { Link } from 'react-router-dom';

const AIExpertChat = ({ expertConfig }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const {
    name,
    description,
    icon,
    colorScheme,
    quickSuggestions,
    route,
    expertType
  } = expertConfig;

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/expert-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          expertType: expertType,
          conversationHistory: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            message: msg.content
          }))
        })
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          content: data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        content: "Sorry, I'm having trouble responding. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const navigationItems = [
    {
      path: '/ai-medical-expert',
      icon: <Stethoscope className="w-6 h-6" />,
      label: 'Medical',
      expertType: 'medical'
    },
    {
      path: '/ai-ayurvedic-expert',
         icon: <Leaf className="w-6 h-6" />,
        label: 'Ayurvedic',
      expertType: 'ayurvedic'
    },
    {
      path: '/ai-nutritionist',
     icon: <Utensils className="w-6 h-6" />,
      label: 'Nutrition',
      expertType: 'nutrition'
    },
    {
      path: '/ai-mental-health-expert',
      icon: <Brain className="w-6 h-6" />,
      label: 'Mental Health',
      expertType: 'mental_health'
    }
  ];

  const getGradient = (color) => {
    const gradients = {
      blue: 'from-blue-50 to-cyan-50',
      green: 'from-green-50 to-emerald-50',
      orange: 'from-orange-50 to-amber-50',
      purple: 'from-purple-50 to-violet-50'
    };
    return gradients[color] || gradients.blue;
  };

  const getBgColor = (color) => {
    const colors = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      orange: 'bg-orange-600',
      purple: 'bg-purple-600'
    };
    return colors[color] || colors.blue;
  };

  const getHoverBgColor = (color) => {
    const colors = {
      blue: 'hover:bg-blue-700',
      green: 'hover:bg-green-700',
      orange: 'hover:bg-orange-700',
      purple: 'hover:bg-purple-700'
    };
    return colors[color] || colors.blue;
  };

  const getLightBgColor = (color) => {
    const colors = {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      orange: 'bg-orange-100',
      purple: 'bg-purple-100'
    };
    return colors[color] || colors.blue;
  };

  const getTextColor = (color) => {
    const colors = {
      blue: 'text-blue-800',
      green: 'text-green-800',
      orange: 'text-orange-800',
      purple: 'text-purple-800'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getGradient(colorScheme)} flex flex-col`}>
      {/* Header */}
      <div className={`${getBgColor(colorScheme)} text-white p-4 shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className={`p-2 ${getHoverBgColor(colorScheme)} rounded-full transition-colors`}>
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">{icon}</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold">{name}</h1>
                <p className="text-white/80 text-sm">{description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className={`p-2 ${getHoverBgColor(colorScheme)} rounded-full transition-colors`}
              title="Clear Chat"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234a90e2' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      >
        {messages.length === 0 && (
          <div className="text-center max-w-2xl mx-auto mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <div className={`w-20 h-20 ${getLightBgColor(colorScheme)} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <span className="text-3xl">{icon}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{name}</h2>
            <p className="text-gray-600 mb-6">
              {expertConfig.welcomeMessage}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(suggestion)}
                  className={`${getLightBgColor(colorScheme)} ${getTextColor(colorScheme)} px-4 py-3 rounded-lg text-sm hover:opacity-80 transition-colors text-left`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? `${getBgColor(colorScheme)} text-white rounded-br-none`
                  : 'bg-white text-gray-800 shadow-md rounded-bl-none border border-gray-100'
              }`}
            >
              <div className="message-content">
  <MarkdownRenderer content={message.content} />
</div>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-white/80' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-md border border-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className={`${getBgColor(colorScheme)} text-white w-12 h-12 rounded-full flex items-center justify-center ${getHoverBgColor(colorScheme)} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200">
        <div className="flex justify-around py-3 max-w-4xl mx-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
                route === item.path
                  ? `${getLightBgColor(colorScheme)} ${getTextColor(colorScheme)}`
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIExpertChat;