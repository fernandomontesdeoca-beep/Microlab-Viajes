/**
 * @file version.js
 * @description Centraliza la versión de la aplicación para control de cambios.
 * @version 1.0.0
 */

export const APP_VERSION = "1.0.0";
export const BUILD_DATE = new Date().toISOString();

export const logVersion = () => {
  console.info(`%c Microlab-Viajes v${APP_VERSION} `, 'background: #4f46e5; color: #fff; border-radius: 4px; padding: 4px;');
};