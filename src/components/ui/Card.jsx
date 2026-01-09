/**
 * @file Card.jsx
 * @description Contenedor genérico con estilos base de tarjeta.
 * @version 1.0.0
 */
import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
};