/**
 * @file tripService.js
 * @description Lógica de persistencia para Viajes (Desplazamientos).
 * @version 1.0.0
 */

import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS } from '../config/constants';

/**
 * Inicia un nuevo viaje.
 * @param {string} userId - ID del usuario.
 * @param {object} initialData - Datos iniciales (odómetro inicio, vehículo, origen).
 */
export const startTrip = async (userId, initialData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.TRIPS), {
      userId,
      startTime: serverTimestamp(),
      startOdometer: Number(initialData.odometer),
      vehicleId: initialData.vehicleId,
      origin: initialData.origin || 'Ubicación Desconocida',
      status: 'active', // Para recuperación de sesión
      ...initialData
    });
    return { id: docRef.id, ...initialData };
  } catch (error) {
    console.error("Error iniciando viaje:", error);
    throw error;
  }
};

/**
 * Finaliza un viaje activo.
 * @param {string} tripId - ID del viaje.
 * @param {object} finalData - Datos finales (odómetro fin, destino).
 */
export const endTrip = async (tripId, finalData) => {
  try {
    const tripRef = doc(db, COLLECTIONS.TRIPS, tripId);
    
    // Aquí se podrían calcular KM automáticamente si tenemos el startOdometer
    // Pero por seguridad, solo guardamos los datos. El cálculo se hace en UI o Cloud Function.
    
    await updateDoc(tripRef, {
      endTime: serverTimestamp(),
      endOdometer: Number(finalData.odometer),
      destination: finalData.destination,
      status: 'completed',
      distance: finalData.distance, // Calculado en el cliente (end - start)
      ...finalData
    });
    return true;
  } catch (error) {
    console.error("Error finalizando viaje:", error);
    throw error;
  }
};