import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId="554332420687-1mc1qm5j08mej1hphlds0ufen6rrqei6.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
