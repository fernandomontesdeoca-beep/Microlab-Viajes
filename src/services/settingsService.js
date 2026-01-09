/**
 * @file settingsService.js
 * @description Gestión de configuración global (Precios, Vehículos) en Firestore.
 * @version 1.0.0
 */

import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { COLLECTIONS, DEFAULT_PRICES } from '../config/constants';

export const getSettings = async () => {
  try {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'global');
    const snap = await getDoc(settingsRef);
    
    if (snap.exists()) {
      return snap.data();
    } else {
      // Si no existe, inicializamos con defaults
      await setDoc(settingsRef, { prices: DEFAULT_PRICES, vehicles: [] });
      return { prices: DEFAULT_PRICES, vehicles: [] };
    }
  } catch (error) {
    console.error("Error obteniendo configuración:", error);
    throw error;
  }
};

export const updatePrices = async (newPrices) => {
  try {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'global');
    await updateDoc(settingsRef, {
      prices: newPrices,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error actualizando precios:", error);
    throw error;
  }
};