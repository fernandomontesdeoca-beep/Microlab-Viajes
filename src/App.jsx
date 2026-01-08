import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  query, 
  updateDoc
} from 'firebase/firestore';
import { 
  Plus, 
  Trash2, 
  Smartphone, 
  CheckCircle2, 
  Circle, 
  Wifi, 
  WifiOff, 
  AlertTriangle 
} from 'lucide-react';

// --- CONFIGURACIÓN INTELIGENTE (HÍBRIDA) ---
// Este bloque detecta automáticamente si estás en el Chat (Preview) o en tu PC (Local/Producción).

let firebaseConfig;
let appId;
let isConfigured = false;

// 1. Detectar Entorno de Chat/Preview
if (typeof __firebase_config !== 'undefined') {
  try {
    firebaseConfig = JSON.parse(__firebase_config);
    // Sanitizar appId para evitar errores de ruta en el entorno de prueba
    const rawAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    appId = rawAppId.replace(/[^\w-]/g, '_'); 
    isConfigured = true;
  } catch (e) {
    console.error("Error cargando config del chat", e);
  }
} 
// 2. Detectar Entorno Local/Producción (Vite)
else {
  try {
    // Usamos una referencia segura a import.meta para evitar advertencias del compilador del chat
    const env = import.meta.env || {};
    
    firebaseConfig = {
      apiKey: env.VITE_API_KEY,
      authDomain: env.VITE_AUTH_DOMAIN,
      projectId: env.VITE_PROJECT_ID,
      storageBucket: env.VITE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_MESSAGING_SENDER_ID,
      appId: env.VITE_APP_ID
    };
    
    // En producción usamos una ID fija o la del entorno
    appId = env.VITE_APP_ID || 'microlab-prod';
    isConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);
  } catch (e) {
    console.warn("No se pudo leer configuración local (esto es normal en el preview del chat).");
  }
}

// Inicializar Firebase
let app, auth, db;
if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("Error inicializando Firebase:", e);
    isConfigured = false;
  }
}

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  if (!isConfigured) {
    return <ConfigErrorScreen />;
  }

  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); 

  // 1. Manejo de Autenticación
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Prioridad al token del chat si existe, sino anónimo
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
        } else {
            await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Error de autenticación:", error);
        setLoading(false);
      }
    };

    if (auth) {
      initAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  // 2. Manejo de Conexión
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

  // 3. Sincronización de Datos
  useEffect(() => {
    if (!user || !db) return;
    
    // NOTA: Para el chat usamos 'artifacts', para local usamos ruta directa.
    // Esta lógica adapta la ruta según dónde se ejecute.
    let notesRef;
    if (typeof __firebase_config !== 'undefined') {
        // Ruta segura para el Chat
        notesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'mis_notas');
    } else {
        // Ruta limpia para Producción/Local
        notesRef = collection(db, 'users', user.uid, 'mis_notas');
    }

    const q = query(notesRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text || '',
          completed: !!data.completed,
          createdAt: data.createdAt
        };
      });
      
      notesData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setNotes(notesData);
    }, (error) => {
      console.error("Error al sincronizar datos:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // --- ACCIONES ---
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !user || !db) return;
    try {
      let notesRef;
      if (typeof __firebase_config !== 'undefined') {
          notesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'mis_notas');
      } else {
          notesRef = collection(db, 'users', user.uid, 'mis_notas');
      }

      await addDoc(notesRef, {
        text: newNote,
        completed: false,
        createdAt: serverTimestamp(),
      });
      setNewNote('');
      setView('list'); 
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const toggleComplete = async (note) => {
    if (!user || !db) return;
    let noteRef;
    if (typeof __firebase_config !== 'undefined') {
        noteRef = doc(db, 'artifacts', appId, 'users', user.uid, 'mis_notas', note.id);
    } else {
        noteRef = doc(db, 'users', user.uid, 'mis_notas', note.id);
    }
    await updateDoc(noteRef, { completed: !note.completed });
  };

  const deleteNote = async (id) => {
    if (!user || !db) return;
    let noteRef;
    if (typeof __firebase_config !== 'undefined') {
        noteRef = doc(db, 'artifacts', appId, 'users', user.uid, 'mis_notas', id);
    } else {
        noteRef = doc(db, 'users', user.uid, 'mis_notas', id);
    }
    await deleteDoc(noteRef);
  };

  // --- RENDERIZADO ---
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200">
      
      <header className="bg-indigo-600 text-white p-4 pt-8 shadow-md z-10">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold tracking-tight">Microlab Viajes</h1>
          <div className="flex items-center gap-2 text-xs bg-indigo-800 py-1 px-3 rounded-full">
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {notes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Smartphone size={48} className="mx-auto mb-4 opacity-50" />
            <p>Sin viajes registrados.</p>
            <p className="text-sm">¡Agrega uno nuevo!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div 
              key={note.id} 
              className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-all active:scale-[0.98] ${note.completed ? 'opacity-60 bg-gray-50' : ''}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button 
                  onClick={() => toggleComplete(note)}
                  className={`flex-shrink-0 ${note.completed ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'}`}
                >
                  {note.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <span className={`truncate text-gray-800 ${note.completed ? 'line-through text-gray-400' : ''}`}>
                  {note.text}
                </span>
              </div>
              <button 
                onClick={() => deleteNote(note.id)}
                className="text-gray-300 hover:text-red-500 p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </main>

      <div 
        className={`absolute bottom-0 left-0 w-full bg-white p-4 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ${view === 'add' ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <form onSubmit={handleAddNote} className="flex flex-col gap-3">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-gray-700">Nuevo Viaje/Nota</h3>
            <button 
              type="button" 
              onClick={() => setView('list')}
              className="text-gray-400 text-sm"
            >
              Cancelar
            </button>
          </div>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Detalles del viaje..."
            className="w-full bg-gray-100 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
            autoFocus={view === 'add'}
          />
          <button 
            type="submit"
            disabled={!newNote.trim()}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none active:bg-indigo-700"
          >
            Guardar
          </button>
        </form>
      </div>

      <button
        onClick={() => setView('add')}
        className={`absolute bottom-6 right-6 h-16 w-16 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-20 ${view === 'add' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <Plus size={32} strokeWidth={2.5} />
      </button>

    </div>
  );
}

// Pantalla de error si no hay config
function ConfigErrorScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-red-50 p-6 text-center">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-red-700 mb-2">Error de Configuración</h1>
      <p className="text-red-600 mb-6 max-w-sm">
        No se pudo detectar la configuración de Firebase. 
        Revisa que tengas el archivo .env y las claves correctas.
      </p>
    </div>
  );
}