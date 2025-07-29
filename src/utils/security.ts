/**
 * Security utilities for input sanitization and XSS protection
 */

// HTML entity mapping for XSS protection
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input.replace(/[&<>"'/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Sanitize user input for safe display
 * @param input - The input to sanitize
 * @returns Sanitized input
 */
export function sanitizeInput(input: unknown): string {
  if (input === null || input === undefined) {
    return '';
  }
  
  const stringInput = String(input);
  return sanitizeHtml(stringInput.trim());
}

/**
 * Validate and sanitize email address
 * @param email - Email to validate
 * @returns Sanitized email or null if invalid
 */
export function sanitizeEmail(email: string): string | null {
  const sanitized = sanitizeInput(email).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(sanitized) ? sanitized : null;
}

/**
 * Sanitize URL to prevent open redirect attacks
 * @param url - URL to sanitize
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  const sanitized = sanitizeInput(url);
  
  try {
    const parsed = new URL(sanitized);
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Generate CSRF token
 * @returns CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token
 * @param token - Token to validate
 * @param storedToken - Stored token to compare against
 * @returns True if valid
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) {
    return false;
  }
  
  // Use timing-safe comparison to prevent timing attacks
  if (token.length !== storedToken.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Escape JavaScript string for safe inclusion in scripts
 * @param str - String to escape
 * @returns Escaped string
 */
export function escapeJavaScript(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Validate file upload
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSize - Maximum file size in bytes
 * @returns Validation result
 */
export function validateFileUpload(
  file: File, 
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  maxSize: number = 5 * 1024 * 1024 // 5MB default
): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File too large' };
  }
  
  return { isValid: true };
}

/**
 * Sanitize object properties recursively
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
} 