import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } 
  from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

const auth = getAuth(window.dbFunctions ? window.app : undefined); // see note below

const signUpForm = document.getElementById('sign-up-form');

if (signUpForm) {
    signUpForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const signUpData = Object.fromEntries(formData.entries());

        const email = signUpData['email-input'];
        const password = signUpData['password-input'];
        const firstName = signUpData['first-name-input'];
        const lastName = signUpData['last-name-input'];

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Store the name on the auth profile itself
            await updateProfile(userCredential.user, {
                displayName: `${firstName} ${lastName}`
            });

            alert(`Success! Account created for ${firstName}.\nYou can now go log in.`);
            event.target.reset();
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('An account with this email already exists!');
            } else if (error.code === 'auth/weak-password') {
                alert('Password should be at least 6 characters.');
            } else {
                alert('Error creating account: ' + error.message);
            }
        }
    });
}

const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const loginData = Object.fromEntries(formData.entries());

        const email = loginData['email-input'];
        const password = loginData['password-input'];

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "dashboard.html";
        } catch (error) {
            alert('Incorrect email or password. Please try again.');
        }

        event.target.reset();
    });
}