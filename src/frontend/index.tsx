import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router';
import { ChatPage } from './pages/ChatPage';
import { AboutPage } from './pages/AboutPage';
import { SearchPage } from './pages/SearchPage';
import { AdminPage } from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider, AdminRoute, GuestRoute } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import './styles.css';

// Add manifest link dynamically to avoid Bun trying to resolve it as a module
if (typeof document !== 'undefined') {
  const link = document.createElement('link');
  link.rel = 'manifest';
  link.href = '/manifest.json';
  document.head.appendChild(link);
}

// Register Service Worker for PWA - DISABLED
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/sw.js')
//       .then(registration => {
//         console.log('SW registered: ', registration);
//       })
//       .catch(registrationError => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }

// Unregister any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('Service worker unregistered');
    }
  });
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatPage />} />
            <Route path="/c/:id" element={<ChatPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/search" element={<SearchPage />} />
            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
