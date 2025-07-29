# Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages via GitHub Actions.

## Configuration

### Prerequisites

1. **GitHub Repository** : Make sure your project is pushed to GitHub
2. **GitHub Pages enabled** : In repository settings, enable GitHub Pages
3. **Permissions** : The workflow uses automatic GitHub Actions permissions

### File Structure

```
.github/
  workflows/
    deploy.yml          # CI/CD Configuration
public/
  _redirects           # SPA Redirect
vite.config.ts         # Vite Configuration for GitHub Pages
```

## Deployment Workflow

The `.github/workflows/deploy.yml` workflow runs automatically:

1. **On push** to `main` (automatic deployment)
2. **Tests only** on pull requests (via separate test workflow)

### Workflow Steps

1. **Checkout** : Code retrieval
2. **Setup Node.js** : Node.js 18 installation with npm cache
3. **Installation** : `npm ci` to install dependencies
4. **Tests** : Run tests with `npm run test`
5. **Linting** : Code verification with `npm run lint`
6. **Build** : Application build with `npm run build`
7. **Deployment** : Upload and deploy to GitHub Pages

## Vite Configuration

The Vite configuration is optimized for GitHub Pages:

```typescript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/work-zone/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          query: ['@tanstack/react-query'],
          ui: ['lucide-react'],
        },
      },
    },
  },
});
```

### Optimizations

- **Base path** : Configured for `/work-zone/` in production
- **Chunk splitting** : Bundle separation to optimize loading
- **Source maps** : Disabled in production to reduce size

## Available Scripts

```bash
# Complete verification before deployment
npm run deploy:check

# Preview build
npm run build:preview

# Tests in watch mode
npm run test:watch

# TypeScript type checking
npm run type-check

# Linting with auto-fix
npm run lint:fix
```

## Deployment URL

The application will be available at:
```
https://[your-username].github.io/work-zone/
```

## Troubleshooting

### Common Issues

1. **Build fails** : Check linting and test errors
2. **404 on routes** : Verify that `public/_redirects` file is present
3. **Assets not found** : Check the `base` configuration in `vite.config.ts`

### Logs

Deployment logs are available in:
- GitHub Actions → Your repository → Actions → Deploy to GitHub Pages

### Rollback

To revert to a previous version:
1. Go back to the previous commit
2. Push the changes
3. The workflow will trigger automatically

## Security

- Secrets are not exposed in the build
- Permissions are limited to the minimum necessary
- Tests and linting run before each deployment 