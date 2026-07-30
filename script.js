const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const loginData = Object.fromEntries(formData.entries());

  console.log("Form Data Successfully Captured!");
  console.log("Email Entered:", loginData['email-input']);
  console.log("Password Entered:", loginData['password-input']);

  alert(`Testing Success!\nLogged in as: ${loginData['email-input']}`);
  
  event.target.reset(); 
});
