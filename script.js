const signUpForm = document.getElementById('sign-up-form');

if (signUpForm) {
    signUpForm.addEventListener('submit', (event) => {
        //Stops refreshing the page
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const signUpData = Object.fromEntries(formData.entries());

        const email = signUpData['email-input'];
        const password = signUpData['password-input'];
        const firstName = signUpData['first-name-input'];
        const lastName = signUpData['last-name-input'];

        //Parse the data with a fallback of [] in case there's nothing there
        let existingUsers = [];

        // Function to fetch the fleet from the cloud
        async function loadUsersFromCloud() {
        try {
            const fleetCollection = window.dbFunctions.collection(window.db, "appUsers");
            const snapshot = await window.dbFunctions.getDocs(fleetCollection);
            
            // Clear and rebuild the local array with cloud data
            fleet = snapshot.docs.map(doc => ({
            id: doc.id,         // Keeps track of Firebase's unique ID for each plane
            ...doc.data()       // Spreads out your original item properties
            }));

            console.log("Cloud users loaded successfully:", fleet);
            
            // CRITICAL: Call whatever function you use to display the UI here!
            // Example: renderFleetUI(); 

        } catch (error) {
            console.error("Error loading users from cloud:", error);
        }
        }

        // Call the function immediately to fetch your data on page load
        loadUsersFromCloud();


        //Check if hte email exists by doing .some 
        const emailExists = existingUsers.some(user => user.email === email);
        if (emailExists) {
            alert('An account with this email already exists!');
            return;
        }
        //If not existing, then .push to existingUsers with the data
        existingUsers.push({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });
        //overwrites old databse with new text string
        localStorage.setItem('appUsers', JSON.stringify(existingUsers));

        alert(`Success! Account created for ${firstName}.\nYou can now go log in.`);
        event.target.reset();
    });
}

const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const loginData = Object.fromEntries(formData.entries());

        const email = loginData['email-input'];
        const password = loginData['password-input'];

        let existingUsers = [];

        // Function to fetch the fleet from the cloud
        async function loadUsersFromCloud() {
        try {
            const fleetCollection = window.dbFunctions.collection(window.db, "appUsers");
            const snapshot = await window.dbFunctions.getDocs(fleetCollection);
            
            // Clear and rebuild the local array with cloud data
            fleet = snapshot.docs.map(doc => ({
            id: doc.id,         // Keeps track of Firebase's unique ID for each plane
            ...doc.data()       // Spreads out your original item properties
            }));

            console.log("Cloud users loaded successfully:", fleet);
            
            // CRITICAL: Call whatever function you use to display the UI here!
            // Example: renderFleetUI(); 

        } catch (error) {
            console.error("Error loading users from cloud:", error);
        }
        }

        // Call the function immediately to fetch your data on page load
        loadUsersFromCloud();

        const matchedUser = existingUsers.find(user => user.email === email && user.password === password);

        if (matchedUser) {
            window.location.href = "dashboard.html";
          
        } else {
            alert('Incorrect email or password. Please try again.');
        }

        //clears the forms
        event.target.reset();
    });
}