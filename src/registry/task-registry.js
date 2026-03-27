/**
 * Task Type Registry
 * Maps task types to their engine and renderer functions
 */

import { runDNN } from '../core/dnn-engine.js';
import { runColorClassifier } from '../core/color-engine.js';

/**
 * Renderer for DNN classifier tasks
 */
function renderDNNUI(task) {
    const result = task.result;
    
    if (!result) {
        return `
            <div class="task-renderer dnn-renderer">
                <p class="task-status">⏳ Not executed yet</p>
                <p class="config-info">Input: ${task.config.inputSize || 784} | Output: ${task.config.outputSize || 10}</p>
            </div>
        `;
    }
    
    return `
        <div class="task-renderer dnn-renderer">
            <div class="result-header">
                <span class="result-label">Classification:</span>
                <span class="result-value">${result.classification}</span>
                <span class="confidence">${result.confidence}</span>
            </div>
            <div class="predictions">
                <p class="predictions-header">Top Probabilities:</p>
                <div class="predictions-grid">
                    ${result.predictions.slice(0, 5).map((p, i) => `
                        <div class="prediction-item">
                            <span class="class-label">Class ${i}:</span>
                            <span class="prob-value">${p}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <p class="executed-at">Executed: ${result.executedAt}</p>
        </div>
    `;
}

/**
 * Renderer for color classifier tasks
 */
function renderColorUI(task) {
    const result = task.result;
    
    if (!result) {
        return `
            <div class="task-renderer color-renderer">
                <p class="task-status">⏳ Not executed yet</p>
                <p class="config-info">Mode: ${task.config.colorMode || 'RGB'}</p>
            </div>
        `;
    }
    
    return `
        <div class="task-renderer color-renderer">
            <div class="color-swatch" style="background-color: ${result.hex}; width: 100px; height: 100px; border-radius: 8px; margin: 10px 0;"></div>
            <div class="result-header">
                <span class="result-label">Color:</span>
                <span class="result-value">${result.color}</span>
                <span class="confidence">${result.confidence}</span>
            </div>
            <div class="color-details">
                <p>HEX: <code>${result.hex}</code></p>
                <p>RGB: <code>rgb(${result.rgb.join(', ')})</code></p>
                <p>Mode: ${result.colorMode}</p>
            </div>
            <p class="executed-at">Executed: ${result.executedAt}</p>
        </div>
    `;
}

/**
 * Task Registry - maps type to engine, renderer, and metadata
 */
export const TASK_REGISTRY = {
    'dnn-classifier': {
        name: 'DNN Classifier',
        description: 'Neural Network Classification',
        icon: '🧠',
        engine: runDNN,
        renderer: renderDNNUI,
        defaultConfig: {
            inputSize: 784,
            outputSize: 10
        }
    },
    'color-classifier': {
        name: 'Color Classifier',
        description: 'Color Detection and Classification',
        icon: '🎨',
        engine: runColorClassifier,
        renderer: renderColorUI,
        defaultConfig: {
            colorMode: 'RGB'
        }
    }
};

/**
 * Get registry entry for a task type
 * @param {string} type - task type identifier
 * @throws {Error} if type not found in registry
 * @returns {Object} registry entry with engine, renderer, name, etc.
 */
export function getTaskType(type) {
    if (!TASK_REGISTRY[type]) {
        console.error(`Unknown task type: ${type}`);
        throw new Error(`Unknown task type: "${type}". Available types: ${Object.keys(TASK_REGISTRY).join(', ')}`);
    }
    return TASK_REGISTRY[type];
}

/**
 * Check if a task type exists in registry
 * @param {string} type - task type identifier
 * @returns {boolean}
 */
export function typeExists(type) {
    return type in TASK_REGISTRY;
}

/**
 * Get list of all available task types
 * @returns {Array} array of type names
 */
export function getAvailableTypes() {
    return Object.keys(TASK_REGISTRY);
}

/**
 * Execute a task using its registered engine
 * @param {Object} task - task object with type and config
 * @returns {Object} execution result
 * @throws {Error} if type not found
 */
export function executeTask(task) {
    if (!task || !task.type) {
        throw new Error('Invalid task: must have type property');
    }
    
    try {
        const taskType = getTaskType(task.type);
        const result = taskType.engine(task.config);
        return result;
    } catch (error) {
        console.error('Error executing task:', error);
        throw error;
    }
}
