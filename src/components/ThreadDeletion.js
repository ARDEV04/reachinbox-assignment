import React, { useState } from 'react';
import axios from 'axios';
import './ThreadDeletion.css';

/**
 * ThreadDeletion component - Handles the deletion of email threads
 * 
 * @param {Object} props - Component props
 * @param {Object} props.thread - The thread to be deleted
 * @param {string} props.token - Authentication token
 * @param {Function} props.onDeleteSuccess - Callback function when deletion is successful
 * @param {Function} props.onDeleteError - Callback function when deletion fails
 * @param {Function} props.onDeleteStart - Callback function when deletion starts
 * @param {boolean} props.showConfirmation - Whether to show a confirmation dialog before deletion
 */
const ThreadDeletion = ({ 
  thread, 
  token, 
  onDeleteSuccess, 
  onDeleteError, 
  onDeleteStart,
  showConfirmation = true 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Function to handle the deletion process
  const handleDelete = async () => {
    if (!thread || !thread.threadId) {
      console.error('No thread or thread ID provided for deletion');
      if (onDeleteError) {
        onDeleteError(new Error('No thread or thread ID provided for deletion'));
      }
      return;
    }

    // If confirmation is required and dialog is not shown yet, show it
    if (showConfirmation && !showConfirmDialog) {
      setShowConfirmDialog(true);
      return;
    }

    // Reset confirmation dialog if it was shown
    setShowConfirmDialog(false);
    
    // Set deleting state
    setIsDeleting(true);
    
    // Call the onDeleteStart callback if provided
    if (onDeleteStart) {
      onDeleteStart(thread);
    }
    
    try {
      // Make the API call to delete the thread
      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `https://hiring.reachinbox.xyz/api/v1/onebox/messages/${thread.threadId}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.request(config);
      console.log("Delete response:", JSON.stringify(response.data));
      
      // Call the onDeleteSuccess callback if provided
      if (onDeleteSuccess) {
        onDeleteSuccess(thread, response.data);
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
      
      // Call the onDeleteError callback if provided
      if (onDeleteError) {
        onDeleteError(error, thread);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to cancel deletion (close confirmation dialog)
  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  // Render confirmation dialog if needed
  if (showConfirmDialog) {
    return (
      <div className="thread-deletion-confirmation">
        <p>Are you sure you want to delete this thread?</p>
        <p className="thread-subject">{thread.subject || 'No Subject'}</p>
        <div className="confirmation-actions">
          <button 
            className="cancel-button" 
            onClick={cancelDelete}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            className="confirm-button" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    );
  }

  // Render delete button
  return (
    <button 
      className={`thread-delete-button ${isDeleting ? 'deleting' : ''}`}
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete Thread (D)"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
};

export default ThreadDeletion;
