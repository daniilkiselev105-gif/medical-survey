import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
 apiKey: "AIzaSyB30FiMevIxKh-yi2VzclbpuXk89ZwhYdI",
 authDomain: "medical-survey-7a87e.firebaseapp.com",
 projectId: "medical-survey-7a87e",
 storageBucket: "medical-survey-7a87e.firebasestorage.app",
 messagingSenderId: "676904573806",
 appId: "1:676904573806:web:304d6cd534e499194aff7f",
 measurementId: "G-CWERWZC4D5"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ГЛОБАЛЬНО

window.firebaseDB = db;
window.firebaseCollection = collection;
window.firebaseAddDoc = addDoc;
window.firebaseGetDocs = getDocs;
