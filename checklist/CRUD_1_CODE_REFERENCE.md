# CRUD_1 — CODE REFERENCE & SNIPPETS

**Date:** March 28, 2026  
**Purpose:** Quick reference for common patterns & code structure

---

## 📐 STORAGE.JS - TEMPLATE

```javascript
// src/core/storage.js

const STORAGE_KEY = 'crud-course-data';

// Default state structure
const DEFAULT_STATE = {
  courses: [
    {
      id: 'default-course-1',
      title: 'Sample Course',
      expanded: true,
      tasks: [
        {
          id: 'default-task-1',
          title: 'Sample Task',
          type: 'dnn-classifier',
          config: { /* task-specific config */ },
          result: null
        }
      ]
    }
  ]
};

/**
 * Initialize or load state from localStorage
 * @returns {Object} state object
 */
function initStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse localStorage:', error);
      return DEFAULT_STATE;
    }
  }
  return DEFAULT_STATE;
}

/**
 * Load current state from localStorage
 * @returns {Object} parsed state
 */
function loadFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse storage:', error);
    return null;
  }
}

/**
 * Save state to localStorage
 * @param {Object} state - app state to save
 */
function saveToStorage(state) {
  try {
    const json = JSON.stringify(state, null, 2);
    localStorage.setItem(STORAGE_KEY, json);
    console.log('✓ State saved to storage');
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
}

export { initStorage, loadFromStorage, saveToStorage, STORAGE_KEY };
```

---

## 🔧 TASK-REGISTRY.JS - TEMPLATE

```javascript
// src/registry/task-registry.js

import { runDNN } from '../core/dnn-engine.js';
import { runColorClassifier } from '../core/color-engine.js';

// Renderer functions (pure functions, no side effects)
function renderDNNUI(task) {
  return `
    <div class="task-type-dnn">
      <h4>DNN Classifier</h4>
      <p>Config: ${JSON.stringify(task.config)}</p>
      ${task.result ? `<p>Result: ${JSON.stringify(task.result)}</p>` : ''}
    </div>
  `;
}

function renderColorUI(task) {
  return `
    <div class="task-type-color">
      <h4>Color Classifier</h4>
      <p>Config: ${JSON.stringify(task.config)}</p>
      ${task.result ? `<p>Result: ${JSON.stringify(task.result)}</p>` : ''}
    </div>
  `;
}

// Task Registry - maps type to engine & renderer
const TASK_REGISTRY = {
  'dnn-classifier': {
    name: 'DNN Classifier',
    engine: runDNN,
    renderer: renderDNNUI
  },
  'color-classifier': {
    name: 'Color Classifier',
    engine: runColorClassifier,
    renderer: renderColorUI
  }
};

/**
 * Get registry entry for task type
 * @param {string} type - task type
 * @throws {Error} if type not found
 * @returns {Object} {engine, renderer, name}
 */
function getTaskType(type) {
  if (!TASK_REGISTRY[type]) {
    throw new Error(`Unknown task type: ${type}`);
  }
  return TASK_REGISTRY[type];
}

/**
 * Check if type exists in registry
 * @param {string} type - task type
 * @returns {boolean}
 */
function typeExists(type) {
  return type in TASK_REGISTRY;
}

export { TASK_REGISTRY, getTaskType, typeExists };
```

---

## ⚙️ ENGINE TEMPLATES

### DNN Engine
```javascript
// src/core/dnn-engine.js

/**
 * Run DNN classifier
 * @param {Object} config - task config with input data
 * @returns {Object} result
 */
export function runDNN(config) {
  console.log('Running DNN with config:', config);
  
  // Placeholder logic
  const result = {
    classification: 'sample-result',
    confidence: 0.95,
    timestamp: new Date().toISOString()
  };
  
  return result;
}
```

### Color Engine
```javascript
// src/core/color-engine.js

/**
 * Run color classifier
 * @param {Object} config - task config with color data
 * @returns {Object} result
 */
export function runColorClassifier(config) {
  console.log('Running Color Classifier with config:', config);
  
  // Placeholder logic
  const result = {
    color: 'red',
    hex: '#FF0000',
    timestamp: new Date().toISOString()
  };
  
  return result;
}
```

---

## 🔗 STATE MANAGER INTEGRATION

