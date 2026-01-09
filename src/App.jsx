/**
 * @file App.jsx
 * @description Punto de entrada limpio. Integra el Contexto y el Layout.
 * @version 1.0.1
 */
import React from 'react';
import { AppProvider } from './context/AppContext'; // Solo importamos el Provider de aquí
import { useAppContext } from './hooks/useAppContext'; // EL HOOK VIENE DE AQUÍ
import { MainLayout } from './components/layout/MainLayout';
import { ControlPanel } from './components/features/ControlPanel';
import { Loader2 } from 'lucide-react';

// Componente interno para manejar loading del contexto
const AppContent = () => {
  const { loading } = useAppContext();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Sincronizando...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Panel de Control Principal (Máquina de Estados) */}
        <section>
          <ControlPanel />
        </section>

        {/* Historial o Lista de Viajes (Placeholder) */}
        <section>
          <h3 className="font-bold text-gray-700 mb-3 px-1">Actividad Reciente</h3>
          <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-100 border-dashed">
            <p>Aquí se cargará la lista de viajes</p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}