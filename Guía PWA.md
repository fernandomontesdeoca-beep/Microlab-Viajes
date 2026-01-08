Guía de Desarrollo PWA: Microlab-Viajes
Esta guía está personalizada para tu entorno local y tu repositorio de GitHub.
Datos del Proyecto:
Nombre: Microlab-Viajes
Ruta Local: C:\Fernando\Documents\GitHub\Microlab-Viajes
URL: https://fernandomontesdeoca-beep.github.io/Microlab-Viajes/
1. Pasos Previos (Ya realizados)
Crear proyecto Vite.
Instalar dependencias.
Configurar vite.config.js.
Corregir package.json.
2. Nueva Fase: Configurar Firebase (Crítico)
Sigue estos pasos dentro de la consola de Firebase.
Paso 2.0: Crear el Proyecto (Si aún no lo has hecho)
Dale a "Agregar proyecto".
Nombre: Microlab-Viajes.
¿Google Analytics?: Marca el interruptor para DESACTIVARLO. (Simplifica el proceso).
Dale a "Crear proyecto".
Paso 2.1: Obtener las "Llaves de Casa" (API Keys)
Dentro de tu proyecto, haz clic en la Rueda dentada (⚙️) al lado de "Información general" > Configuración del proyecto.
Baja hasta el final a la sección "Tus apps". Si no hay ninguna, haz clic en el icono </> (Web).
Ponle de nombre "Microlab Web" y regístrala.
Copia los valores que aparecen dentro de const firebaseConfig = { ... }. Los necesitarás para el archivo .env.
Paso 2.2: Habilitar Autenticación (¡Muy Importante!)
Para que la app no dé error de permisos, debemos permitir que usuarios "anónimos" entren.
En el menú izquierdo, ve a Compilación > Authentication.
Dale a "Comenzar".
Ve a la pestaña Sign-in method (o Proveedores nativos).
Busca Anónimo en la lista.
Activa el interruptor a Habilitar y dale a Guardar.
Paso 2.3: Crear la Base de Datos
En el menú izquierdo, ve a Compilación > Firestore Database.
Dale a Crear base de datos.
Elige la ubicación (la que venga por defecto está bien, ej: us-central1 o nam5).
IMPORTANTE: Cuando pregunte por las reglas de seguridad, elige "Comenzar en modo de prueba". (Esto permite leer/escribir durante 30 días sin bloqueos).
3. Configuración Local
Ahora volvemos a tu ordenador con los datos que obtuviste en el Paso 2.1.
Paso 3.1: Crear el archivo .env
En tu carpeta C:\Fernando\Documents\GitHub\Microlab-Viajes, crea un archivo nuevo llamado exactamente .env.
Pega esto y rellena con tus datos:
VITE_API_KEY=pega_tu_apiKey_aqui
VITE_AUTH_DOMAIN=microlab-viajes.firebaseapp.com
VITE_PROJECT_ID=microlab-viajes
VITE_STORAGE_BUCKET=microlab-viajes.firebasestorage.app
VITE_MESSAGING_SENDER_ID=pega_tu_messagingSenderId_aqui
VITE_APP_ID=pega_tu_appId_aqui


Paso 3.2: Actualizar App.jsx
Asegúrate de copiar el último código de App.jsx (el que te di antes) en tu archivo src/App.jsx. Recuerda descomentar la parte de "PARA TU PROYECTO LOCAL" como te indiqué.
4. Despliegue Final
Sube todo a internet:
git add .
git commit -m "Configuración completa de Firebase"
git push
npm run deploy


¡Listo! En unos minutos tu PWA estará 100% operativa.
