// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginFormElement = document.getElementById('loginFormElement');
const signupFormElement = document.getElementById('signupFormElement');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const messageContainer = document.getElementById('messageContainer');
const message = document.getElementById('message');
const messageIcon = document.getElementById('messageIcon');
const messageText = document.getElementById('messageText');

// Form Elements
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const confirmPassword = document.getElementById('confirmPassword');
const agreeTerms = document.getElementById('agreeTerms');
const rememberMe = document.getElementById('rememberMe');

// Buttons
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginSpinner = document.getElementById('loginSpinner');
const signupSpinner = document.getElementById('signupSpinner');

// Password Toggle Elements
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const toggleSignupPassword = document.getElementById('toggleSignupPassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

// Forgot Password
const forgotPassword = document.getElementById('forgotPassword');

// User Data Storage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Utility Functions
function showMessage(text, type = 'success') {
    messageText.textContent = text;
    message.className = `message ${type}`;
    messageIcon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    messageContainer.classList.add('show');
    setTimeout(() => {
        messageContainer.classList.remove('show');
    }, 4000);
}

function showError(elementId, text) {
    const el = document.getElementById(elementId);
    el.textContent = text;
    el.classList.add('show');
}

function clearError(elementId) {
    const el = document.getElementById(elementId);
    el.textContent = '';
    el.classList.remove('show');
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(e => {
        e.textContent = '';
        e.classList.remove('show');
    });
}

function setLoading(button, spinner, isLoading) {
    if (isLoading) {
        button.disabled = true;
        spinner.classList.add('show');
        button.querySelector('.btn-text').classList.add('hide');
    } else {
        button.disabled = false;
        spinner.classList.remove('show');
        button.querySelector('.btn-text').classList.remove('hide');
    }
}

// Validation
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateName(name) {
    return name.trim().length >= 2;
}

// Strong password: 8+ chars, uppercase, lowercase, number, special
function validatePassword(password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const longEnough = password.length >= 8;

    const missing = [];
    if (!longEnough) missing.push('at least 8 characters');
    if (!hasUppercase) missing.push('one uppercase letter');
    if (!hasLowercase) missing.push('one lowercase letter');
    if (!hasNumber) missing.push('one number');
    if (!hasSpecialChar) missing.push('one special character');

    return {
        valid: missing.length === 0,
        message: missing.length ? `Password must contain ${missing.join(', ')}` : ''
    };
}

function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

// Password toggles
function togglePasswordVisibility(input, toggleIcon) {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    toggleIcon.className = isPassword ? 'fas fa-eye-slash toggle-password' : 'fas fa-eye toggle-password';
}

toggleLoginPassword.addEventListener('click', () => togglePasswordVisibility(loginPassword, toggleLoginPassword));
toggleSignupPassword.addEventListener('click', () => togglePasswordVisibility(signupPassword, toggleSignupPassword));
toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility(confirmPassword, toggleConfirmPassword));

// Real-time Validation
loginEmail.addEventListener('input', () => {
    clearError('loginEmailError');
    if (loginEmail.value && !validateEmail(loginEmail.value)) {
        showError('loginEmailError', 'Please enter a valid email address');
    }
});

loginPassword.addEventListener('input', () => clearError('loginPasswordError'));

signupName.addEventListener('input', () => {
    clearError('signupNameError');
    if (signupName.value && !validateName(signupName.value)) {
        showError('signupNameError', 'Name must be at least 2 characters long');
    }
});

signupEmail.addEventListener('input', () => {
    clearError('signupEmailError');
    if (signupEmail.value && !validateEmail(signupEmail.value)) {
        showError('signupEmailError', 'Please enter a valid email address');
    }
});

signupPassword.addEventListener('input', () => {
    clearError('signupPasswordError');
    if (signupPassword.value) {
        const { valid, message } = validatePassword(signupPassword.value);
        if (!valid) showError('signupPasswordError', message);
    }
});

