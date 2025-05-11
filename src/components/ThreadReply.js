import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ThreadReply.css';

/**
 * ThreadReply component - Handles replying to email threads
 * 
 * @param {Object} props - Component props
 * @param {Object} props.thread - The thread to reply to
 * @param {string} props.token - Authentication token
 * @param {Function} props.onReplySuccess - Callback function when reply is successful
 * @param {Function} props.onReplyError - Callback function when reply fails
 * @param {Function} props.onReplyStart - Callback function when reply starts
 * @param {Function} props.onCancel - Callback function when reply is cancelled
 * @param {boolean} props.isOpen - Whether the reply form is open
 * @param {Object} props.defaultValues - Default values for the reply form
 */
const ThreadReply = ({ 
  thread,
  token,
  onReplySuccess,
  onReplyError,
  onReplyStart,
  onCancel,
  isOpen = false,
  defaultValues = {}
}) => {
  const [replyText, setReplyText] = useState(defaultValues.body || '');
  const [toName, setToName] = useState(defaultValues.toName || '');
  const [toEmail, setToEmail] = useState(defaultValues.to || '');
  const [fromName, setFromName] = useState(defaultValues.fromName || '');
  const [fromEmail, setFromEmail] = useState(defaultValues.from || '');
  const [subject, setSubject] = useState(defaultValues.subject || '');
  const [isSending, setIsSending] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const replyTextareaRef = useRef(null);

  // Focus on the reply textarea when the component opens
  useEffect(() => {
    if (isOpen && replyTextareaRef.current) {
      replyTextareaRef.current.focus();
    }
  }, [isOpen]);

  // Handle sending the reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    
    if (!thread || !thread.threadId) {
      console.error('No thread or thread ID provided for reply');
      if (onReplyError) {
        onReplyError(new Error('No thread or thread ID provided for reply'));
      }
      return;
    }
    
    if (!replyText.trim()) {
      if (onReplyError) {
        onReplyError(new Error('Reply text cannot be empty'));
      }
      return;
    }
    
    setIsSending(true);
    
    // Call the onReplyStart callback if provided
    if (onReplyStart) {
      onReplyStart(thread);
    }
    
    try {
      // Prepare the reply data
      const replyData = {
        body: replyText,
        // Include optional fields if they have values
        ...(toName && { toName }),
        ...(toEmail && { to: toEmail }),
        ...(fromName && { fromName }),
        ...(fromEmail && { from: fromEmail }),
        ...(subject && { subject }),
        // These fields would typically come from the thread data
        // but we're allowing them to be overridden if needed
        references: defaultValues.references || [],
        inReplyTo: defaultValues.inReplyTo || ''
      };
      
      // Make the API call to send the reply
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://hiring.reachinbox.xyz/api/v1/onebox/reply/${thread.threadId}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: replyData
      };
      
      const response = await axios.request(config);
      console.log("Reply response:", JSON.stringify(response.data));
      
      // Call the onReplySuccess callback if provided
      if (onReplySuccess) {
        onReplySuccess(response.data, thread);
      }
      
      // Reset the form
      setReplyText('');
      
      // Close the form if there's a cancel handler
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      
      // Call the onReplyError callback if provided
      if (onReplyError) {
        onReplyError(error, thread);
      }
    } finally {
      setIsSending(false);
    }
  };

  // If the component is not open, don't render anything
  if (!isOpen) {
    return null;
  }

  return (
    <div className="thread-reply">
      <h3>Reply to: {thread?.subject || 'Thread'}</h3>
      <form onSubmit={handleSendReply}>
        <div className="reply-form-header">
          <button 
            type="button" 
            className="toggle-advanced-button"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
        </div>
        
        {showAdvanced && (
          <div className="advanced-options">
            <div className="form-group">
              <label htmlFor="toName">Recipient Name:</label>
              <input
                type="text"
                id="toName"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                placeholder="Recipient Name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="toEmail">Recipient Email:</label>
              <input
                type="email"
                id="toEmail"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="recipient@example.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fromName">Sender Name:</label>
              <input
                type="text"
                id="fromName"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fromEmail">Sender Email:</label>
              <input
                type="email"
                id="fromEmail"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="your@example.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject:</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Re: Original Subject"
              />
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="replyText">Your Reply:</label>
          <textarea
            id="replyText"
            ref={replyTextareaRef}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply here..."
            rows={5}
            required
          />
        </div>
        
        <div className="reply-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="cancel-button"
            disabled={isSending}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="send-button"
            disabled={isSending || !replyText.trim()}
          >
            {isSending ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ThreadReply;
