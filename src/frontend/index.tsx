import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ChatPage } from './pages/ChatPage';
import { AboutPage } from './pages/AboutPage';
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
  if (currentPath === '/about') {
    return <AboutPage />;
  }

  // Default to chat interface (handles / and /c/:id)
  return <ChatPage />;
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
