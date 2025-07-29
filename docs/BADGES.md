# Badges de Statut

Voici les badges que vous pouvez ajouter à votre README.md pour afficher le statut de votre projet :

## Badges GitHub Actions

```markdown
<!-- Statut des tests -->
![Tests](https://github.com/[votre-username]/work-zone/workflows/Test/badge.svg)

<!-- Statut du déploiement -->
![Deploy](https://github.com/[votre-username]/work-zone/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
```

## Badges de couverture de code

```markdown
<!-- Couverture de code (si vous utilisez Codecov) -->
![Codecov](https://img.shields.io/codecov/c/github/[votre-username]/work-zone)

<!-- Couverture de code (badge personnalisé) -->
![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)
```

## Badges de version et dépendances

```markdown
<!-- Version du package -->
![Version](https://img.shields.io/npm/v/work-zone)

<!-- Taille du bundle -->
![Bundle Size](https://img.shields.io/bundlephobia/min/work-zone)

<!-- Dépendances -->
![Dependencies](https://img.shields.io/david/[votre-username]/work-zone)
![Dev Dependencies](https://img.shields.io/david/dev/[votre-username]/work-zone)
```

## Badges de qualité

```markdown
<!-- Qualité du code -->
![Code Quality](https://img.shields.io/badge/code%20quality-A-brightgreen)

<!-- Sécurité -->
![Security](https://img.shields.io/badge/security-A-brightgreen)

<!-- Performance -->
![Performance](https://img.shields.io/badge/performance-A-brightgreen)
```

## Badges de plateforme

```markdown
<!-- Plateforme -->
![Platform](https://img.shields.io/badge/platform-web-blue)

<!-- Navigateurs supportés -->
![Browsers](https://img.shields.io/badge/browsers-chrome%20%7C%20firefox%20%7C%20safari%20%7C%20edge-blue)
```

## Badges de licence

```markdown
<!-- Licence -->
![License](https://img.shields.io/badge/license-MIT-blue)
```

## Exemple complet

Voici un exemple de section badges complète pour votre README.md :

```markdown
# Work Zone

[![Tests](https://github.com/[votre-username]/work-zone/workflows/Test/badge.svg)](https://github.com/[votre-username]/work-zone/actions)
[![Deploy](https://github.com/[votre-username]/work-zone/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/[votre-username]/work-zone/actions)
[![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)](https://github.com/[votre-username]/work-zone)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-web-blue)](https://[votre-username].github.io/work-zone/)

Une application moderne de gestion de travaux et de zones de travail.
```

## Configuration des badges

### Badges GitHub Actions

Les badges GitHub Actions se mettent à jour automatiquement en fonction du statut de vos workflows. Ils affichent :
- ✅ Vert : Succès
- ❌ Rouge : Échec
- 🟡 Jaune : En cours

### Badges personnalisés

Pour les badges personnalisés, vous pouvez utiliser :
- [Shields.io](https://shields.io/) pour créer des badges personnalisés
- [Badge Generator](https://badgegenerator.com/) pour générer des badges

### Intégration dans le README

Placez les badges en haut de votre README.md, juste après le titre principal. Cela donne immédiatement une idée de l'état du projet aux visiteurs. 