import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmmPcWK0vmWuLz0Eg6q8_q2kjKtfw044M",
    authDomain: "shoes-85894.firebaseapp.com",
    projectId: "shoes-85894",
    storageBucket: "shoes-85894.appspot.com",
    messagingSenderId: "274479562243",
    appId: "1:274479562243:web:a2fce3a1da3fd4259a5836"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Function to display a message
const showMessage = (message, divId) => {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.textContent = message;

    setTimeout(() => {
        messageDiv.style.display = "none";
    }, 5000);
};

// Function to fetch and display user details
const displayUserDetails = async (userId) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
         if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("data",userData)
            document.getElementById("loggedUserFName").innerText = userData.firstName || "N/A";
            document.getElementById("loggedUserLName").innerText = userData.lastName || "N/A";
            document.getElementById("loggedUserEmail").innerText = userData.email || "N/A";
        } else {
            console.error("No document found for user ID:", userId);
            showMessage("No user details found.", "profileMessage");
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        showMessage("Failed to load user details. Please try again later.", "profileMessage");
    }
};

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        console.log("User authenticated. Fetching details...");
        displayUserDetails(userId);
    } else {
        console.warn("User is not logged in. Redirecting to login...");
        window.location.href = "index.html";
    }
});

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        console.log("User successfully logged out.");
        window.location.href = "register.html";
    } catch (error) {
        console.error("Error during logout:", error);
        showMessage("Failed to log out. Please try again.", "profileMessage");
    }
});
