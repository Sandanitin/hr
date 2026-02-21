import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Demo credentials – all users belong to the same company (Vikrin)
    const users = {
      'super@demo.com': {
        email: 'super@demo.com',
        role: 'ADMIN',
        name: 'Super Admin',
        company: 'Vikrin',
        companyId: 1,
      },
      'hr@demo.com': {
        email: 'hr@demo.com',
        role: 'HR',
        name: 'HR Manager',
        company: 'Vikrin',
        companyId: 1,
      },
      'manager@demo.com': {
        email: 'manager@demo.com',
        role: 'MANAGER',
        name: 'Team Manager',
        company: 'Vikrin',
        companyId: 1,
      },
      'employee@demo.com': {
        email: 'employee@demo.com',
        role: 'EMPLOYEE',
        name: 'Ravi Kumar',
        company: 'Vikrin',
        companyId: 1,
      },
    };

    if (users[email] && password === 'demo123') {
      const userData = users[email];
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'Invalid credentials. Use demo123 as password.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
