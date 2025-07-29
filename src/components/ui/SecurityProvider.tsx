import React, { createContext, useContext, useEffect, useState } from 'react';
import { generateCSRFToken, validateCSRFToken } from '../../utils/security';

interface SecurityContextType {
  csrfToken: string | null;
  refreshCSRFToken: () => void;
  validateCSRFToken: (token: string) => boolean;
  isSecure: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: React.ReactNode;
}

/**
 * Security Provider that manages CSRF tokens and security headers
 */
export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isSecure, setIsSecure] = useState(false);

  // Initialize security on mount
  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = () => {
    // Generate initial CSRF token
    const token = generateCSRFToken();
    setCsrfToken(token);
    localStorage.setItem('csrf_token', token);
    
    // Check if we're in a secure context
    setIsSecure(window.location.protocol === 'https:' || window.location.hostname === 'localhost');
    
    // Set security headers
    setSecurityHeaders();
  };

  const setSecurityHeaders = () => {
    // Add security headers to document
    const meta = document.createElement('meta');
    meta.httpEquiv = 'X-Content-Type-Options';
    meta.content = 'nosniff';
    document.head.appendChild(meta);
  };

  const refreshCSRFToken = () => {
    const newToken = generateCSRFToken();
    setCsrfToken(newToken);
    localStorage.setItem('csrf_token', newToken);
  };

  const validateToken = (token: string): boolean => {
    const storedToken = localStorage.getItem('csrf_token');
    return validateCSRFToken(token, storedToken || '');
  };

  const contextValue: SecurityContextType = {
    csrfToken,
    refreshCSRFToken,
    validateCSRFToken: validateToken,
    isSecure,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

/**
 * Hook to use security context
 */
export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

/**
 * Secure component wrapper that adds security attributes
 */
export const SecureComponent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const { isSecure } = useSecurity();
  
  return (
    <div 
      className={className}
      data-secure={isSecure}
      data-csrf-protected="true"
    >
      {children}
    </div>
  );
}; 