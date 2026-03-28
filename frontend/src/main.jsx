import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import ShopContextProvider from './context/ShopContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <HelmetProvider>
      <BrowserRouter>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </BrowserRouter>
    </HelmetProvider>
  </GoogleOAuthProvider >,
)