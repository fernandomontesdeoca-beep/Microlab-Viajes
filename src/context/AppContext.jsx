/**
 * @file AppContext.jsx
 * @description Proveedor de estado global: Auth, Conectividad y Máquina de Estados del Asistente.
 * @version 1.0.0
 */

import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { APP_STATES, COLLECTIONS } from '../config/constants';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- Estados Globales ---
  const [user, setUser] = useState(null);
  const [appState, setAppState] = useState(APP_STATES.IDLE); // IDLE | TRIP_ACTIVE | VISIT_ACTIVE
  const [activeData, setActiveData] = useState(null); // Datos del viaje/visita actual para recuperación
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);

  // --- 1. Manejo de Conectividad (Offline First) ---
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // --- 2. Lógica de Recuperación de Sesión (Regla 3.C) ---
  const restoreSessionState = async (uid) => {
    try {
      // Prioridad 1: Buscar Viajes Activos (Sin fecha de fin)
      const tripsRef = collection(db, COLLECTIONS.TRIPS);
      const activeTripQuery = query(
        tripsRef, 
        where('userId', '==', uid),
        where('status', '==', 'active'), // Asumimos campo 'status'
        limit(1)
      );
      
      const tripSnapshot = await getDocs(activeTripQuery);
      if (!tripSnapshot.empty) {
        const tripDoc = tripSnapshot.docs[0];
        setAppState(APP_STATES.TRIP_ACTIVE);
        setActiveData({ id: tripDoc.id, ...tripDoc.data() });
        return;
      }

      // Prioridad 2: Buscar Visitas Activas (En cliente)
      const visitsRef = collection(db, COLLECTIONS.VISITS);
      const activeVisitQuery = query(
        visitsRef,
        where('userId', '==', uid),
        where('status', '==', 'active'),
        limit(1)
      );

      const visitSnapshot = await getDocs(activeVisitQuery);
      if (!visitSnapshot.empty) {
        const visitDoc = visitSnapshot.docs[0];
        setAppState(APP_STATES.VISIT_ACTIVE);
        setActiveData({ id: visitDoc.id, ...visitDoc.data() });
        return;
      }

      // Si no hay nada activo, estado IDLE
      setAppState(APP_STATES.IDLE);
      setActiveData(null);

    } catch (error) {
      console.error("Error restaurando sesión:", error);
      // En caso de error crítico (ej: offline sin caché), degradamos a IDLE por seguridad
      setAppState(APP_STATES.IDLE);
    }
  };

  // --- 3. Inicialización de Auth y App ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Auth Anónimo persistente
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Fallo Auth Anónimo:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await restoreSessionState(currentUser.uid);
      } else {
        setUser(null);
        setAppState(APP_STATES.IDLE);
        // Si no hay usuario, intentamos loguear de nuevo
        initAuth();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Objeto de valor expuesto
  const value = {
    user,
    appState,
    setAppState, // Permitimos cambiar estado manualmente desde componentes (iniciar viaje, etc)
    activeData,
    setActiveData,
    isOnline,
    loading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};