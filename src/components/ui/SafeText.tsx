import React from 'react';
import { sanitizeHtml } from '../../utils/security';

interface SafeTextProps {
  children: string;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * SafeText component that sanitizes text content to prevent XSS attacks
 */
export const SafeText: React.FC<SafeTextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'span' 
}) => {
  const sanitizedContent = sanitizeHtml(children);
  
  return (
    <Component 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

/**
 * SafeTextDisplay component for displaying user-generated content safely
 */
export const SafeTextDisplay: React.FC<{
  content: string;
  maxLength?: number;
  className?: string;
}> = ({ content, maxLength, className = '' }) => {
  const sanitizedContent = sanitizeHtml(content);
  const displayContent = maxLength && sanitizedContent.length > maxLength 
    ? sanitizedContent.substring(0, maxLength) + '...'
    : sanitizedContent;
  
  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ __html: displayContent }}
    />
  );
}; 