confirmPassword.addEventListener('input', () => {
    clearError('confirmPasswordError');
    if (confirmPassword.value && !validatePasswordMatch(signupPassword.value, confirmPassword.value)) {
        showError('confirmPasswordError', 'Passwords do not match');
    }
});

// Auth helpers
function authenticateUser(email, password) {
    return users.find(u => u.email === email && u.password === password);
}

function registerUser(name, email, password) {
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'User already exists with this email' };
    }
    const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.toLowerCase(),
        password,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, user: newUser };
}

// Switch forms
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    clearAllErrors();
    signupForm.classList.add('fade-in');
});
showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    clearAllErrors();
    loginForm.classList.add('fade-in');
});

// Submit: Login
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    let hasErrors = false;
    if (!email) { showError('loginEmailError', 'Email is required'); hasErrors = true; }
    else if (!validateEmail(email)) { showError('loginEmailError', 'Please enter a valid email address'); hasErrors = true; }
    if (!password) { showError('loginPasswordError', 'Password is required'); hasErrors = true; }
    if (hasErrors) return;

    setLoading(loginBtn, loginSpinner, true);
    setTimeout(() => {
        const user = authenticateUser(email, password);
        if (user) {
            if (rememberMe.checked) localStorage.setItem('currentUser', JSON.stringify(user));
            else sessionStorage.setItem('currentUser', JSON.stringify(user));
            showMessage(`Welcome back, ${user.name}!`, 'success');
            loginFormElement.reset();
        } else {
            showMessage('Invalid email or password', 'error');
        }
        setLoading(loginBtn, loginSpinner, false);
    }, 800);
});

// Submit: Signup
signupFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors();

    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;
    const confirmPass = confirmPassword.value;

    let hasErrors = false;
    if (!name) { showError('signupNameError', 'Name is required'); hasErrors = true; }
    else if (!validateName(name)) { showError('signupNameError', 'Name must be at least 2 characters long'); hasErrors = true; }

    if (!email) { showError('signupEmailError', 'Email is required'); hasErrors = true; }
    else if (!validateEmail(email)) { showError('signupEmailError', 'Please enter a valid email address'); hasErrors = true; }

    if (!password) { showError('signupPasswordError', 'Password is required'); hasErrors = true; }
    else {
        const { valid, message } = validatePassword(password);
        if (!valid) { showError('signupPasswordError', message); hasErrors = true; }
    }

    if (!confirmPass) { showError('confirmPasswordError', 'Please confirm your password'); hasErrors = true; }
    else if (!validatePasswordMatch(password, confirmPass)) { showError('confirmPasswordError', 'Passwords do not match'); hasErrors = true; }

    if (!agreeTerms.checked) { showMessage('Please agree to the terms and conditions', 'error'); hasErrors = true; }

    if (hasErrors) return;

    setLoading(signupBtn, signupSpinner, true);
    setTimeout(() => {
        const result = registerUser(name, email, password);
        if (result.success) {
            showMessage(`Account created successfully! Welcome, ${result.user.name}!`, 'success');
            sessionStorage.setItem('currentUser', JSON.stringify(result.user));
            signupFormElement.reset();
            // Switch to login after a moment
            setTimeout(() => {
                signupForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                loginForm.classList.add('fade-in');
            }, 1000);
        } else {
            showMessage(result.message, 'error');
        }
        setLoading(signupBtn, signupSpinner, false);
    }, 900);
});

// Forgot Password
forgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    if (!email) { showMessage('Please enter your email address first', 'error'); return; }
    if (!validateEmail(email)) { showMessage('Please enter a valid email address', 'error'); return; }
    showMessage('Password reset link sent to your email!', 'success');
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        showMessage(`Welcome back, ${user.name}!`, 'success');
    }
    loginForm.classList.add('fade-in');
    loginEmail.focus();
});

// Dev helpers
window.authDebug = {
    users: () => console.log('All users:', users),
    clearUsers: () => { users = []; localStorage.removeItem('users'); localStorage.removeItem('currentUser'); sessionStorage.removeItem('currentUser'); console.log('All user data cleared'); }
};