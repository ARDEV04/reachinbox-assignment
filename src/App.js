import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import OneBox from './components/OneBox';
import logo from './images/image.png';
import './App.css';

// LayoutWrapper component
function LayoutWrapper({ children }) {
  const pathname = window.location.pathname;
  const isAuthPage = pathname === '/' || pathname === '/signup';

  return isAuthPage ? (
    <div className="loginContainer">
      <div className="header">
        <img src={logo} alt='reachinbox logo' />
      </div>
      <div className="loginForm">
        {children}
      </div>
      <div className="footer">
        <p>© 2023 Reachinbox. All rights reserved</p>
      </div>
    </div>
  ) : (
    children
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutWrapper><Login /></LayoutWrapper>} />
        <Route path="/signup" element={<LayoutWrapper><Signup /></LayoutWrapper>} />
        <Route path="/main" element={<OneBox />} />
      </Routes>
    </Router>
  );
}

export default App;
