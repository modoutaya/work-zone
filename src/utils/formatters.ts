export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const formatShortDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
};

export const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatType = (type: string): string => {
  const types: Record<string, string> = {
    'infrastructure': 'Infrastructure',
    'transport': 'Transport',
    'energie': 'Énergie',
    'eau': 'Eau',
    'education': 'Éducation',
    'sante': 'Santé'
  };
  return types[type] || type;
};

export const formatStatus = (status: string): string => {
  const statuses: Record<string, string> = {
    'planifie': 'Planifié',
    'en_cours': 'En cours',
    'suspendu': 'Suspendu',
    'termine': 'Terminé',
    'annule': 'Annulé'
  };
  return statuses[status] || status;
};

export const formatPriority = (priority: string): string => {
  const priorities: Record<string, string> = {
    'basse': 'Basse',
    'normale': 'Normale',
    'haute': 'Haute',
    'urgente': 'Urgente'
  };
  return priorities[priority] || priority;
};