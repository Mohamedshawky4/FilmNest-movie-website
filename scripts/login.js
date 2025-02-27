import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

const auth = getAuth();
document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle-button span');
    const slider = document.querySelector('.toggle-slider');
    function toggle(button, index) {
        const loginForm = document.querySelector('.form-section.login');
        const registerForm = document.querySelector('.form-section.register');
        button.addEventListener('click', () => {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (index === 0) {
                loginForm.classList.remove('inactive');
                registerForm.classList.remove('active');
          } else {
                loginForm.classList.add('inactive');
                registerForm.classList.add('active');
                 }
                        
       slider.style.transform = `translateX(${index * 120}px)`;
                    });
    }

    toggleButtons.forEach((button, index) => {
       toggle(button, index);
    });

    // Add floating labels
    const inputs = document.querySelectorAll('.input-with-icon input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Password strength checker
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.closest('.register-form')) {
                // checkPasswordStrength(this.value);
            }
        });
    });

    const registerForm = document.querySelector('.form-section.register');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;
        const confirmPassword = registerForm.querySelector('input[name="confirm-password"]').value;
    
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // alert("Registration successful!");
                const slider = document.querySelector('.toggle-slider');
                loginForm.classList.remove('inactive');
                loginForm.classList.add('active');
                registerForm.classList.add('inactive');
                registerForm.classList.remove('active');
        slider.style.transform = `translateX(${0 * 120}px)`;
            })
            .catch((error) => {
                alert(error.message);
            });
    });
   
    const loginForm = document.querySelector('.form-section.login');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('userPassword', password);
            document.cookie = `userEmail=${email}; path=/;`; 
                document.cookie = `userPassword=${password}; path=/;`;

            window.location.href = "../index.html";  // Redirect to home
        })
        .catch((error) => {
            alert("Login failed: " + error.message);
        });
});

    
   
});

const menu = document.getElementById("menu-btn");
const nav = document.querySelector(".mobile-navbar"); // Correctly targets the <nav>

if (menu && nav) {
    menu.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
} else {
    console.error("Menu button or navigation bar not found!");
}



