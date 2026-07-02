const firebaseConfig = {
    apiKey: "AIzaSyCQbwAP9C9d_VJJpBPsSRfhYGSI8Tv7W3o",
    authDomain: "robotica-sustentavel.firebaseapp.com",
    projectId: "robotica-sustentavel",
    storageBucket: "robotica-sustentavel.firebasestorage.app",
    messagingSenderId: "94454399506",
    appId: "1:94454399506:web:85f38aea117501a6128ecb"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Cria a referência global para o banco de dados (Firestore)
window.db = firebase.firestore();