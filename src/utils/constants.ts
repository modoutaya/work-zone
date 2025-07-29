// Application constants
export const APP_NAME = 'Work Zone';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  RETRIES: 3,
  RATE_LIMIT: 100, // requests per minute
};

// Security Configuration
export const SECURITY_CONFIG = {
  CSRF_TOKEN_LENGTH: 32,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  PASSWORD_MIN_LENGTH: 8,
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SANITIZATION_ENABLED: true,
  XSS_PROTECTION_ENABLED: true,
  CSP_ENABLED: true,
};

// Content Security Policy
export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'http://localhost:*', 'https://api.*'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'media-src': ["'none'"],
  'worker-src': ["'self'"],
  'child-src': ["'self'"],
};

// Validation rules
export const VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 500,
  RESPONSIBLE_MIN_LENGTH: 2,
  RESPONSIBLE_MAX_LENGTH: 50,
  BUDGET_MIN: 0,
  BUDGET_MAX: 1000000000, // 1 billion
  PROGRESSION_MIN: 0,
  PROGRESSION_MAX: 100,
  DATE_FORMAT: /^\d{4}-\d{2}-\d{2}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL_REGEX: /^https?:\/\/.+/,
};

// Error messages
export const ERROR_MESSAGES = {
  VALIDATION: {
    REQUIRED: 'Ce champ est requis',
    INVALID_EMAIL: 'Adresse email invalide',
    INVALID_URL: 'URL invalide',
    TOO_SHORT: 'Trop court',
    TOO_LONG: 'Trop long',
    INVALID_FORMAT: 'Format invalide',
    INVALID_VALUE: 'Valeur invalide',
  },
  SECURITY: {
    CSRF_TOKEN_MISSING: 'Token de sécurité manquant',
    CSRF_TOKEN_INVALID: 'Token de sécurité invalide',
    SESSION_EXPIRED: 'Session expirée',
    ACCESS_DENIED: 'Accès refusé',
    INVALID_INPUT: 'Données d\'entrée invalides',
  },
  API: {
    NETWORK_ERROR: 'Erreur de réseau',
    SERVER_ERROR: 'Erreur serveur',
    TIMEOUT: 'Délai d\'attente dépassé',
    UNAUTHORIZED: 'Non autorisé',
    FORBIDDEN: 'Accès interdit',
    NOT_FOUND: 'Ressource non trouvée',
  },
};

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Données sauvegardées avec succès',
  UPDATED: 'Données mises à jour avec succès',
  DELETED: 'Données supprimées avec succès',
  CREATED: 'Élément créé avec succès',
  VALIDATION_PASSED: 'Validation réussie',
};

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  LOADING_TIMEOUT: 5000,
  TOAST_DURATION: 5000,
  PAGINATION_SIZE: 10,
  SEARCH_DELAY: 500,
};

export const STATUT_COLORS = {
  planifie: 'bg-gray-100 text-gray-800',
  en_cours: 'bg-orange-100 text-orange-800',
  suspendu: 'bg-red-100 text-red-800',
  termine: 'bg-green-100 text-green-800',
  annule: 'bg-gray-100 text-gray-800',
} as const;

export const PRIORITY_COLORS = {
  basse: 'bg-blue-100 text-blue-800',
  normale: 'bg-gray-100 text-gray-800',
  haute: 'bg-orange-100 text-orange-800',
  urgente: 'bg-red-100 text-red-800',
} as const;

export const TYPE_COLORS = {
  infrastructure: 'bg-purple-100 text-purple-800',
  transport: 'bg-blue-100 text-blue-800',
  energie: 'bg-yellow-100 text-yellow-800',
  eau: 'bg-cyan-100 text-cyan-800',
  education: 'bg-green-100 text-green-800',
  sante: 'bg-red-100 text-red-800',
} as const;

export const ZONE_TYPES = {
  département: 'Département',
  région: 'Région',
} as const;

export const TRAVAIL_TYPES = [
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'transport', label: 'Transport' },
  { value: 'energie', label: 'Énergie' },
  { value: 'eau', label: 'Eau' },
  { value: 'education', label: 'Éducation' },
  { value: 'sante', label: 'Santé' },
] as const;

export const TRAVAIL_STATUTS = [
  { value: 'planifie', label: 'Planifié' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'suspendu', label: 'Suspendu' },
  { value: 'termine', label: 'Terminé' },
  { value: 'annule', label: 'Annulé' },
] as const;

export const TRAVAIL_PRIORITIES = [
  { value: 'basse', label: 'Basse' },
  { value: 'normale', label: 'Normale' },
  { value: 'haute', label: 'Haute' },
  { value: 'urgente', label: 'Urgente' },
] as const;