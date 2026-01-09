/**
 * @file MainLayout.jsx
 * @description Wrapper principal que centra la app en escritorio.
 * @version 1.0.0
 */
import React from 'react';
import { Header } from './Header';

export const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 relative">
        {children}
      </main>
    </div>
  );
};