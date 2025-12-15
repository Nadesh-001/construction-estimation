// ===================================
// THEME SWITCHER
// ===================================

// Initialize theme on page load
(function () {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || getSystemTheme();
    setTheme(savedTheme);

    // Remove no-transition class after initial load
    setTimeout(() => {
        document.body.classList.remove('no-transition');
    }, 100);
})();

// Get system theme preference
function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update toggle button state
    updateToggleButton(theme);
}

// Update toggle button
function updateToggleButton(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Setup theme toggle button
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Keyboard shortcut: Ctrl+Shift+D
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleTheme();
            showToast('Theme switched');
        }
    });

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
});

// Make functions globally available
window.toggleTheme = toggleTheme;
window.setTheme = setTheme;
