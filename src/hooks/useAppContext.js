/**
 * @file useAppContext.js
 * @description Hook personalizado para consumir el estado global de forma segura.
 * @version 1.0.0
 */

import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useAppContext debe ser usado dentro de un AppProvider');
  }
  
  return context;
};