/**
 * Application Entry Point
 * Initializes the UI and manages global state
 */

import { UIController } from './src/ui/ui-controller.js';

// Global application instance
let app = null;

/**
 * Initialize application
 */
async function initializeApp() {
    try {
        app = new UIController();
        await app.init();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Application initialization failed:', error);
        alert('Failed to initialize application');
    }
}

/**
 * Handle DOM ready
 */
document.addEventListener('DOMContentLoaded', initializeApp);

// Export for external access if needed
window.app = null; // Will be set after init
