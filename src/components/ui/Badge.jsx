/**
 * @file Badge.jsx
 * @description Indicador de estado (Online/Offline, etc).
 * @version 1.0.0
 */
import React from 'react';

export const Badge = ({ children, color = 'indigo', icon: Icon }) => {
  const colorClasses = {
    indigo: 'bg-indigo-800 text-white',
    green: 'bg-green-100 text-green-700 border-green-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    gray: 'bg-gray-100 text-gray-600'
  };

  return (
    <div className={`flex items-center gap-2 text-xs py-1 px-3 rounded-full border ${colorClasses[color] || colorClasses.gray} border-transparent`}>
      {Icon && <Icon size={14} />}
      <span className="font-medium">{children}</span>
    </div>
  );
};