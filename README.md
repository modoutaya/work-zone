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
