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
            id: 'course-default-1',
            title: 'Sample Course',
            expanded: true,
            tasks: [
                {
                    id: 'task-default-1',
                    title: 'Sample Task - DNN Classifier',
                    type: 'dnn-classifier',
                    config: {
                        inputSize: 784,
                        outputSize: 10
                    },
                    result: null,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'task-default-2',
                    title: 'Sample Task - Color Classifier',
                    type: 'color-classifier',
                    config: {
                        colorMode: 'RGB'
                    },
                    result: null,
                    createdAt: new Date().toISOString()
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