```javascript
// Modified function in src/ui/state-manager.js

import { initStorage, saveToStorage } from '../core/storage.js';
import { getTaskType } from '../registry/task-registry.js';

// Initialize state from storage
let appState = initStorage();

/**
 * Add course to state & save
 */
function addCourse(title) {
  const course = {
    id: generateUUID(),
    title,
    expanded: true,
    tasks: []
  };
  appState.courses.push(course);
  saveToStorage(appState);
  return course;
}

/**
 * Add task to course & save
 */
function addTask(courseId, taskData) {
  const course = appState.courses.find(c => c.id === courseId);
  if (!course) throw new Error('Course not found');
  
  const task = {
    id: generateUUID(),
    title: taskData.title,
    type: taskData.type,
    config: taskData.config || {},
    result: null
  };
  course.tasks.push(task);
  saveToStorage(appState);
  return task;
}

/**
 * Execute task using registry
 */
function executeTask(courseId, taskId) {
  const course = appState.courses.find(c => c.id === courseId);
  if (!course) throw new Error('Course not found');
  
  const task = course.tasks.find(t => t.id === taskId);
  if (!task) throw new Error('Task not found');
  
  try {
    const taskType = getTaskType(task.type);
    task.result = taskType.engine(task.config);
    saveToStorage(appState);
    return task.result;
  } catch (error) {
    console.error('Error executing task:', error);
    throw error;
  }
}

/**
 * Update task config & save
 */
function updateTaskConfig(courseId, taskId, newConfig) {
  const course = appState.courses.find(c => c.id === courseId);
  if (!course) throw new Error('Course not found');
  
  const task = course.tasks.find(t => t.id === taskId);
  if (!task) throw new Error('Task not found');
  
  task.config = newConfig;
  saveToStorage(appState);
  return task;
}

export { addCourse, addTask, executeTask, updateTaskConfig };
```

---

## 🎨 TASK ITEM RENDERING

```javascript
// Modified render function in src/ui/task-item.js

import { getTaskType, typeExists } from '../registry/task-registry.js';

/**
 * Render task UI based on type
 */
function renderTaskUI(task) {
  if (!typeExists(task.type)) {
    return `
      <div class="task-error">
        <p class="error">Unknown task type: ${task.type}</p>
      </div>
    `;
  }
  
  const taskType = getTaskType(task.type);
  const html = taskType.renderer(task);
  
  return `
    <div class="task-item" data-task-id="${task.id}">
      <div class="task-header">
        <span class="task-type-badge">${taskType.name}</span>
        <h3>${task.title}</h3>
      </div>
      <div class="task-content">
        ${html}
      </div>
    </div>
  `;
}

export { renderTaskUI };
```

---

## 🧪 TESTING PATTERNS

### Test Storage
```javascript
// Manual test in browser console
const { initStorage, saveToStorage, loadFromStorage } = await import('/src/core/storage.js');
const state = initStorage();
console.log('Loaded state:', state);
saveToStorage(state);
console.log('localStorage:', localStorage.getItem('crud-course-data'));
```

### Test Registry
```javascript
// Manual test in browser console
const { TASK_REGISTRY, getTaskType } = await import('/src/registry/task-registry.js');
console.log('Available types:', Object.keys(TASK_REGISTRY));
const dnn = getTaskType('dnn-classifier');
console.log('DNN engine:', dnn.engine);
```

### Test Engine
```javascript
// Manual test in browser console
const { runDNN } = await import('/src/core/dnn-engine.js');
const result = runDNN({ sample: 'config' });
console.log('Result:', result);
```

---

## ⚠️ ERROR HANDLING PATTERNS

### Safe Registry Access
```javascript
function renderTask(task) {
  try {
    const taskType = getTaskType(task.type);
    return taskType.renderer(task);
  } catch (error) {
    console.error('Task rendering failed:', error);
    return `<div class="error">Failed to render task: ${error.message}</div>`;
  }
}
```

### Safe Storage Access
```javascript
function saveWithFallback(state, fallbackState) {
  try {
    saveToStorage(state);
  } catch (error) {
    console.warn('Storage save failed, using memory state:', error);
    // State remains in memory only
  }
}
```

---

## 📋 CHECKLIST FOR CODE REVIEW

- [ ] All functions have docstrings
- [ ] No global state outside state-manager
- [ ] Error handling with try/catch where needed
- [ ] Console logs for debugging (can remove later)
- [ ] No localStorage direct access outside storage.js
- [ ] No registry access outside getTaskType()
- [ ] Consistent naming conventions
- [ ] No breaking changes to existing UI

---

## 🔗 FILE DEPENDENCIES

```
app.js
  ├── state-manager.js (imports storage.js, task-registry.js)
  │   ├── storage.js
  │   └── task-registry.js
  │       ├── dnn-engine.js
  │       └── color-engine.js
  └── task-item.js (imports task-registry.js)
      └── task-registry.js
```

---

**See Also:** CRUD_1_IMPLEMENTATION_CHECKLIST.md for step-by-step tasks
