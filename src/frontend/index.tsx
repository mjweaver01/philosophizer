import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ChatPage } from './pages/ChatPage';
import { AboutPage } from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './contexts/AuthContext';
import './styles.css';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route based on path
  if (currentPath === '/login') {
    return <LoginPage />;
  }

  if (currentPath === '/signup') {
    return <SignupPage />;
  }

  if (currentPath === '/about') {
    return <AboutPage />;
  }

  // Default to chat interface (handles / and /c/:id)
  return <ChatPage />;
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
