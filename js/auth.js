// Authentication system for Solar System Self Study
// Simple client-side authentication with 1-hour expiration

// Configuration
const AUTH_CONFIG = {
    // Credentials (in a real application, these would be on the server)
    users: {
        'patilarnavv': 'Sn0wba!!',
        'patilvijayg': 'Sn0wba!!',
        'patilneytiriv': 'Sn0wba!!',
        'scioly': 'scioly2026'
    },

    // Session duration (1 hour in milliseconds)
    sessionDuration: 24 * 60 * 60 * 1000,

    // Storage keys
    storageKeys: {
        loginTime: 'sss_login_time',
        isAuthenticated: 'sss_authenticated',
        username: 'sss_username'
    }
};

/**
 * Attempt to log in with provided credentials
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {boolean} - True if login successful, false otherwise
 */
function login(username, password) {
    // Check if username exists and password matches
    if (AUTH_CONFIG.users[username] && AUTH_CONFIG.users[username] === password) {
        // Store authentication data
        const loginTime = new Date().getTime();
        localStorage.setItem(AUTH_CONFIG.storageKeys.loginTime, loginTime.toString());
        localStorage.setItem(AUTH_CONFIG.storageKeys.isAuthenticated, 'true');
        localStorage.setItem(AUTH_CONFIG.storageKeys.username, username);

        console.log('Login successful for user:', username);
        return true;
    }

    console.log('Login failed for user:', username);
    return false;
}

/**
 * Check if user is currently logged in and session is valid
 * @returns {boolean} - True if logged in and session valid, false otherwise
 */
function isLoggedIn() {
    const isAuthenticated = localStorage.getItem(AUTH_CONFIG.storageKeys.isAuthenticated);
    const loginTimeStr = localStorage.getItem(AUTH_CONFIG.storageKeys.loginTime);

    if (!isAuthenticated || isAuthenticated !== 'true' || !loginTimeStr) {
        return false;
    }

    const loginTime = parseInt(loginTimeStr);
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - loginTime;

    // Check if session has expired (1 hour)
    if (timeDifference > AUTH_CONFIG.sessionDuration) {
        console.log('Session expired, logging out');
        logout();
        return false;
    }

    return true;
}

/**
 * Log out the current user
 */
function logout() {
    localStorage.removeItem(AUTH_CONFIG.storageKeys.loginTime);
    localStorage.removeItem(AUTH_CONFIG.storageKeys.isAuthenticated);
    localStorage.removeItem(AUTH_CONFIG.storageKeys.username);

    console.log('User logged out');

    // Redirect to login page - determine correct path based on current location
    const currentPath = window.location.pathname;
    let loginPath = 'login.html';

    // If we're in a subdirectory (like guides/), go up one level
    if (currentPath.includes('/guides/') || currentPath.includes('/code-busters/')) {
        loginPath = '../login.html';
    }

    if (currentPath.includes('/code-busters/')) {
      loginPath = '../../login.html';
    }

    window.location.href = loginPath;
}

/**
 * Get the current logged-in username
 * @returns {string|null} - Username if logged in, null otherwise
 */
function getCurrentUser() {
    if (isLoggedIn()) {
        return localStorage.getItem(AUTH_CONFIG.storageKeys.username);
    }
    return null;
}

/**
 * Get remaining session time in milliseconds
 * @returns {number} - Remaining time in milliseconds, 0 if not logged in
 */
function getRemainingSessionTime() {
    if (!isLoggedIn()) {
        return 0;
    }

    const loginTimeStr = localStorage.getItem(AUTH_CONFIG.storageKeys.loginTime);
    const loginTime = parseInt(loginTimeStr);
    const currentTime = new Date().getTime();
    const elapsed = currentTime - loginTime;
    const remaining = AUTH_CONFIG.sessionDuration - elapsed;

    return Math.max(0, remaining);
}

/**
 * Format remaining session time as human-readable string
 * @returns {string} - Formatted time string
 */
function getFormattedRemainingTime() {
    const remaining = getRemainingSessionTime();

    if (remaining === 0) {
        return 'Session expired';
    }

    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
    } else {
        return `${minutes}m remaining`;
    }
}

/**
 * Require authentication for the current page
 * Redirects to login page if not authenticated
 */
function requireAuth() {
    if (!isLoggedIn()) {
        // Get current page path for redirect after login
        const currentPath = window.location.pathname + window.location.search;

        // Determine correct path to login page based on current location
        let loginPath = 'login.html';
        if (currentPath.includes('/guides/') || currentPath.includes('/code-busters/')) {
            loginPath = '../login.html';
        }

        const loginUrl = `${loginPath}?redirect=${encodeURIComponent(currentPath)}`;

        console.log('Authentication required, redirecting to login');
        window.location.href = loginUrl;
        return false;
    }
    return true;
}

/**
 * Add logout functionality to a page
 * Creates a logout button and adds it to the specified container
 * @param {string} containerId - ID of the container to add logout button to
 */
function addLogoutButton(containerId = 'header') {
    const container = document.querySelector(`.${containerId}`) || document.querySelector(`#${containerId}`) || document.body;

    if (!container) {
        console.warn('Could not find container for logout button');
        return;
    }

    // Create logout container
    const logoutContainer = document.createElement('div');
    logoutContainer.className = 'auth-info';
    logoutContainer.style.cssText = `
        position: absolute;
        top: 15px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 14px;
        color: #666;
    `;

    // Add user info
    const userInfo = document.createElement('span');
    userInfo.textContent = `Welcome, ${getCurrentUser()}`;
    userInfo.style.cssText = `
        color: #003366;
        font-weight: 600;
    `;

    // Add session time
    const sessionInfo = document.createElement('span');
    sessionInfo.textContent = getFormattedRemainingTime();
    sessionInfo.style.cssText = `
        color: #666;
        font-size: 12px;
    `;

    // Add logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = '🚪 Logout';
    logoutBtn.style.cssText = `
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    logoutBtn.addEventListener('click', logout);
    logoutBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
    });
    logoutBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });

    // Assemble logout container
    logoutContainer.appendChild(userInfo);
    logoutContainer.appendChild(sessionInfo);
    logoutContainer.appendChild(logoutBtn);

    // Add to page
    if (container.style.position !== 'relative' && container.style.position !== 'absolute') {
        container.style.position = 'relative';
    }
    container.appendChild(logoutContainer);

    // Update session time every minute
    setInterval(() => {
        if (isLoggedIn()) {
            sessionInfo.textContent = getFormattedRemainingTime();
        }
    }, 60000);
}

/**
 * Initialize authentication for a page
 * Call this on pages that require authentication
 */
function initAuth() {
    // Check authentication
    if (!requireAuth()) {
        return;
    }

    // Add logout button when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addLogoutButton();
            // Initialize study tracker if available
            if (typeof initStudyTracker === 'function') {
                initStudyTracker();
            }
        });
    } else {
        addLogoutButton();
        // Initialize study tracker if available
        if (typeof initStudyTracker === 'function') {
            initStudyTracker();
        }
    }

    console.log('Authentication initialized for user:', getCurrentUser());
}

// Auto-check session expiration every 5 minutes
setInterval(() => {
    if (localStorage.getItem(AUTH_CONFIG.storageKeys.isAuthenticated) === 'true' && !isLoggedIn()) {
        alert('Your session has expired. Please log in again.');
        logout();
    }
}, 5 * 60 * 1000);

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        login,
        logout,
        isLoggedIn,
        getCurrentUser,
        requireAuth,
        initAuth,
        addLogoutButton,
        getRemainingSessionTime,
        getFormattedRemainingTime
    };
}
