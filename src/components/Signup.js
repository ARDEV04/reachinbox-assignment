import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from './SignupForm'; // Adjust path if needed

function Signup() {
  return (
    <div className="signup-page">
      <SignupForm />
      <div className="login-link">
        <p>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
