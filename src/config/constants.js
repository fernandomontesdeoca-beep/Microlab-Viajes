/**
 * @file constants.js
 * @description Constantes globales y definiciones de reglas de negocio.
 * @version 1.0.0
 */

// Máquina de Estados del Asistente (Regla 3.B)
export const APP_STATES = {
  IDLE: 'IDLE',                 // Sin actividad, botón "Iniciar Viaje"
  TRIP_ACTIVE: 'TRIP_ACTIVE',   // En tránsito, botón "Registrar Llegada"
  VISIT_ACTIVE: 'VISIT_ACTIVE'  // En cliente, botón "Iniciar Nuevo Viaje"
};

// Colecciones de Firebase
export const COLLECTIONS = {
  USERS: 'users',
  TRIPS: 'viajes',
  VISITS: 'visitas',
  SETTINGS: 'configuracion'
};

// Valores por defecto para economía (Regla 4)
export const DEFAULT_PRICES = {
  FUEL_ANCAP: 71.89, // Ejemplo
  ELECTRICITY_UTE: 10.50
};

// Tipos de Vehículo
export const VEHICLE_TYPES = {
  COMPANY: 'Empresa',
  PERSONAL: 'Personal',
  THIRD_PARTY: 'Tercerizado'
};