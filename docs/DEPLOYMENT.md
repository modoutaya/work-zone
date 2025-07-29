# Déploiement sur GitHub Pages

Ce projet est configuré pour se déployer automatiquement sur GitHub Pages via GitHub Actions.

## Configuration

### Prérequis

1. **Repository GitHub** : Assurez-vous que votre projet est poussé sur GitHub
2. **GitHub Pages activé** : Dans les paramètres du repository, activez GitHub Pages
3. **Permissions** : Le workflow utilise les permissions automatiques de GitHub Actions

### Structure des fichiers

```
.github/
  workflows/
    deploy.yml          # Configuration CI/CD
public/
  _redirects           # Redirection pour SPA
vite.config.ts         # Configuration Vite pour GitHub Pages
```

## Workflow de déploiement

Le workflow `.github/workflows/deploy.yml` s'exécute automatiquement :

1. **Sur les push** vers `main` ou `master`
2. **Sur les pull requests** vers `main` ou `master`

### Étapes du workflow

1. **Checkout** : Récupération du code
2. **Setup Node.js** : Installation de Node.js 18 avec cache npm
3. **Installation** : `npm ci` pour installer les dépendances
4. **Tests** : Exécution des tests avec `npm run test`
5. **Linting** : Vérification du code avec `npm run lint`
6. **Build** : Construction de l'application avec `npm run build`
7. **Déploiement** : Upload et déploiement sur GitHub Pages

## Configuration Vite

La configuration Vite est optimisée pour GitHub Pages :

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

### Optimisations

- **Base path** : Configuré pour `/work-zone/` en production
- **Chunk splitting** : Séparation des bundles pour optimiser le chargement
- **Source maps** : Désactivés en production pour réduire la taille

## Scripts disponibles

```bash
# Vérification complète avant déploiement
npm run deploy:check

# Build pour preview
npm run build:preview

# Tests en mode watch
npm run test:watch

# Vérification des types TypeScript
npm run type-check

# Linting avec auto-correction
npm run lint:fix
```

## URL de déploiement

L'application sera disponible à l'URL :
```
https://[votre-username].github.io/work-zone/
```

## Dépannage

### Problèmes courants

1. **Build échoue** : Vérifiez les erreurs de linting et de tests
2. **404 sur les routes** : Vérifiez que le fichier `public/_redirects` est présent
3. **Assets non trouvés** : Vérifiez la configuration `base` dans `vite.config.ts`

### Logs

Les logs de déploiement sont disponibles dans :
- GitHub Actions → Votre repository → Actions → Deploy to GitHub Pages

### Rollback

Pour revenir à une version précédente :
1. Revenez au commit précédent
2. Poussez les changements
3. Le workflow se déclenche automatiquement

## Sécurité

- Les secrets ne sont pas exposés dans le build
- Les permissions sont limitées au minimum nécessaire
- Les tests et le linting s'exécutent avant chaque déploiement 