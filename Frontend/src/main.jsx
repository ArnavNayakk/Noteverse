import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '359119550942-27r5q31ipm03ud2f609ovr5cprr79sms.apps.googleusercontent.com'; 

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  
);

