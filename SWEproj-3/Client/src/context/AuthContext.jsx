import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


// 1. Create the context
const AuthContext = createContext();

// 2. Create a custom hook to access the context
export const useAuth = () => useContext(AuthContext);

// 3. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // user object
  const [token, setToken] = useState(null);     // JWT token
  const [loading, setLoading] = useState(true); // app-wide auth loading
  

  // Load saved user and token on initial app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/v1/login', { email, password });
      const userData = res.data.user;
      const jwt = res.data.token;

      // Save in state and localStorage
      setUser(userData);
      setToken(jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', jwt);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (name, email, password, role) => {
    try {
      await axios.post('/api/v1/register', { name, email, password, role });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.get('/api/v1/logout');
    } catch (err) {
      // Ignore error
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
