import {initializeApp} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
getAuth
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
getDatabase
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


const firebaseConfig={
apiKey:"AIzaSyBBmRsuGIgTEjIUhZhHexVCb-OD5lhrdhw",
authDomain:"fishtrack-edb2e.firebaseapp.com",
projectId:"fishtrack-edb2e",
storageBucket:"fishtrack-edb2e.firebasestorage.app",
messagingSenderId:"627812273743",
appId:"1:627812273743:web:3794c906f8d19af31b643a"
};


const app=initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const db=getDatabase(app);