// Importing necessary Firebase functions
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

// Firebase configuration object
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

// Function to show messages in specific divs
const showMessage = (message, divId) => {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.textContent = message;

    setTimeout(() => {
        messageDiv.style.display = "none";
    }, 5000);
};

// Google Sign-In functionality
const googleSignInButtons = document.querySelectorAll('.fab.fa-google');
googleSignInButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if the user already exists in Firestore
            const userRef = doc(db, "users", user.uid);
            const userData = {
                email: user.email,
                firstName: user.displayName?.split(" ")[0] || "N/A",
                lastName: user.displayName?.split(" ")[1] || "N/A",
            };

            // Add user to Firestore if it doesn't exist
            await setDoc(userRef, userData, { merge: true });

            // Store user UID in localStorage
            localStorage.setItem('loggedInUserId', user.uid);

            // Show success message and redirect
            showMessage("Google Login Successful!", "signInMessage");
            window.location.href = 'profile.html';
        } catch (error) {
            console.error("Google Sign-In Error: ", error);
            showMessage("Google Sign-In failed. Please try again.", "signInMessage");
        }
    });
});

// Handling Sign Up and Sign In page toggles
const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');

signUpButton.addEventListener('click', function () {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
});
signInButton.addEventListener('click', function () {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
});

// Handling form submissions for Sign Up and Sign In
const submitSignUpButton = document.getElementById('submitSignUp');
const submitSignInButton = document.getElementById('submitSignIn');

// Sign Up logic
submitSignUpButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Storing user details in Firestore
        const userRef = doc(db, "users", user.uid);
        const userData = {
            email: user.email,
            firstName: firstName,
            lastName: lastName,
        };

        await setDoc(userRef, userData);

        // Show success message and redirect
        showMessage("Registration Successful!", "signUpMessage");
        window.location.href = 'profile.html';
    } catch (error) {
        console.error("Error signing up:", error);
        showMessage(error.message, "signUpMessage");
    }
});

// Sign In logic
submitSignInButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user UID in localStorage
        localStorage.setItem('loggedInUserId', user.uid);

        // Check if the user is an admin by email
        if (email === 'admin@gmail.com' && password === 'admin123') { // Replace with your admin email
            // Redirect to admin dashboard
            window.location.href = 'adminpage.html';
        } else {
            // Redirect to regular profile page
            window.location.href = 'profile.html';
        }

        // Show success message
        showMessage("Sign-In Successful!", "signInMessage");

    } catch (error) {
        console.error("Error signing in:", error);
        showMessage("Sign-In failed. Please try again.", "signInMessage");
    }
});

// Log out functionality
const logoutButton = document.getElementById('logoutBtn');
logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html'; // redirect to login page
    } catch (error) {
        console.error("Error logging out:", error);
        showMessage("Logout failed. Please try again.", "profileMessage");
    }
});

// Automatically manage user state and redirection
onAuthStateChanged(auth, (user) => {
    if (user) {
        // If logged in, fetch user data from Firestore and display profile
        const userRef = doc(db, "users", user.uid);
        getDoc(userRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                // Display user profile data
                document.getElementById('profileName').textContent = `${userData.firstName} ${userData.lastName}`;
                document.getElementById('profileEmail').textContent = userData.email;
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.error("Error getting user document:", error);
        });
    } else {
        // Redirect to sign-in page if user is not logged in
        window.location.href = 'index.html';
    }
});
