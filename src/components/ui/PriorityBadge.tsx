import React from 'react';
import { PRIORITY_COLORS } from '../../utils/constants';
import { formatPriority } from '../../utils/formatters';

interface PriorityBadgeProps {
  priority: keyof typeof PRIORITY_COLORS;
  size?: 'sm' | 'md' | 'lg';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ 
  priority, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-2 text-base',
  };

  return (
    <span className={`rounded-full font-medium ${PRIORITY_COLORS[priority]} ${sizeClasses[size]}`}>
      {formatPriority(priority)}
    </span>
  );
};

export default PriorityBadge;