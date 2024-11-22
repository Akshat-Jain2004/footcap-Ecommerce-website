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

// Google Sign-In functionality
const googleSignInButton = document.getElementById('googleSignIn');

googleSignInButton.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const db = getFirestore();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Save or update the user in Firestore
        const userRef = doc(db, "users", user.uid);
        const userData = {
            email: user.email,
            firstName: user.displayName?.split(" ")[0] || "N/A",
            lastName: user.displayName?.split(" ")[1] || "N/A",
        };
        await setDoc(userRef, userData, { merge: true });

        // Store user UID in localStorage
        localStorage.setItem('loggedInUserId', user.uid);

        // Redirect to profile page
        showMessage("Google Login Successful!", "signInMessage");
        window.location.href = 'profile.html';
    } catch (error) {
        console.error("Google Sign-In Error: ", error);
        showMessage("Google Sign-In failed. Please try again.", "signInMessage");
    }
});
