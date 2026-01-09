/**
 * @file ControlPanel.jsx
 * @description Panel principal de acciones. Cambia según el estado (IDLE, TRIP, VISIT).
 * @version 1.0.0
 */
import React, { useState } from 'react';
import { Play, MapPin, CheckCircle, Car } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';
import { APP_STATES } from '../../config/constants';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { startTrip, endTrip } from '../../services/tripService'; // Importamos servicios reales

export const ControlPanel = () => {
  const { appState, setAppState, user, activeData, setActiveData } = useAppContext();
  const [loading, setLoading] = useState(false);

  // --- Manejadores de Acción (Simplificados para esta etapa) ---
  
  const handleStartTrip = async () => {
    setLoading(true);
    try {
      // Aquí iría un modal para pedir datos iniciales (Odómetro, etc)
      // Por ahora simulamos datos para probar el flujo
      const tripData = { odometer: 10000, vehicleId: 'default' };
      const newTrip = await startTrip(user.uid, tripData);
      
      setActiveData(newTrip);
      setAppState(APP_STATES.TRIP_ACTIVE);
    } catch (e) {
      alert("Error iniciando viaje");
    } finally {
      setLoading(false);
    }
  };

  const handleArrive = async () => {
    setLoading(true);
    try {
      // Simular fin de viaje -> Inicio Visita
      // Aquí iría modal para pedir datos finales
      await endTrip(activeData.id, { 
        odometer: 10050, 
        destination: 'Cliente Test', 
        distance: 50 
      });
      
      // Transición automática a VISITA (Regla 3.A)
      setAppState(APP_STATES.VISIT_ACTIVE);
      // Aquí deberíamos llamar a checkInClient del visitService
    } catch (e) {
      alert("Error registrando llegada");
    } finally {
      setLoading(false);
    }
  };

  const handleStartNextTrip = async () => {
    setLoading(true);
    try {
      // Cierre de visita -> Inicio nuevo viaje
      setAppState(APP_STATES.TRIP_ACTIVE);
      // Aquí lógica de checkOutClient y startTrip de nuevo
    } finally {
      setLoading(false);
    }
  };

  // --- Renderizado Condicional por Estado ---

  if (appState === APP_STATES.IDLE) {
    return (
      <Card className="bg-indigo-50 border-indigo-100">
        <div className="text-center mb-4">
          <Car size={48} className="mx-auto text-indigo-400 mb-2" />
          <h3 className="font-bold text-gray-700">Listo para salir</h3>
          <p className="text-sm text-gray-500">Inicia un nuevo recorrido</p>
        </div>
        <Button onClick={handleStartTrip} isLoading={loading}>
          <Play size={20} fill="currentColor" />
          Iniciar Viaje
        </Button>
      </Card>
    );
  }

  if (appState === APP_STATES.TRIP_ACTIVE) {
    return (
      <Card className="bg-blue-50 border-blue-100 animate-pulse-slow">
        <div className="text-center mb-4">
          <div className="animate-bounce mb-2 inline-block p-3 bg-blue-100 rounded-full text-blue-600">
            <MapPin size={32} />
          </div>
          <h3 className="font-bold text-blue-800">En Tránsito</h3>
          <p className="text-sm text-blue-600">Registrando desplazamiento...</p>
        </div>
        <Button variant="primary" className="bg-blue-600 hover:bg-blue-700" onClick={handleArrive} isLoading={loading}>
          Registrar Llegada
        </Button>
      </Card>
    );
  }

  if (appState === APP_STATES.VISIT_ACTIVE) {
    return (
      <Card className="bg-green-50 border-green-100">
        <div className="text-center mb-4">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-2" />
          <h3 className="font-bold text-gray-700">En Cliente</h3>
          <p className="text-sm text-gray-500">Visita en curso. Cronómetro activo.</p>
        </div>
        <Button variant="secondary" onClick={handleStartNextTrip} isLoading={loading}>
          <Play size={20} />
          Iniciar Siguiente Viaje
        </Button>
        <p className="text-xs text-center text-gray-400 mt-3">
          Esto cerrará la visita actual automáticamente.
        </p>
      </Card>
    );
  }

  return null;
};