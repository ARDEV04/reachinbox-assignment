import React, { useState } from 'react';
import axios from 'axios';
import './ResetOneBox.css';

/**
 * ResetOneBox component - Handles resetting the OneBox data
 * 
 * @param {Object} props - Component props
 * @param {string} props.token - Authentication token
 * @param {Function} props.onResetSuccess - Callback function when reset is successful
 * @param {Function} props.onResetError - Callback function when reset fails
 * @param {Function} props.onResetStart - Callback function when reset starts
 * @param {boolean} props.showConfirmation - Whether to show a confirmation dialog before reset
 */
const ResetOneBox = ({ 
  token, 
  onResetSuccess, 
  onResetError, 
  onResetStart,
  showConfirmation = true 
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Function to handle the reset process
  const handleReset = async () => {
    // If confirmation is required and dialog is not shown yet, show it
    if (showConfirmation && !showConfirmDialog) {
      setShowConfirmDialog(true);
      return;
    }

    // Reset confirmation dialog if it was shown
    setShowConfirmDialog(false);
    
    // Set resetting state
    setIsResetting(true);
    
    // Call the onResetStart callback if provided
    if (onResetStart) {
      onResetStart();
    }
    
    try {
      // Make the API call to reset the OneBox data
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://hiring.reachinbox.xyz/api/v1/onebox/reset',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.request(config);
      console.log("Reset response:", JSON.stringify(response.data));
      
      // Call the onResetSuccess callback if provided
      if (onResetSuccess) {
        onResetSuccess(response.data);
      }
    } catch (error) {
      console.error("Error resetting OneBox data:", error);
      
      // Call the onResetError callback if provided
      if (onResetError) {
        onResetError(error);
      }
    } finally {
      setIsResetting(false);
    }
  };

  // Function to cancel reset (close confirmation dialog)
  const cancelReset = () => {
    setShowConfirmDialog(false);
  };

  // Render confirmation dialog if needed
  if (showConfirmDialog) {
    return (
      <div className="reset-confirmation">
        <p className="reset-warning">⚠️ Warning: This will reset all your OneBox data!</p>
        <p>Are you sure you want to reset all data? This action cannot be undone.</p>
        <div className="confirmation-actions">
          <button 
            className="cancel-button" 
            onClick={cancelReset}
            disabled={isResetting}
          >
            Cancel
          </button>
          <button 
            className="confirm-button" 
            onClick={handleReset}
            disabled={isResetting}
          >
            {isResetting ? 'Resetting...' : 'Confirm Reset'}
          </button>
        </div>
      </div>
    );
  }

  // Render reset button
  return (
    <button 
      className={`reset-button ${isResetting ? 'resetting' : ''}`}
      onClick={handleReset}
      disabled={isResetting}
      title="Reset OneBox Data"
    >
      {isResetting ? 'Resetting...' : 'Reset Data'}
    </button>
  );
};

export default ResetOneBox;
