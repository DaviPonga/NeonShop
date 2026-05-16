import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpHNF73bsHwr7A2vTwzqpG0U_LLGF-0wg",
  authDomain: "neonshop-34942.firebaseapp.com",
  projectId: "neonshop-34942",
  storageBucket: "neonshop-34942.firebasestorage.app",
  messagingSenderId: "451667656733",
  appId: "1:451667656733:web:9a8be526c2ac7e63dec6f4",
  measurementId: "G-32GB4R3S2J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function cadastrarFirebase(nome, email, senha) {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    await addDoc(collection(db, "usuarios"), {
        uid: cred.user.uid,
        nome,
        email,
        criadoEm: serverTimestamp()
    });
    return cred.user;
}

export async function loginFirebase(email, senha) {
    const cred = await signInWithEmailAndPassword(auth, email, senha);
    return cred.user;
}

export async function logoutFirebase() {
    await signOut(auth);
}

export function observarLogin(callback) {
    onAuthStateChanged(auth, callback);
}

export async function salvarPedido(itens, total) {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não logado");
    const pedido = {
        uid: user.uid,
        email: user.email,
        itens,
        total,
        status: "pendente",
        criadoEm: serverTimestamp()
    };
    const ref = await addDoc(collection(db, "pedidos"), pedido);
    return ref.id;
}

export async function buscarMeusPedidos() {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(
        collection(db, "pedidos"),
        where("uid", "==", user.uid),
        orderBy("criadoEm", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function buscarNomeUsuario() {
    const user = auth.currentUser;
    if (!user) return null;
    const q = query(
        collection(db, "usuarios"),
        where("uid", "==", user.uid)
    );
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs[0].data().nome;
    return user.email;
}