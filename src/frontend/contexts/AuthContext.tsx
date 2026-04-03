import { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router';

interface User {
  id: string;
  email: string;
  createdAt: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch('/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('auth_token');
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('auth_token', data.token);
  };

  const signup = async (email: string, password: string) => {
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    const data = await response.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('auth_token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !!token,
        isAdmin: !!user?.isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to require admin privileges.
 * Redirects to login if not authenticated, or to home if not an admin.
 */
export function useRequireAdmin() {
  const { isAdmin, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else if (!isAdmin) {
        alert('Access denied: Admin privileges required');
        navigate('/', { replace: true });
      }
    }
  }, [isAdmin, loading, isAuthenticated, navigate]);

  return { isAdmin, loading, isAuthenticated };
}

/**
 * Hook to redirect authenticated users away (e.g., from login/signup pages).
 */
export function useRedirectIfAuthenticated(to = '/') {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(to, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, to]);

  return { isAuthenticated, loading };
}

/**
 * Component for admin-only routes.
 */
export function AdminRoute() {
  const { isAdmin, loading, isAuthenticated } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

/**
 * Component for routes that should only be accessible to guests.
 */
export function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
