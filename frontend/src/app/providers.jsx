import React from 'react';
import { AuthProvider } from '../features/auth/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default Providers;
