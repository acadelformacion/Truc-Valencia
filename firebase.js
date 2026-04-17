// --- Firebase (config + DB + sesión de sala) ---------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  remove,
  onValue,
  runTransaction,
  onDisconnect,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBHQ3hSWToVKzADI9eUlCNONbi_lN_TTAI",
  authDomain: "trucvalencia-12345.firebaseapp.com",
  databaseURL:
    "https://trucvalencia-12345-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "trucvalencia-12345",
  storageBucket: "trucvalencia-12345.firebasestorage.app",
  messagingSenderId: "922530958932",
  appId: "1:922530958932:web:84fe1d9386f5ea2d6f67c1",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase();
export const auth = getAuth(app);

/** Referencias mutables compartidas entre módulos (misma referencia de objeto) */
export const session = {
  roomRef: null,
  roomCode: null,
  mySeat: null,
};

const clone = (o) => JSON.parse(JSON.stringify(o));

export async function mutate(fn, getDefaultState) {
  if (!session.roomRef) return null;
  try {
    return await runTransaction(
      session.roomRef,
      (cur) => {
        if (!cur) return cur;
        const next = clone(cur);
        if (!next.state) next.state = getDefaultState();
        next.lastActivity = Date.now();
        if (fn(next.state) === false) return;
        return next;
      },
      { applyLocally: false },
    );
  } catch (e) {
    console.error("mutate:", e);
    return null;
  }
}

export { ref, get, set, push, remove, onValue, runTransaction, onDisconnect };
export {
  GoogleAuthProvider,
  signInWithCredential,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
};
