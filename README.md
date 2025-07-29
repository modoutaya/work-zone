# Work Zone - Work Management

React/TypeScript application for managing works and geographic zones.

## 🚀 Technologies

- **React 18** with TypeScript
- **Zustand** for global state management
- **Tailwind CSS** for styling
- **Vite** for build
- **Lucide React** for icons
- **Zod** for data validation
- **Vitest** for testing

## 📁 Architecture

```
src/
├── components/          # React components
│   ├── ui/            # Reusable UI components
│   ├── forms/         # Form components with validation
│   └── ...
├── store/             # Zustand stores
│   ├── appStore.ts    # Global application state
│   └── travauxStore.ts # Work state management
├── hooks/             # Custom hooks
│   ├── useApp.ts      # Store hooks
│   ├── useValidation.ts # Validation hooks
│   └── useTravauxUtils.ts # Work utility hooks
├── types/             # TypeScript types
├── utils/             # Utilities
├── schemas/           # Zod validation schemas
├── data/              # Mock data
└── test/              # Test utilities
```

## 🛠️ Installation

```bash
npm install
npm run dev
```

## 📚 Documentation

- [Zustand Architecture](./docs/ARCHITECTURE.md)

## 🎯 Features

- ✅ Dashboard with statistics
- ✅ Work management (CRUD)
- ✅ Filtering and search
- ✅ Tab navigation
- ✅ Global state management with Zustand
- ✅ Error Boundary
- ✅ TypeScript strict mode
- ✅ Data validation with Zod
- ✅ Comprehensive testing with Vitest
- ✅ Accessibility (ARIA attributes)

## 🔒 Security Features

### ✅ Input Sanitization
- **HTML Entity Encoding**: All user inputs are sanitized to prevent XSS attacks
- **Input Validation**: Zod schemas validate all form inputs
- **Type Safety**: TypeScript ensures type safety across the application
- **Sanitization Utilities**: Dedicated security utilities in `src/utils/security.ts`

### ✅ XSS Protection
- **Content Security Policy (CSP)**: Strict CSP headers configured
- **SafeText Component**: Secure text display component
- **HTML Sanitization**: All user-generated content is sanitized
- **No dangerous HTML**: No use of `dangerouslySetInnerHTML` without sanitization

### ✅ CSRF Protection
- **CSRF Tokens**: Automatic CSRF token generation and validation
- **Request Headers**: CSRF tokens included in all state-changing requests
- **Token Validation**: Timing-safe token comparison
- **Automatic Refresh**: Tokens refreshed on security events

### ✅ Content Security Policy
- **Strict CSP**: Comprehensive CSP policy implemented
- **Frame Protection**: `X-Frame-Options: DENY`
- **Content Type Protection**: `X-Content-Type-Options: nosniff`
- **XSS Protection**: `X-XSS-Protection: 1; mode=block`
- **Referrer Policy**: `strict-origin-when-cross-origin`

### Security Headers
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:* https://api.*; frame-ancestors 'none';" />
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="DENY" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
<meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()" />
```

## 🔧 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Linting
npm run preview      # Preview build
npm run test         # Run tests
npm run test:ui      # Test UI
npm run test:coverage # Test coverage
```

## 🧪 Testing

The project includes comprehensive testing with:
- Unit tests for components
- Store tests for state management
- Validation schema tests
- Integration tests

Run tests with:
```bash
npm test
```

## 🔒 Data Validation

The application uses Zod for runtime data validation:
- Form validation
- API data validation
- Type-safe schemas

## ♿ Accessibility

- ARIA attributes on interactive elements
- Screen reader support
- Keyboard navigation
- Semantic HTML structure

## 🛡️ Security Best Practices

### Input Validation
- All user inputs are validated using Zod schemas
- String inputs are sanitized to prevent XSS
- File uploads are validated for type and size
- Email and URL validation with proper regex patterns

### Output Encoding
- All user-generated content is HTML-encoded
- SafeText component for secure text display
- No direct HTML injection without sanitization

### Authentication & Authorization
- JWT token management
- Automatic token refresh
- Session timeout handling
- Secure token storage

### API Security
- CSRF protection on all state-changing requests
- Request/response interceptors
- Error handling for security events
- Rate limiting support

### Configuration Security
- Environment-based configuration
- Secure defaults
- No hardcoded secrets
- Centralized security constants
