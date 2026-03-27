/**
 * Application Entry Point
 * Initializes the UI and manages global state
 */

import { UIController } from './ui/ui-controller.js';
import { initStorage } from './core/storage.js';

// Global application instance
let app = null;

/**
 * Initialize application
 */
async function initializeApp() {
    try {
        // Initialize storage (load from localStorage or use default)
        const initialState = initStorage();
        console.log('Storage initialized:', initialState);
        
        app = new UIController();
        await app.init(initialState);
        console.log('✓ Application initialized successfully');
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
