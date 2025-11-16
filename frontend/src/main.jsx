import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";
import './index.css'
import UserProvider from "./context/UserContext.jsx";
import { Toaster } from "react-hot-toast"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider> 
        <App />
        <Toaster 
          position="bottom-center"
        />
      </UserProvider> 
    </BrowserRouter>
  </StrictMode>,
)
