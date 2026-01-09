/**
 * @file Header.jsx
 * @description Encabezado de la aplicación con estado de conectividad.
 * @version 1.0.0
 */
import React from 'react';
import { Wifi, WifiOff, Settings } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';
import { Badge } from '../ui/Badge';

export const Header = () => {
  const { isOnline } = useAppContext();

  return (
    <header className="bg-indigo-600 text-white p-4 pt-8 shadow-md z-10 sticky top-0">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Microlab Viajes</h1>
          <p className="text-indigo-200 text-xs">PWA v1.0.0</p>
        </div>
        
        <div className="flex gap-2">
          <Badge color={isOnline ? 'indigo' : 'red'} icon={isOnline ? Wifi : WifiOff}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          <button className="p-1 rounded-full hover:bg-indigo-500 transition-colors">
            <Settings size={20} className="text-indigo-100" />
          </button>
        </div>
      </div>
    </header>
  );
};