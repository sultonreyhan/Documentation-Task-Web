/**
 * Storage System
 * Manages localStorage persistence for application state
 */

const STORAGE_KEY = 'crud-course-manager-state';

/**
 * Default state structure
 */
export const DEFAULT_STATE = {
    courses: [
        {
            id: 'course-1',
            title: 'Introduction to JavaScript',
            expanded: true,
            tasks: [
                {
                    id: 'task-1',
                    title: 'Getting Started',
                    createdAt: '01/01/2024'
                },
                {
                    id: 'task-2',
                    title: 'Basic Concepts',
                    createdAt: '01/02/2024'
                }
            ]
        },
        {
            id: 'course-2',
            title: 'Web Development Basics',
            expanded: true,
            tasks: [
                {
                    id: 'task-3',
                    title: 'HTML & CSS',
                    createdAt: '01/03/2024'
                }
            ]
        }
    ]
};

/**
 * Initialize or load state from localStorage
 * @returns {Object} state object from storage or default
 */
export function initStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            console.log('✓ State loaded from localStorage');
            return parsed;
        } catch (error) {
            console.error('Failed to parse localStorage:', error);
            return DEFAULT_STATE;
        }
    }
    
    console.log('✓ Using default state (first run)');
    return DEFAULT_STATE;
}

/**
 * Load current state from localStorage
 * @returns {Object|null} parsed state or null if not found
 */
export function loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
        return null;
    }
    
    try {
        return JSON.parse(stored);
    } catch (error) {
        console.error('Failed to parse storage:', error);
        return null;
    }
}

/**
 * Save state to localStorage
 * @param {Object} state - application state to save
 * @throws {Error} if state is invalid or storage fails
 */
export function saveToStorage(state) {
    if (!state || typeof state !== 'object') {
        throw new Error('Invalid state object');
    }
    
    try {
        const json = JSON.stringify(state, null, 2);
        localStorage.setItem(STORAGE_KEY, json);
        console.log('✓ State saved to localStorage');
        return true;
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
        
        // Handle quota exceeded error
        if (error.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded');
        }
        
        throw error;
    }
}

/**
 * Reset storage to default state
 * Useful for testing or recovery
 */
export function resetStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('✓ Storage reset to default');
        return DEFAULT_STATE;
    } catch (error) {
        console.error('Failed to reset storage:', error);
        throw error;
    }
}

/**
 * Check if specific key exists in localStorage
 * @returns {boolean}
 */
export function hasStorage() {
    return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Get raw storage string (for debugging)
 * @returns {string|null}
 */
export function getStorageRaw() {
    return localStorage.getItem(STORAGE_KEY);
}
