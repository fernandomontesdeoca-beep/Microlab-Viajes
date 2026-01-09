/**
 * @file visitService.js
 * @description Lógica de persistencia para Visitas a Clientes.
 * @version 1.0.0
 */

import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS } from '../config/constants';

export const checkInClient = async (userId, clientData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.VISITS), {
      userId,
      checkInTime: serverTimestamp(),
      clientName: clientData.name,
      clientId: clientData.id || null, // Si viene de una lista predefinida
      status: 'active',
      notes: ''
    });
    return { id: docRef.id, ...clientData };
  } catch (error) {
    console.error("Error en Check-In:", error);
    throw error;
  }
};

export const checkOutClient = async (visitId, closingData = {}) => {
  try {
    const visitRef = doc(db, COLLECTIONS.VISITS, visitId);
    await updateDoc(visitRef, {
      checkOutTime: serverTimestamp(),
      status: 'completed',
      notes: closingData.notes || '',
      associatedExitTripId: closingData.nextTripId || null // Enlace para la regla 50/50
    });
    return true;
  } catch (error) {
    console.error("Error en Check-Out:", error);
    throw error;
  }
};