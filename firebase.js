import { initializeApp } 
    from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import { getAuth } 
    from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD8Swwzi3c-C8qev0M0KQlIYqXEuGzx8-A",
    authDomain: "akashop-4494c.firebaseapp.com",
    projectId: "akashop-4494c",
    storageBucket: "akashop-4494c.firebasestorage.app",
    messagingSenderId: "549282431373",
    appId: "1:549282431373:web:0dd9b0d9d3932c973ebdc4"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);