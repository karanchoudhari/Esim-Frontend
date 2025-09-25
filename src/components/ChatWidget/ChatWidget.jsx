import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../context/SocketContext';
import './ChatWidget.css';
import AxiosInstance from '../../../Axiosinstance';
import { useNavigate } from 'react-router-dom';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [IsTyping, setIsTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPredefinedIssues, setShowPredefinedIssues] = useState(true);
  const socket = useSocket();
  const { User } = useSelector((state) => state.Auth);
  const messagesEndRef = useRef(null);
  const chatWidgetRef = useRef(null);
  const navigate = useNavigate();

  // Predefined common issues and solutions
  const predefinedIssues = [
    {
      problem: "eSIM not activating",
      solution: "Please ensure you have stable internet connection and try restarting your device. If issue persists, our team will assist you shortly."
    },
    {
      problem: "Can't scan QR code",
      solution: "Make sure your camera is clean and has proper lighting. Try moving the QR code closer or further from the camera."
    },
    {
      problem: "No network connection",
      solution: "Check if cellular data is enabled in your settings. Try toggling airplane mode on/off."
    },
    {
      problem: "Payment issue",
      solution: "Please verify your payment method details and ensure sufficient funds. If problem continues, contact your bank."
    },
    {
      problem: "KYC verification pending",
      solution: "Your documents are under review. This usually takes 1-2 business days. We'll notify you once approved."
    }
  ];

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle click outside to close chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && chatWidgetRef.current && !chatWidgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (socket && User) {
      // Listen for admin replies
      const handleReceiveReply = (data) => {
        console.log("Admin reply received:", data);
        
        // Add to session storage only (not to database for user)
        setMessages(prev => {
          const updatedMessages = [...prev, data];
          sessionStorage.setItem(`user_chat_${User._id}`, JSON.stringify(updatedMessages));
          return updatedMessages;
        });
        
        if (isOpen) {
          markMessagesAsRead();
        } else {
          setUnreadCount(prev => prev + 1);
        }
      };

      // Listen for typing indicators
      const handleAdminTyping = (data) => {
        setAdminTyping(data.IsTyping);
        if (data.IsTyping) {
          // Clear previous timeout if exists
          const timer = setTimeout(() => {
            setAdminTyping(false);
          }, 2000);
          
          // Cleanup timeout on component unmount or new typing event
          return () => clearTimeout(timer);
        }
      };

      socket.on("receiveReply", handleReceiveReply);
      socket.on("adminTyping", handleAdminTyping);

      // Load initial messages from session storage
      const loadSessionMessages = () => {
        try {
          const sessionMessages = sessionStorage.getItem(`user_chat_${User._id}`);
          if (sessionMessages) {
            const parsedMessages = JSON.parse(sessionMessages);
            setMessages(parsedMessages);
            
            // Calculate unread count from session messages
            const unreadAdminMessages = parsedMessages.filter(msg => 
              msg.isAdmin && !msg.isRead
            );
            setUnreadCount(unreadAdminMessages.length);
          }
        } catch (error) {
          console.error('Error loading session messages:', error);
        }
      };

      loadSessionMessages();

      return () => {
        socket.off("receiveReply", handleReceiveReply);
        socket.off("adminTyping", handleAdminTyping);
      };
    }
  }, [socket, User, isOpen]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && User && unreadCount > 0) {
      markMessagesAsRead();
    }
  }, [isOpen, User]);

  const markMessagesAsRead = async () => {
    try {
      // Only mark as read in session storage, not in database
      setMessages(prev => {
        const updatedMessages = prev.map(msg => 
          msg.isAdmin ? { ...msg, isRead: true } : msg
        );
        sessionStorage.setItem(`user_chat_${User._id}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && socket && User) {
      const messageData = {
        text: inputMessage,
        userId: User._id,
        userName: User.name,
        timestamp: new Date(),
        // Add flag to indicate this should be saved to database (for admin)
        saveToDatabase: true
      };
      
      // Send to server (will be saved to database for admin)
      socket.emit("sendMessage", messageData);
      
      // Create temporary message for UI (session only)
      const userMessage = {
        _id: `session_${Date.now()}`,
        text: inputMessage,
        isAdmin: false,
        isRead: true,
        createdAt: new Date(),
        userId: User._id,
        isSessionOnly: true // Flag to identify session-only messages
      };
      
      // Save to session storage only
      setMessages(prev => {
        const updatedMessages = [...prev, userMessage];
        sessionStorage.setItem(`user_chat_${User._id}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      
      setInputMessage('');
      setShowPredefinedIssues(false);
      
      // Stop typing indicator after sending message
      handleTyping(false);
    }
  };

  const handlePredefinedIssueClick = (issue) => {
    if (socket && User) {
      // Send the problem to admin (saved to database)
      const messageData = {
        text: `User reported issue: ${issue.problem}`,
        userId: User._id,
        userName: User.name,
        timestamp: new Date(),
        isPredefinedIssue: true,
        saveToDatabase: true
      };
      
      socket.emit("sendMessage", messageData);
      
      // Create session-only messages for UI
      const problemMessage = {
        _id: `session_${Date.now()}`,
        text: `Problem: ${issue.problem}`,
        isAdmin: false,
        isRead: true,
        createdAt: new Date(),
        userId: User._id,
        isSessionOnly: true
      };
      
      const solutionMessage = {
        _id: `session_${Date.now()}_solution`,
        text: issue.solution,
        isAdmin: true,
        isRead: true,
        createdAt: new Date(),
        userId: User._id,
        isSessionOnly: true
      };
      
      // Save to session storage only
      setMessages(prev => {
        const updatedMessages = [...prev, problemMessage, solutionMessage];
        sessionStorage.setItem(`user_chat_${User._id}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      
      setShowPredefinedIssues(false);
    }
  };

  const handleCustomIssueClick = () => {
    setShowPredefinedIssues(false);
  };

  const handleShowPredefinedIssues = () => {
    setShowPredefinedIssues(true);
  };

  // Fixed typing handler with proper cleanup
  const handleTyping = (typing) => {
    if (socket && User) {
      try {
        socket.emit("typing", { IsTyping: typing });
        setIsTyping(typing);
      } catch (error) {
        console.error('Error sending typing indicator:', error);
      }
    }
  };

  // Debounced typing handler to prevent excessive emissions
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    // Only send typing indicator if user is actually typing
    if (e.target.value.trim().length > 0) {
      handleTyping(true);
    } else {
      handleTyping(false);
    }
  };

  // Handle input focus with typing indicator
  const handleInputFocus = () => {
    handleTyping(true);
  };

  // Handle input blur with typing indicator
  const handleInputBlur = () => {
    // Small delay to allow for form submission
    setTimeout(() => {
      handleTyping(false);
    }, 100);
  };

  // Handle key press events
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleChatButtonClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && User) {
      setShowPredefinedIssues(messages.length === 0);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    // Stop typing when chat is closed
    handleTyping(false);
  };

  const clearChatSession = () => {
    sessionStorage.removeItem(`user_chat_${User._id}`);
    setMessages([]);
    setShowPredefinedIssues(true);
    setUnreadCount(0);
  };

  return (
    <>
      {/* Chat Button with toggle icon */}
      <div className="chat-widget-button" onClick={handleChatButtonClick}>
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-comments"></i>
        )}
        {unreadCount > 0 && (
          <span className="chat-notification-badge">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window" ref={chatWidgetRef}>
          <div className="chat-header">
            <div className="chat-header-info">
              <h3>Customer Support</h3>
              <p>We're here to help you</p>
              {unreadCount > 0 && !User && (
                <span className="unread-indicator">{unreadCount} unread messages</span>
              )}
            </div>
            <button className="chat-close" onClick={handleCloseChat}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          {!User ? (
            <div className="chat-auth-required">
              <i className="fas fa-user-lock"></i>
              <h4>Authentication Required</h4>
              <p>Please sign up or login to use chat support</p>
              <div className="auth-buttons">
                <button 
                  className="btn-primary"
                  onClick={()=>navigate('/signup')}
                >
                  Sign Up
                </button>
                <button 
                  className="btn-secondary"
                  onClick={()=>navigate('/login')}
                >
                  Login
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="chat-messages">
                {messages.length === 0 && showPredefinedIssues ? (
                  <div className="predefined-issues">
                    <div className="issues-header">
                      <i className="fas fa-lightbulb"></i>
                      <h4>How can we help you today?</h4>
                      <p>Select an issue below or describe your problem</p>
                    </div>
                    <div className="issues-list">
                      {predefinedIssues.map((issue, index) => (
                        <button
                          key={index}
                          className="issue-button"
                          onClick={() => handlePredefinedIssueClick(issue)}
                        >
                          <span className="issue-text">{issue.problem}</span>
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      ))}
                      <button
                        className="issue-button custom-issue"
                        onClick={handleCustomIssueClick}
                      >
                        <span className="issue-text">Other issue - Describe my problem</span>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="no-messages">
                    <i className="fas fa-comments"></i>
                    <p>No messages yet. Start the conversation!</p>
                    <small>We typically reply within a few minutes</small>
                  </div>
                ) : (
                  <>
                    {showPredefinedIssues && (
                      <div className="back-to-issues">
                        <button onClick={handleShowPredefinedIssues} className="back-button">
                          <i className="fas fa-arrow-left"></i>
                          Back to common issues
                        </button>
                      </div>
                    )}
                    {messages.map((msg, index) => (
                      <div
                        key={msg._id || index}
                        className={`message ${msg.isAdmin ? 'admin-message' : 'user-message'} ${!msg.isRead && msg.isAdmin ? 'unread-message' : ''}`}
                      >
                        <div className="message-content">
                          <p>{msg.text}</p>
                          <span className="message-time">
                            {formatTime(msg.timestamp || msg.createdAt)}
                            {msg.isAdmin && !msg.isRead && <span className="read-indicator"> • Unread</span>}
                          </span>
                          {msg.isSessionOnly && <span className="session-indicator"> • Session</span>}
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {adminTyping && (
                  <div className="message admin-message typing-indicator">
                    <div className="message-content">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="typing-text">Admin is typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                <button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>

              {messages.length > 0 && (
                <div className="chat-footer">
                  <p>Chat messages are stored in this session only</p>
                  <button onClick={handleShowPredefinedIssues} className="view-more-issues">
                    View common issues
                  </button>
                  <button onClick={clearChatSession} className="clear-chat" title="Clear chat history">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;