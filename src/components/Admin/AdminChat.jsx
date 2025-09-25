import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client'; // Import io directly
import './AdminChat.css';
import AxiosInstance from '../../../Axiosinstance';
import { 
  FiMoon, 
  FiSun, 
  FiSearch, 
  FiPaperclip, 
  FiDownload, 
  FiBell,
  FiSend,
  FiCheck,
  FiRefreshCw
} from 'react-icons/fi';
import { 
  IoMdClose,
  IoIosAttach
} from 'react-icons/io';
import { 
  BsCheck2All,
  BsPin,
  BsPinFill
} from 'react-icons/bs';
import { 
  RiUserStarLine
} from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userTyping, setUserTyping] = useState({});
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [activeFeature, setActiveFeature] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [file, setFile] = useState(null);
  const [socket, setSocket] = useState(null); // Local socket state
  const [socketConnected, setSocketConnected] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);

  // Quick reply templates
  const quickReplies = [
    "Hello, how can I help you?",
    "We'll get back to you shortly.",
    "Thank you for your patience.",
    "Could you please provide more details?",
    "I'll check that for you right away.",
    "Is there anything else I can help with?"
  ];

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to bottom instantly without animation
  const scrollToBottomInstant = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    // scrollToBottom();
          setTimeout(() => {
        scrollToBottomInstant();
      }, 5000);
  }, [messages]);

  // Scroll to bottom when a new user is selected
  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      // Use setTimeout to ensure DOM is updated before scrolling
      setTimeout(() => {
        scrollToBottomInstant();
      }, 5000);
    }
  }, [selectedUser, messages.length]);

  useEffect(() => {
    // Calculate unread count
    const count = users.reduce((total, user) => total + (user.hasUnread ? 1 : 0), 0);
    setUnreadCount(count);
  }, [users]);

  // Load users function - reusable
  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log("🔍 Loading users from API...");
      const response = await AxiosInstance.get('/message/admin/users');
      const usersData = response.data.users || [];
      console.log("✅ API Response received:", usersData.length, "users");
      
      setUsers(usersData);
      return usersData;
    } catch (error) {
      console.error('❌ Error loading users:', error);
      setUsers([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create socket connection on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("🔄 AdminChat - Creating direct socket connection with token:", !!token);
    
    if (token) {
      const newSocket = io('http://localhost:4000', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        console.log('✅ AdminChat socket connected:', newSocket.id);
        setSocketConnected(true);
        setSocket(newSocket);
        
        // Load users when socket connects
        loadUsers();
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ AdminChat socket connection error:', error);
        setSocketConnected(false);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('🔴 AdminChat socket disconnected:', reason);
        setSocketConnected(false);
      });

      // Set up socket event listeners
      const handleReceiveMessage = (data) => {
        console.log("📨 New message received:", data);
        
        setUsers(prev => {
          const updatedUsers = prev.map(user => 
            user._id === data.userId._id 
              ? { ...user, hasUnread: true, lastMessage: data }
              : user
          );
          return updatedUsers;
        });
        
        if (selectedUser && selectedUser._id === data.userId._id) {
          setMessages(prev => [...prev, data]);
        }
      };

      const handleAdminReply = (data) => {
        console.log("🔄 Admin reply received from other admin:", data);
        
        if (selectedUser && selectedUser._id === data.userId._id) {
          setMessages(prev => {
            const filtered = prev.filter(msg => !msg.isTemp);
            return [...filtered, data];
          });
        }
        
        setUsers(prev => {
          const updatedUsers = prev.map(user => 
            user._id === data.userId._id 
              ? { ...user, lastMessage: data }
              : user
          );
          return updatedUsers;
        });
      };

      const handleUserTyping = (data) => {
        setUserTyping(prev => ({
          ...prev,
          [data.userId]: data.isTyping
        }));
        
        if (data.isTyping) {
          setTimeout(() => {
            setUserTyping(prev => ({
              ...prev,
              [data.userId]: false
            }));
          }, 2000);
        }
      };

      const handleAdminConnected = (data) => {
        console.log("👨‍💼 Another admin connected:", data);
      };

      const handleAdminDisconnected = (data) => {
        console.log("👨‍💼 Another admin disconnected:", data);
      };

      const handleReplySent = (data) => {
        console.log("✅ Reply sent successfully:", data);
      };

      const handleReplyError = (data) => {
        console.error("❌ Reply error:", data);
      };

      // Attach event listeners
      newSocket.on("receiveMessage", handleReceiveMessage);
      newSocket.on("adminReply", handleAdminReply);
      newSocket.on("userTyping", handleUserTyping);
      newSocket.on("adminConnected", handleAdminConnected);
      newSocket.on("adminDisconnected", handleAdminDisconnected);
      newSocket.on("replySent", handleReplySent);
      newSocket.on("replyError", handleReplyError);

      setSocket(newSocket);

      // Cleanup function
      return () => {
        console.log("🧹 AdminChat cleaning up socket");
        newSocket.off("receiveMessage", handleReceiveMessage);
        newSocket.off("adminReply", handleAdminReply);
        newSocket.off("userTyping", handleUserTyping);
        newSocket.off("adminConnected", handleAdminConnected);
        newSocket.off("adminDisconnected", handleAdminDisconnected);
        newSocket.off("replySent", handleReplySent);
        newSocket.off("replyError", handleReplyError);
        newSocket.close();
      };
    } else {
      console.log("❌ No token found - cannot create socket");
    }
  }, []); // Empty dependency array - run once on mount

  // Load users on component mount
  useEffect(() => {
    console.log("🏁 AdminChat component mounted");
    loadUsers();
  }, []);

  const selectUser = async (user) => {
    console.log("👤 Selecting user:", user.name);
    setSelectedUser(user);
    setUserTyping(prev => ({ ...prev, [user._id]: false }));
    setShowSearchResults(false);
    setSearchQuery('');
    
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`/message/admin/users/${user._id}`);
      const userMessages = response.data.messages || [];
      setMessages(userMessages);
      
      const pinnedResponse = await AxiosInstance.get(`/message/pinned/${user._id}`);
      setPinnedMessages(pinnedResponse.data.pinnedMessages || []);
      
      setUsers(prev => {
        const updatedUsers = prev.map(u => 
          u._id === user._id ? { ...u, hasUnread: false } : u
        );
        return updatedUsers;
      });

      // Scroll to bottom after messages are loaded and DOM is updated
      setTimeout(() => {
        scrollToBottomInstant();
      }, 200);
    } catch (error) {
      console.error('❌ Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if ((inputMessage.trim() || file) && socket && selectedUser) {
      if (!socketConnected) {
        console.error("❌ Cannot send message: Socket not connected");
        alert("Connection lost. Please refresh the page.");
        return;
      }

      // Create temporary message
      const tempMessage = {
        _id: `temp-${Date.now()}`,
        userId: selectedUser._id,
        text: inputMessage,
        isAdmin: true,
        isTemp: true,
        createdAt: new Date(),
        isRead: true,
        ...(file && { attachment: { name: file.name, type: file.type } })
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      const formData = new FormData();
      formData.append('userId', selectedUser._id);
      formData.append('text', inputMessage);
      formData.append('timestamp', new Date());
      if (file) {
        formData.append('attachment', file);
      }
      
      try {
        console.log("📤 Sending reply via socket...");
        
        if (file) {
          const response = await AxiosInstance.post('/message/send-with-attachment', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          socket.emit("sendReply", {
            userId: selectedUser._id,
            text: inputMessage,
            timestamp: new Date(),
            attachment: response.data.message.attachment
          });
        } else {
          socket.emit("sendReply", {
            userId: selectedUser._id,
            text: inputMessage,
            timestamp: new Date()
          });
        }
        
        setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
        console.log("✅ Reply sent successfully");
      } catch (error) {
        console.error('❌ Error sending message:', error);
        setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
        alert("Failed to send message. Please try again.");
      }
      
      setInputMessage('');
      setFile(null);
      
      setUsers(prev => {
        const updatedUsers = prev.map(user => 
          user._id === selectedUser._id 
            ? { ...user, lastMessage: tempMessage }
            : user
        );
        return updatedUsers;
      });
    }
  };

  const handleTyping = (typing) => {
    if (socket && selectedUser && socketConnected) {
      socket.emit("typing", { 
        isTyping: typing,
        userId: selectedUser._id 
      });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleEmojiClick = (emojiData) => {
    setInputMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const togglePinMessage = async (messageId) => {
    try {
      const message = messages.find(msg => msg._id === messageId);
      const isCurrentlyPinned = pinnedMessages.some(msg => msg._id === messageId);
      
      if (isCurrentlyPinned) {
        // Unpin the message
        await AxiosInstance.post('/message/unpin', {
          messageId,
          userId: selectedUser._id
        });
        
        setPinnedMessages(prev => prev.filter(msg => msg._id !== messageId));
      } else {
        // Pin the message
        await AxiosInstance.post('/message/pin', {
          messageId,
          userId: selectedUser._id
        });
        
        if (message) {
          setPinnedMessages(prev => [...prev, message]);
        }
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const searchInConversation = () => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }
    
    const results = messages.filter(msg => 
      msg.text && msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const exportChatHistory = async () => {
    try {
      const response = await AxiosInstance.get(`/message/export/${selectedUser._id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `chat-history-${selectedUser._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting chat:', error);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendQuickReply = (reply) => {
    setInputMessage(reply);
    setShowQuickReplies(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  // Refresh users list
  const refreshUsers = async () => {
    console.log("Manual refresh triggered");
    await loadUsers();
  };

  return (
    <div className={`admin-chat-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Connection Status */}
      {/* <div className={`connection-status ${socketConnected ? 'connected' : 'disconnected'}`}>
        <div className="status-dot"></div>
        <span>{socketConnected ? `Connected (${socket?.id})` : 'Disconnected'}</span>
        {!socketConnected && (
          <button onClick={refreshUsers} className="reconnect-btn">
            <FiRefreshCw /> Reconnect
          </button>
        )}
      </div> */}

      <div className="users-list">
        <div className="users-header">
          <div className="header-left">
            <h3>Customer Messages</h3>
            <span className="users-count">{users.length} users</span>
            {!socketConnected && <span className="connection-warning">⚠️ Offline</span>}
          </div>
          <div className="header-actions">
            <button 
              className="icon-btn" 
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <div className="unread-indicator">
              <FiBell />
              {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
            </div>
          </div>
        </div>
        
        <div className="users-search">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="users-items">
          {loading ? (
            <div className="loading-users">
              <div className="loading-spinner-small"></div>
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="no-users">
              <RiUserStarLine />
              <p>No messages from users yet</p>
              <button onClick={refreshUsers} style={{marginTop: '10px', padding: '5px 10px'}}>
                Retry Loading
              </button>
            </div>
          ) : (
            users.map(user => (
              <div
                key={user._id}
                className={`user-item ${selectedUser?._id === user._id ? 'selected' : ''} ${user.hasUnread ? 'unread' : ''}`}
                onClick={() => selectUser(user)}
              >
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                  <div className={`user-status ${user.isOnline ? 'online' : 'offline'}`}></div>
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name || 'Unknown User'}</div>
                  <div className="user-last-message">
                    {user.lastMessage?.text || 'No messages yet'}
                  </div>
                </div>
                <div className="user-meta">
                  <div className="user-time">
                    {user.lastMessage && formatTime(user.lastMessage.createdAt)}
                  </div>
                  {user.hasUnread && <div className="unread-badge"></div>}
                  {userTyping[user._id] && (
                    <div className="typing-indicator-small">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-container">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="user-avatar" onClick={() => setShowProfileSidebar(true)}>
                  {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                  <div className={`user-status ${selectedUser.isOnline ? 'online' : 'offline'}`}></div>
                </div>
                <div>
                  <h4>{selectedUser.name || 'Unknown User'}</h4>
                  <p>
                    {selectedUser.isOnline ? 
                      'Online now' : 
                      `Last seen ${formatTime(selectedUser.lastSeen)}`
                    }
                  </p>
                </div>
              </div>
              
              <div className="chat-actions">
                {userTyping[selectedUser._id] && (
                  <div className="user-typing-text">is typing...</div>
                )}
                
                <button 
                  className="icon-btn" 
                  onClick={exportChatHistory}
                  title="Export Chat"
                >
                  <FiDownload />
                </button>
                
                <button 
                  className="icon-btn" 
                  onClick={() => setActiveFeature(activeFeature === 'search' ? null : 'search')}
                  title="Search in Conversation"
                >
                  <FiSearch />
                </button>
              </div>
            </div>

            {activeFeature === 'search' && (
              <div className="search-panel">
                <div className="search-input">
                  <FiSearch />
                  <input 
                    type="text" 
                    placeholder="Search in conversation..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchInConversation()}
                  />
                  <button onClick={searchInConversation}>Search</button>
                </div>
                
                {showSearchResults && (
                  <div className="search-results">
                    <div className="results-header">
                      <span>{searchResults.length} results found</span>
                      <button onClick={() => setShowSearchResults(false)}>
                        <IoMdClose />
                      </button>
                    </div>
                    <div className="results-list">
                      {searchResults.map((msg, index) => (
                        <div key={index} className="search-result-item">
                          <p>{msg.text}</p>
                          <span>{formatTime(msg.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {pinnedMessages.length > 0 && (
              <div className="pinned-messages">
                <div className="pinned-header">
                  <BsPin />
                  <span>Pinned Messages</span>
                </div>
                {pinnedMessages.map(msg => (
                  <div key={msg._id} className="pinned-message">
                    <p>{msg.text}</p>
                    <span>{formatTime(msg.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="chat-messages" ref={chatMessagesRef}>
              {loading ? (
                <div className="loading-messages">
                  <div className="loading-spinner"></div>
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="no-messages">
                  <RiUserStarLine />
                  <p>No messages in this conversation yet</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`message ${msg.isAdmin ? 'admin-message' : 'user-message'}`}
                  >
                    <div className="message-content">
                      {msg.attachment && (
                        <div className="message-attachment">
                          <IoIosAttach />
                          <span>{msg.attachment.name}</span>
                        </div>
                      )}
                      <p>{msg.text}</p>
                      <div className="message-footer">
                        <span className="message-time">{formatTime(msg.createdAt)}</span>
                        {msg.isAdmin && (
                          <span className="message-status">
                            {msg.isRead ? <BsCheck2All /> : <FiCheck />}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="message-actions">
                      <button 
                        className="icon-btn sm"
                        onClick={() => togglePinMessage(msg._id)}
                        title={pinnedMessages.some(m => m._id === msg._id) ? "Unpin message" : "Pin message"}
                      >
                        {pinnedMessages.some(m => m._id === msg._id) ? <BsPinFill /> : <BsPin />}
                      </button>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {showQuickReplies && (
              <div className="quick-replies-panel">
                <div className="panel-header">
                  <span>Quick Replies</span>
                  <button onClick={() => setShowQuickReplies(false)}>
                    <IoMdClose />
                  </button>
                </div>
                <div className="quick-replies-list">
                  {quickReplies.map((reply, index) => (
                    <button 
                      key={index} 
                      className="quick-reply-item"
                      onClick={() => sendQuickReply(reply)}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="chat-input">
              <div className="input-actions">
                <button 
                  className="icon-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Emoji"
                >
                  <FiPaperclip />
                </button>
                
                <button 
                  className="icon-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach file"
                >
                  <FiPaperclip />
                </button>
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                
                <button 
                  className="icon-btn"
                  onClick={() => setShowQuickReplies(!showQuickReplies)}
                  title="Quick replies"
                >
                  <FiDownload />
                </button>
              </div>
              
              <div className="message-input-container">
                {file && (
                  <div className="file-attachment">
                    <span>{file.name}</span>
                    <button onClick={removeFile}>
                      <IoMdClose />
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your reply..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                  onFocus={() => handleTyping(true)}
                  onBlur={() => handleTyping(false)}
                />
              </div>
              
              <button 
                onClick={handleSendReply} 
                disabled={!inputMessage.trim() && !file}
                className="send-button"
              >
                <FiSend />
              </button>
              
              {showEmojiPicker && (
                <div className="emoji-picker">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <RiUserStarLine />
            <h3>Select a conversation</h3>
            <p>Choose a user from the list to start chatting</p>
            {users.length === 0 && (
              <button onClick={refreshUsers} style={{marginTop: '10px', padding: '8px 16px'}}>
                <FiRefreshCw /> Load Users
              </button>
            )}
          </div>
        )}
      </div>

      {showProfileSidebar && selectedUser && (
        <div className="profile-sidebar">
          <div className="sidebar-header">
            <h3>User Profile</h3>
            <button onClick={() => setShowProfileSidebar(false)}>
              <IoMdClose />
            </button>
          </div>
          
          <div className="profile-content">
            <div className="profile-avatar">
              {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="profile-details">
              <h4>{selectedUser.name || 'Unknown User'}</h4>
              <p>{selectedUser.email || 'No email provided'}</p>
              
              <div className="detail-item">
                <span className="label">Joined</span>
                <span className="value">{formatDate(selectedUser.createdAt)}</span>
              </div>
              
              <div className="detail-item">
                <span className="label">Last Active</span>
                <span className="value">{formatTime(selectedUser.lastSeen)}</span>
              </div>
              
              <div className="detail-item">
                <span className="label">Status</span>
                <span className={`status ${selectedUser.isOnline ? 'online' : 'offline'}`}>
                  {selectedUser.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChat;