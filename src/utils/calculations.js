/**
 * @file calculations.js
 * @description Funciones puras para cálculos de costos, distancias y tiempos.
 * @version 1.0.0
 */

import { DEFAULT_PRICES } from '../config/constants';

/**
 * Calcula el costo de un viaje basado en los KM y el precio del combustible/energía.
 * @param {number} distanceKm - Distancia recorrida.
 * @param {string} vehicleType - Tipo de vehículo (para determinar eficiencia o precio).
 * @param {object} prices - Objeto con precios actuales { fuel, electricity }.
 */
export const calculateTripCost = (distanceKm, vehicleType, prices = DEFAULT_PRICES) => {
  if (!distanceKm || distanceKm < 0) return 0;
  
  // Lógica simplificada (Expandible según reglas de negocio de vehículos específicos)
  // Aquí podrías agregar un 'efficiency' por vehículo si lo tuviéramos en el futuro.
  const pricePerUnit = prices.FUEL_ANCAP; // Por defecto combustible
  
  // Supongamos un rendimiento promedio de 10km/l para simplificar por ahora, 
  // o si el precio es directo por km. Ajustar según regla real.
  // Si el precio es por Litro: (distancia / rendimiento) * precio
  const efficiency = 10; // km/l
  
  return (distanceKm / efficiency) * pricePerUnit;
};

/**
 * Aplica la regla del 50/50 para viajes entre clientes.
 * @param {number} totalCost - Costo total del viaje.
 * @returns {object} - { costForOrigin, costForDestination }
 */
export const splitCostClientToClient = (totalCost) => {
  const half = totalCost / 2;
  return {
    exitCost: half, // Se carga al cierre de la visita anterior
    entryCost: half // Se carga a la apertura de la nueva visita
  };
};

/**
 * Calcula la duración en formato legible.
 * @param {Timestamp} start - Inicio.
 * @param {Timestamp} end - Fin (o null para 'ahora').
 */
export const calculateDuration = (start, end) => {
  if (!start) return 0;
  const endTime = end ? end.toDate() : new Date();
  const startTime = start.toDate();
  const diffMs = endTime - startTime;
  
  // Retorna minutos
  return Math.floor(diffMs / 60000);
};