// ===================================
// MAIN APPLICATION LOGIC
// ===================================

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Check login status
    checkLoginStatus();

    // Setup event listeners
    setupEventListeners();

    // Setup profile dropdown
    setupProfileDropdown();

    // Setup modals
    setupModals();

    // Populate city dropdowns
    populateCityDropdowns();
}

// ===================================
// USER AUTHENTICATION
// ===================================

function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const loginIndicator = document.getElementById('login-indicator');
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const authAction = document.getElementById('auth-action');

    if (user) {
        // User is logged in
        loginIndicator.classList.add('logged-in');
        profileName.textContent = user.username || user.email;
        profileEmail.textContent = user.email;
        authAction.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Logout</span>';
        authAction.onclick = handleLogout;

        // Enable menu items
        document.querySelectorAll('[data-requires-auth]').forEach(item => {
            item.classList.remove('disabled');
        });
    } else {
        // User is not logged in
        loginIndicator.classList.remove('logged-in');
        profileName.textContent = 'Guest User';
        profileEmail.textContent = 'Not logged in';
        authAction.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Login</span>';
        authAction.onclick = () => openModal('login-modal');

        // Disable menu items
        document.querySelectorAll('[data-requires-auth]').forEach(item => {
            item.classList.add('disabled');
            item.onclick = (e) => {
                e.preventDefault();
                showToast('Please login to access this feature');
                openModal('login-modal');
            };
        });
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Simple validation
    if (!email || !password) {
        showToast('Please fill in all fields');
        return;
    }

    try {
        // Show loading state
        const loginBtn = event.target.querySelector('button[type="submit"]');
        const originalText = loginBtn.innerHTML;
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

        // Call API
        const response = await api.login(email, password);

        closeModal('login-modal');
        checkLoginStatus();
        showToast(`Welcome back, ${response.user.username}!`);

        // Reset form
        event.target.reset();
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalText;
    } catch (error) {
        showToast(error.message || 'Login failed. Please try again.');
        const loginBtn = event.target.querySelector('button[type="submit"]');
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
}

async function handleSignup(event) {
    event.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    // Validation
    if (!username || !email || !phone || !password || !confirmPassword) {
        showToast('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match');
        return;
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
        showToast('Please enter a valid 10-digit phone number');
        return;
    }

    try {
        // Show loading state
        const signupBtn = event.target.querySelector('button[type="submit"]');
        const originalText = signupBtn.innerHTML;
        signupBtn.disabled = true;
        signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

        // Call API
        const response = await api.register(username, email, password);

        closeModal('signup-modal');
        checkLoginStatus();
        showToast(`Welcome ${username}! Your account has been created successfully.`);

        // Reset form
        event.target.reset();
        signupBtn.disabled = false;
        signupBtn.innerHTML = originalText;
    } catch (error) {
        showToast(error.message || 'Signup failed. Please try again.');
        const signupBtn = event.target.querySelector('button[type="submit"]');
        signupBtn.disabled = false;
        signupBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
}

function handleLogout() {
    api.logout();
    checkLoginStatus();
    showToast('Logged out successfully');

    // Close dropdown
    document.getElementById('profile-dropdown').classList.remove('active');
}

// ===================================
// PROFILE DROPDOWN
// ===================================

function setupProfileDropdown() {
    const profileButton = document.getElementById('profile-button');
    const profileDropdown = document.getElementById('profile-dropdown');

    profileButton.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target) && !profileButton.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });
}

// ===================================
// MODALS
// ===================================

function setupModals() {
    // Close modals when clicking overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    setTimeout(() => openModal(targetModalId), 200);
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ===================================
// CONTACT FUNCTIONS
// ===================================

function copyAddress() {
    const address = '8°08\'02.9"N 77°27\'17.6"E';

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(() => {
            showToast('Address copied to clipboard!');
        }).catch(() => {
            fallbackCopyAddress(address);
        });
    } else {
        fallbackCopyAddress(address);
    }
}

function fallbackCopyAddress(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        showToast('Address copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy address');
    }

    document.body.removeChild(textarea);
}

// ===================================
// TOAST NOTIFICATIONS
// ===================================

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ===================================
// CITY DROPDOWNS
// ===================================

const cityData = {
    'tamil-nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Kanyakumari'],
    'kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
    'karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum']
};

function populateCityDropdowns() {
    const stateSelect = document.getElementById('location-state');
    const citySelect = document.getElementById('location-city');

    if (stateSelect && citySelect) {
        stateSelect.addEventListener('change', () => {
            const state = stateSelect.value;
            citySelect.innerHTML = '<option value="">Select City</option>';

            if (state && cityData[state]) {
                citySelect.disabled = false;
                cityData[state].forEach(city => {
                    const option = document.createElement('option');
                    option.value = city.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
            } else {
                citySelect.disabled = true;
            }
        });
    }
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
}

// Make functions globally available
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleLogout = handleLogout;
window.openModal = openModal;
window.closeModal = closeModal;
window.switchModal = switchModal;
window.togglePassword = togglePassword;
window.copyAddress = copyAddress;
window.showToast = showToast;
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;
