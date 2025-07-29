import { describe, it, expect } from 'vitest';
import {
  sanitizeHtml,
  sanitizeInput,
  sanitizeEmail,
  sanitizeUrl,
  generateCSRFToken,
  validateCSRFToken,
  escapeJavaScript,
  validateFileUpload,
  sanitizeObject,
} from '../security';

describe('Security Utils', () => {
  describe('sanitizeHtml', () => {
    it('should escape HTML entities', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
      expect(sanitizeHtml('&<>"\'/')).toBe('&amp;&lt;&gt;&quot;&#x27;&#x2F;');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeHtml(null as any)).toBe('');
      expect(sanitizeHtml(undefined as any)).toBe('');
      expect(sanitizeHtml(123 as any)).toBe('');
    });

    it('should preserve safe content', () => {
      expect(sanitizeHtml('Hello World')).toBe('Hello World');
      expect(sanitizeHtml('123')).toBe('123');
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize and trim input', () => {
      expect(sanitizeInput('  <script>alert("xss")</script>  ')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('should handle null and undefined', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('should convert non-string to string', () => {
      expect(sanitizeInput(123)).toBe('123');
      expect(sanitizeInput(true)).toBe('true');
    });
  });

  describe('sanitizeEmail', () => {
    it('should validate and sanitize valid emails', () => {
      expect(sanitizeEmail('test@example.com')).toBe('test@example.com');
      expect(sanitizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com');
    });

    it('should reject invalid emails', () => {
      expect(sanitizeEmail('invalid-email')).toBeNull();
      expect(sanitizeEmail('test@')).toBeNull();
      expect(sanitizeEmail('@example.com')).toBeNull();
      expect(sanitizeEmail('')).toBeNull();
    });

    it('should sanitize email content', () => {
      expect(sanitizeEmail('test<script>@example.com')).toBe('test&lt;script&gt;@example.com');
    });
  });

  describe('sanitizeUrl', () => {
    it('should validate and sanitize valid URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://&/#x2F;&#x2F;example.com');
      expect(sanitizeUrl('http://localhost:3000')).toBe('http://&/#x2F;&#x2F;localhost:3000');
    });

    it('should reject invalid URLs', () => {
      expect(sanitizeUrl('not-a-url')).toBeNull();
      expect(sanitizeUrl('ftp://example.com')).toBeNull();
      expect(sanitizeUrl('javascript:alert("xss")')).toBeNull();
    });

    it('should sanitize URL content', () => {
      expect(sanitizeUrl('https://example<script>.com')).toBe('https://&/#x2F;&#x2F;example&lt;script&gt;.com');
    });
  });

  describe('generateCSRFToken', () => {
    it('should generate a valid token', () => {
      const token = generateCSRFToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
    });

    it('should generate unique tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('validateCSRFToken', () => {
    it('should validate matching tokens', () => {
      const token = generateCSRFToken();
      expect(validateCSRFToken(token, token)).toBe(true);
    });

    it('should reject non-matching tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(validateCSRFToken(token1, token2)).toBe(false);
    });

    it('should handle empty tokens', () => {
      expect(validateCSRFToken('', '')).toBe(false);
      expect(validateCSRFToken('token', '')).toBe(false);
      expect(validateCSRFToken('', 'token')).toBe(false);
    });

    it('should be timing-safe', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      
      const start1 = performance.now();
      validateCSRFToken(token1, token1);
      const time1 = performance.now() - start1;
      
      const start2 = performance.now();
      validateCSRFToken(token1, token2);
      const time2 = performance.now() - start2;
      
      // Times should be similar (within 10ms)
      expect(Math.abs(time1 - time2)).toBeLessThan(10);
    });
  });

  describe('escapeJavaScript', () => {
    it('should escape JavaScript special characters', () => {
      expect(escapeJavaScript('alert("xss")')).toBe('alert(\\"xss\\")');
      expect(escapeJavaScript("alert('xss')")).toBe('alert(\\\'xss\\\')');
      expect(escapeJavaScript('line1\nline2')).toBe('line1\\nline2');
    });

    it('should handle empty strings', () => {
      expect(escapeJavaScript('')).toBe('');
    });
  });

  describe('validateFileUpload', () => {
    const mockFile = (name: string, type: string, size: number): File => {
      return {
        name,
        type,
        size,
        lastModified: Date.now(),
      } as File;
    };

    it('should validate valid files', () => {
      const file = mockFile('test.jpg', 'image/jpeg', 1024);
      const result = validateFileUpload(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid file types', () => {
      const file = mockFile('test.exe', 'application/x-executable', 1024);
      const result = validateFileUpload(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File type not allowed');
    });

    it('should reject oversized files', () => {
      const file = mockFile('large.jpg', 'image/jpeg', 10 * 1024 * 1024);
      const result = validateFileUpload(file, undefined, 5 * 1024 * 1024);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File too large');
    });

    it('should handle null file', () => {
      const result = validateFileUpload(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('No file provided');
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize string properties', () => {
      const input = {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com',
        age: 25,
      };
      
      const result = sanitizeObject(input);
      expect(result.name).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
      expect(result.email).toBe('test@example.com');
      expect(result.age).toBe(25);
    });

    it('should handle nested objects', () => {
      const input = {
        user: {
          name: '<script>alert("xss")</script>',
          email: 'test@example.com',
        },
        settings: {
          theme: 'dark',
        },
      };
      
      const result = sanitizeObject(input);
      expect(result.user.name).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
      expect(result.user.email).toBe('test@example.com');
      expect(result.settings.theme).toBe('dark');
    });

    it('should handle arrays', () => {
      const input = {
        tags: ['<script>alert("xss")</script>', 'safe-tag'],
        numbers: [1, 2, 3],
      };
      
      const result = sanitizeObject(input);
      expect(result.tags[0]).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
      expect(result.tags[1]).toBe('safe-tag');
      expect(result.numbers).toEqual([1, 2, 3]);
    });
  });
}); 