# Work Zone - Gestion des Travaux

Application React/TypeScript pour la gestion des travaux et zones géographiques.

## 🚀 Technologies

- **React 18** avec TypeScript
- **Zustand** pour la gestion d'état global
- **Tailwind CSS** pour le styling
- **Vite** pour le build
- **Lucide React** pour les icônes

## 📁 Architecture

```
src/
├── components/          # Composants React
│   ├── ui/            # Composants UI réutilisables
│   └── ...
├── store/             # Stores Zustand
│   ├── appStore.ts    # État global de l'application
│   └── travauxStore.ts # État des travaux
├── hooks/             # Hooks personnalisés
│   └── useApp.ts      # Hooks pour les stores
├── types/             # Types TypeScript
├── utils/             # Utilitaires
└── data/              # Données mockées
```

## 🛠️ Installation

```bash
npm install
npm run dev
```

## 📚 Documentation

- [Architecture Zustand](./docs/ARCHITECTURE.md)

## 🎯 Fonctionnalités

- ✅ Dashboard avec statistiques
- ✅ Gestion des travaux (CRUD)
- ✅ Filtrage et recherche
- ✅ Navigation par onglets
- ✅ Gestion d'état global avec Zustand
- ✅ Error Boundary
- ✅ TypeScript strict

## 🔧 Scripts

```bash
npm run dev      # Démarrage en développement
npm run build    # Build de production
npm run lint     # Linting
npm run preview  # Prévisualisation du build
```
