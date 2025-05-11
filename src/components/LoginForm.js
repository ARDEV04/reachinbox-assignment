import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleManualLogin = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (!storedUser) {
      alert('❌ No user found. Please sign up.');
      return;
    }

    if (email === storedUser.email && password === storedUser.password) {
      localStorage.setItem('user', JSON.stringify(storedUser));
      navigate('/main'); // ✅ Updated to match route
    } else {
      alert('❌ Invalid credentials');
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('✅ Google Login Success:', decoded);

      localStorage.setItem('user', JSON.stringify(decoded));
      navigate('/main'); // ✅ Updated to match route
    } catch (err) {
      console.error('Google decoding error', err);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google Login Failed');
  };

  return (
    <form className="form" onSubmit={handleManualLogin}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="password-container">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={togglePassword}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <button type="submit">Login</button>

      <div style={{ margin: '20px 0' }}>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        />
      </div>

      <div className="login-link">
        <p>
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className={location.pathname === '/signup' ? 'active' : ''}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
