import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router";

// Apply initial theme class to prevent flash
const savedTheme = localStorage.getItem('theme') || 'dark';

// Clear any existing theme classes first
document.documentElement.classList.remove('light', 'dark');
document.body.classList.remove('light', 'dark');

// Apply the saved theme
document.documentElement.classList.add(savedTheme);
document.body.classList.add(savedTheme);

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
