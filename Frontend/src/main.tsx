import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import {GoogleOAuthProvider} from "@react-oauth/google"

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId='35682464992-mkg50g4afvhm1lsm1ik34937m18ju4e8.apps.googleusercontent.com'>
      <StrictMode>
        <App />
      </StrictMode>
    </GoogleOAuthProvider>
  </BrowserRouter>
)
