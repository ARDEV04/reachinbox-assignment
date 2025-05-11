// Fix the imports - remove useRef if not needed, add useCallback
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './OneBox.css';
import ThreadDeletion from './ThreadDeletion';
import ThreadReply from './ThreadReply';
import ResetOneBox from './ResetOneBox';

function OneBox() {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeComponent, setActiveComponent] = useState('threadList');
  const [searchThreadId, setSearchThreadId] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Add the theme state
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    return localStorage.getItem('theme') || 'light';
  });

  // Use the correct token that works in other components
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoibW9udXJhbmphbjI1MUBnbWFpbC5jb20iLCJpZCI6MTU3OSwiZmlyc3ROYW1lIjoiQmlub2QiLCJsYXN0TmFtZSI6IkJoYWkifSwiaWF0IjoxNzQ2OTgwNTkyLCJleHAiOjE3Nzg1MTY1OTJ9.DrALXAi4YICQv0USd6W0S8f4yCleWM2z5pLSM1MaE-0';

  // Add the useEffect for theme
  useEffect(() => {
    // Set the data-theme attribute on the document element
    document.documentElement.setAttribute('data-theme', theme);
    // Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Add the toggleTheme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Make the API call when the component mounts
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        console.log("Fetching threads..."); // Debug log
        
        // Use the exact same configuration as in the working getThreads.js
        const config = {
          method: 'get',
          url: 'https://hiring.reachinbox.xyz/api/v1/onebox/list',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        const response = await axios(config);
        
        // Debug log for response
        console.log("API Response:", response);

        if (response.data && response.data.data) {
          setThreads(response.data.data);
        } else {
          setError('No threads found.');
        }
      } catch (err) {
        console.error('Error fetching threads:', err);
        if (err.response) {
          console.error(`Status: ${err.response.status}`);
          console.error("Response:", err.response.data);
          setError(`Failed to fetch threads: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
        } else if (err.request) {
          console.error("No response received:", err.request);
          setError('No response received from server.');
        } else {
          console.error("Error:", err.message);
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  // Handle reply thread action
  const handleReplyThread = useCallback(() => {
    setShowReplyBox(true);
    setNotification({
      type: 'info',
      message: 'Reply box opened (Shortcut: R)'
    });
  }, [setShowReplyBox, setNotification]);

  // Keyboard shortcuts handler with proper dependencies
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only apply shortcuts when not typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Only apply shortcuts when in thread messages view
      if (activeComponent === 'threadMessages' && selectedThread) {
        if (e.key === 'd' || e.key === 'D') {
          // Find and click the delete button from ThreadDeletion component
          document.querySelector('.thread-delete-button')?.click();
        } else if (e.key === 'r' || e.key === 'R') {
          handleReplyThread();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeComponent, selectedThread, handleReplyThread]);

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch messages for a specific thread
  const fetchThreadMessages = async (threadId) => {
    setMessageLoading(true);
    setError(null); // Clear any previous errors
    try {
      console.log(`Fetching messages for thread ${threadId}...`);
      
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://hiring.reachinbox.xyz/api/v1/onebox/messages/${threadId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios(config);
      console.log("Thread Messages Response:", response);

      if (response.data && response.data.data) {
        setThreadMessages(response.data.data);
        // Find the thread in our list to set as selected
        const thread = threads.find(t => t.threadId === threadId);
        if (thread) {
          setSelectedThread(thread);
        } else {
          // If thread not found in our list, create a minimal thread object
          setSelectedThread({ threadId, subject: `Thread #${threadId}` });
        }
        setActiveComponent('threadMessages');
      } else {
        setError('No messages found for this thread.');
      }
    } catch (err) {
      console.error('Error fetching thread messages:', err);
      setError(`Failed to fetch thread messages: ${err.message}`);
    } finally {
      setMessageLoading(false);
    }
  };

  // Handle thread selection
  const handleThreadSelect = (thread) => {
    setSelectedThread(thread);
    fetchThreadMessages(thread.threadId);
  };

  // Handle thread ID search
  const handleThreadSearch = (e) => {
    e.preventDefault();
    if (searchThreadId.trim()) {
      fetchThreadMessages(searchThreadId.trim());
    }
  };

  // Render the active component based on state
  const renderActiveComponent = () => {
    if (loading && activeComponent === 'threadList') return <p>Loading threads...</p>;
    if (error) return <p className="error-message">Error: {error}</p>;

    switch (activeComponent) {
      case 'threadList':
        return (
          <>
            <h2>Email Threads</h2>
            {threads.length === 0 ? (
              <p>No threads available.</p>
            ) : (
              <ThreadListDisplay 
                threads={threads} 
                onSelectThread={handleThreadSelect}
              />
            )}
          </>
        );
      case 'threadMessages':
        if (messageLoading) return <p>Loading messages...</p>;
        return (
          <>
            <div className="thread-header">
              <button 
                className="back-button" 
                onClick={() => {
                  setActiveComponent('threadList');
                  setShowReplyBox(false);
                }}
              >
                ← Back to Threads
              </button>
              <h2>{selectedThread?.subject || 'Thread Messages'}</h2>
              <div className="thread-actions">
                <ThreadDeletion 
                  thread={selectedThread}
                  token={token}
                  onDeleteStart={(thread) => {
                    setNotification({
                      type: 'info',
                      message: `Deleting thread "${thread.subject}"...`
                    });
                  }}
                  onDeleteSuccess={(thread, data) => {
                    setNotification({
                      type: 'success',
                      message: `Thread "${thread.subject}" deleted successfully (Shortcut: D)`
                    });
                    
                    // Remove the thread from the local state
                    setThreads(threads => threads.filter(t => t.threadId !== thread.threadId));
                    
                    // Go back to thread list after deletion
                    setActiveComponent('threadList');
                  }}
                  onDeleteError={(error, thread) => {
                    setNotification({
                      type: 'error',
                      message: `Failed to delete thread: ${error.response?.data?.message || error.message}`
                    });
                  }}
                  showConfirmation={true}
                />
                <button 
                  className="action-button reply-button" 
                  onClick={handleReplyThread}
                  title="Reply to Thread (R)"
                >
                  Reply
                </button>
              </div>
              <form onSubmit={handleThreadSearch} className="thread-search-form">
                <input
                  type="text"
                  value={searchThreadId}
                  onChange={(e) => setSearchThreadId(e.target.value)}
                  placeholder="Search by Thread ID"
                  className="thread-search-input"
                />
                <button type="submit" className="thread-search-button">Search</button>
              </form>
            </div>
            
            <ThreadReply
              thread={selectedThread}
              token={token}
              isOpen={showReplyBox}
              onReplyStart={(thread) => {
                setNotification({
                  type: 'info',
                  message: `Sending reply to "${thread.subject}"...`
                });
              }}
              onReplySuccess={(data, thread) => {
                setNotification({
                  type: 'success',
                  message: 'Reply sent successfully!'
                });
                
                // Refresh the thread messages to include the new reply
                fetchThreadMessages(thread.threadId);
              }}
              onReplyError={(error, thread) => {
                setNotification({
                  type: 'error',
                  message: `Failed to send reply: ${error.response?.data?.message || error.message}`
                });
              }}
              onCancel={() => setShowReplyBox(false)}
              defaultValues={{
                // You can pre-populate these values based on the selected thread
                subject: `Re: ${selectedThread?.subject || ''}`,
                // Add other default values as needed
              }}
            />
            
            {threadMessages.length === 0 ? (
              <p>No messages available for this thread.</p>
            ) : (
              <ThreadMessagesDisplay messages={threadMessages} />
            )}
          </>
        );
      default:
        return <p>Select a component from the sidebar</p>;
    }
  };

  return (
    <div className="onebox-layout">
      <div className="onebox-sidebar">
  <div className="onebox-header">
    <h3>OneBox</h3>
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  </div>
  
  <ul>
    <li 
      className={activeComponent === 'threadList' ? 'active' : ''}
      onClick={() => setActiveComponent('threadList')}
    >
      Thread List
    </li>
    <li 
      className={activeComponent === 'threadMessages' ? 'active' : ''}
      onClick={() => {
        if (selectedThread) {
          setActiveComponent('threadMessages');
        } else {
          setActiveComponent('threadMessages');
          setThreadMessages([]);
        }
      }}
    >
      Thread Messages
    </li>
    {/* Add more menu items here as needed */}
  </ul>
  
  <div className="sidebar-actions">
    <ResetOneBox 
      token={token}
      onResetStart={() => {
        setNotification({
          type: 'info',
          message: 'Resetting OneBox data...'
        });
      }}
      onResetSuccess={(data) => {
        setNotification({
          type: 'success',
          message: 'OneBox data reset successfully!'
        });
        
        // Clear thread messages
        setThreadMessages([]);
        
        // Clear selected thread
        setSelectedThread(null);
        
        // Close reply box if open
        setShowReplyBox(false);
        
        // Go back to thread list
        setActiveComponent('threadList');
        
        // Refresh the threads list
        setLoading(true);
        
        // Fetch threads again
        const fetchThreads = async () => {
          try {
            const config = {
              method: 'get',
              url: 'https://hiring.reachinbox.xyz/api/v1/onebox/list',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            
            const response = await axios(config);
            
            if (response.data && response.data.data) {
              setThreads(response.data.data);
            } else {
              setError('No threads found.');
            }
          } catch (err) {
            console.error('Error fetching threads:', err);
            setError(`Failed to fetch threads: ${err.message}`);
          } finally {
            setLoading(false);
          }
        };

        fetchThreads();
      }}
      onResetError={(error) => {
        setNotification({
          type: 'error',
          message: `Failed to reset data: ${error.response?.data?.message || error.message}`
        });
      }}
      showConfirmation={true}
    />
  </div>
  
  <div className="keyboard-shortcuts">
    <h4>Keyboard Shortcuts</h4>
    <ul>
      <li><strong>D</strong> - Delete thread</li>
      <li><strong>R</strong> - Reply to thread</li>
    </ul>
  </div>
</div>
      <div className="onebox-main-content">
        {renderActiveComponent()}
      </div>
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

// Component to display threads
function ThreadListDisplay({ threads, onSelectThread }) {
  return (
    <div className="threads-list">
      {threads.map((thread) => (
        <div 
          key={thread.id || thread.threadId} 
          className="thread-card"
          onClick={() => onSelectThread(thread)}
        >
          <h3>{thread.subject || 'No Subject'}</h3>
          <p>{thread.body ? thread.body.substring(0, 100) + '...' : 'No body available'}</p>
          <p><strong>Thread ID:</strong> {thread.threadId}</p>
          {thread.fromName && <p><strong>From:</strong> {thread.fromName}</p>}
          {thread.toEmail && <p><strong>To:</strong> {thread.toEmail}</p>}
          <div className="view-thread">View Messages →</div>
        </div>
      ))}
    </div>
  );
}

// Component to display thread messages
function ThreadMessagesDisplay({ messages }) {
  return (
    <div className="thread-messages">
      {messages.map((message, index) => (
        <div key={message.id || index} className="message-card">
          <div className="message-header">
            <div className="message-from">
              <strong>From:</strong> {message.fromName || message.from || 'Unknown'}
            </div>
            <div className="message-to">
              <strong>To:</strong> {message.toName || message.to || 'Unknown'}
            </div>
            <div className="message-date">
              {new Date(message.date).toLocaleString()}
            </div>
          </div>
          <div className="message-subject">
            <strong>Subject:</strong> {message.subject || 'No Subject'}
          </div>
          <div 
            className="message-body"
            dangerouslySetInnerHTML={{ __html: message.body || 'No content' }}
          />
        </div>
      ))}
    </div>
  );
}

export default OneBox;
