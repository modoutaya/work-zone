import React from 'react';
import { Clock, AlertCircle, Pause, CheckCircle, X } from 'lucide-react';
import { STATUT_COLORS } from '../../utils/constants';
import { formatStatus } from '../../utils/formatters';

interface StatusBadgeProps {
  status: keyof typeof STATUT_COLORS;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  showIcon = true, 
  size = 'md' 
}) => {
  const getStatusIcon = (statut: string) => {
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;
    
    switch (statut) {
      case 'planifie': return <Clock size={iconSize} className="text-gray-500" />;
      case 'en_cours': return <AlertCircle size={iconSize} className="text-orange-500" />;
      case 'suspendu': return <Pause size={iconSize} className="text-red-500" />;
      case 'termine': return <CheckCircle size={iconSize} className="text-green-500" />;
      case 'annule': return <X size={iconSize} className="text-gray-500" />;
      default: return <Clock size={iconSize} className="text-gray-500" />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-2 text-base',
  };

  return (
    <div className="flex items-center gap-2">
      {showIcon && getStatusIcon(status)}
      <span className={`rounded-full font-medium ${STATUT_COLORS[status]} ${sizeClasses[size]}`}>
        {formatStatus(status)}
      </span>
    </div>
  );
};

export default StatusBadge;