# Developer's Quick Start Guide

Quick reference for working with the modular architecture.

---

## Project Layout at a Glance

```
src/
├── app.js                 ← Entry point (start here)
├── index.html             ← Minimal HTML container
├── core/                  ← Business logic (AI/ML)
│   └── nn-classifier.js   ← Neural network implementation
├── ui/                    ← User interface components
│   ├── ui-controller.js   ← Main orchestrator
│   ├── activity-bar.js    ← Left navigation icons
│   ├── navigation-panel.js ← Course/task sidebar
│   ├── content-workspace.js ← Main content area
│   └── inspector-panel.js  ← Right info panel
├── utils/                 ← Helper functions
│   ├── csv-parser.js      ← CSV file parsing
│   └── file-handler.js    ← File download/export
└── styles/                ← CSS organized by concern
    ├── variables.css      ← Theme colors & spacing
    ├── layout.css         ← 4-panel layout grid
    └── components.css     ← Reusable component styles
```

---

## Common Tasks

### Task 1: Add a New UI Component

**Goal:** Create a new sidebar section

**Steps:**

1. Create `src/ui/new-sidebar.js`:
```javascript
export class NewSidebar {
    constructor(container) {
        this.container = container;
    }

    init(data, onSelect) {
        const el = document.createElement('div');
        el.className = 'new-sidebar';
        // Build your component
        this.container.appendChild(el);
    }
}
```

2. Import in `src/ui/ui-controller.js`:
```javascript
import { NewSidebar } from './new-sidebar.js';
```

3. Initialize in `UIController.init()`:
```javascript
this.components.newSidebar = new NewSidebar(workspace);
this.components.newSidebar.init(data, (selected) => {
    this._handleSelection(selected);
});
```

4. Add styles to `src/styles/components.css`:
```css
.new-sidebar {
    /* Your styles */
}
```

---

### Task 2: Add Neural Network Methods

**Goal:** Add a new prediction method

**In `src/core/nn-classifier.js`:**

```javascript
/**
 * Batch predict on multiple inputs
 * @param {Array<Array>} inputs - Multiple input arrays
 * @returns {Array} Predictions for each input
 */
batchPredict(inputs) {
    return inputs.map(input => this.predict(input));
}
```

**Then use in UIController:**
```javascript
const batchResults = this.classifier.batchPredict(dataPoints);
```

---

### Task 3: Handle New File Format

**Goal:** Add Excel import support

**In `src/utils/file-handler.js`:**

```javascript
import { FileHandler } from './file-handler.js';

// Add new method
static async parseExcel(file) {
    // Use SheetJS library or similar
    const workbook = await XLSX.read(file);
    return XLSX.utils.sheet_to_json(workbook.Sheets[0]);
}
```

**Use in UI:**
```javascript
async loadExcelData(file) {
    this.state.data = await FileHandler.parseExcel(file);
}
```

---

### Task 4: Style a New Component

**Goal:** Create custom button styles

**In `src/styles/components.css`:**

```css
.btn-custom {
    background-color: var(--accent-color);
    padding: var(--spacing-md);
    font-family: var(--font-primary);
    /* Uses variables from variables.css */
}
```

**Or add new variables in `src/styles/variables.css`:**

```css
:root {
    --custom-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

---

## Architecture Quick Reference

### Layer Responsibilities

| Layer | Files | Responsibility | Can Access |
|-------|-------|-----------------|------------|
| **Core** | `nn-classifier.js` | AI/ML logic | Nothing (independent) |
| **Utils** | `csv-parser.js`<br>`file-handler.js` | Helper functions | Core (no UI) |
| **UI** | `ui-controller.js`<br>`*-panel.js`<br>`*-bar.js` | User interface | Core + Utils |
| **Styles** | `*.css` | Visual design | - |

### Import Patterns

**UI Component importing utilities:**
```javascript
import { UIController } from './ui-controller.js';
import { CSVParser } from '../utils/csv-parser.js';
import { FileHandler } from '../utils/file-handler.js';
import { DNNClassifier } from '../core/nn-classifier.js';
```

**Avoid importing UP the layer:**
```javascript
// ❌ BAD: Core shouldn't import UI
import { UIController } from './ui/ui-controller.js';

// ✅ GOOD: UI imports Core
import { DNNClassifier } from './core/nn-classifier.js';
```

---

## Running & Debugging

### Start Development Server

**⭐ Recommended: Python (Alternative Port)**
```bash
cd Documentation-Task-Web
python -m http.server 3000
# Open http://localhost:3000/src/index.html
```
> *If port 8000 is in use, try 3000, 4000, or 5000 instead*

**Using Node.js:**
```bash
npx http-server -p 8080
# Open http://localhost:8080/src/index.html
```

**Using Python from src folder:**
```bash
cd Documentation-Task-Web/src
python -m http.server 4000
# Open http://localhost:4000/index.html
```

**Using VS Code Built-in Server:**
1. Open `src/index.html` in editor tab
2. Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac)
3. Type: `>Preview on Web Server`
4. Browser opens automatically

> **Troubleshooting:** If you get "port already in use" error, try a different port (3000, 4000, 5000, etc.)

### Debugging

**Browser DevTools:**
1. Open DevTools (F12)
2. Check Console tab for errors
3. Use Debugger tab to step through code
4. Check Network tab for CSS/JS loading

**Add Debug Logs:**
```javascript
// In any module
console.log('Component initialized:', this);

// In UIController
_handleTaskSelect(task) {
    console.log('Task selected:', task);  // Debug output
    this.components.contentWorkspace.displayTask(task);
}
```

---

## Module Reference

### `nn-classifier.js`

```javascript
// Initialize
const classifier = new DNNClassifier();
classifier.initializeModel({
    inputs: 4,
    hiddenCount: 2,
    neuronsPerHidden: 16,
    outputs: 3,
    epochs: 100
});

// Train
const history = classifier.train(trainingData, 'label');

// Predict
const predictions = classifier.predict(inputFeatures);
const classLabel = classifier.predictClass(inputFeatures);

// Evaluate
const metrics = classifier.evaluate(testData, 'label');

// Get history
const trainingCurve = classifier.getTrainingHistory();
```

### `csv-parser.js`

```javascript
// Parse CSV file
const data = await CSVParser.parse(csvFile);

// Get columns
const columns = CSVParser.getColumns(data);
// Returns: ['feature1', 'feature2', 'label']

// Validate
const validation = CSVParser.validate(data, 'label');
if (!validation.valid) {
    console.error(validation.error);
}
```

### `file-handler.js`

```javascript
// Export as JSON
FileHandler.downloadJSON(modelResults, 'model-results.json');

// Export as CSV
FileHandler.downloadCSV(predictions, 'predictions.csv');

// Get timestamp
const timestamp = FileHandler.getTimestamp();
// Returns: "2024-03-11"
```

### `ui-controller.js`

```javascript
// Initialize app
const controller = new UIController();
await controller.init();

// Load data
await controller.loadTrainData(csvFile);
await controller.loadTestData(csvFile);

// Train model
const result = await controller.trainClassifier({
    inputs: 4,
    hiddenCount: 2,
    outputs: 3,
    epochs: 100,
    labelColumn: 'label'
});

// Make prediction
const prediction = controller.makePrediction([1.0, 2.5, 3.2, 0.5]);

// Export results
controller.exportResults();
```

---

## Component APIs

### ActivityBar

```javascript
const bar = new ActivityBar(container);
bar.init(items, (action) => {
    console.log('Action selected:', action);
});
bar.setActive(element);
```

### NavigationPanel

```javascript
const nav = new NavigationPanel(container);
nav.init(courses, (task) => {
    console.log('Task selected:', task);
});
```

### ContentWorkspace

```javascript
const content = new ContentWorkspace(container);
content.init();
content.displayTask(taskObject);
content.clear();
```

### InspectorPanel

```javascript
const inspector = new InspectorPanel(container);
inspector.init();
inspector.displayMetadata({
    course: 'ML 101',
    date: '2024-03-11',
    buttons: [
        {
            label: 'Edit',
            onClick: () => { }
        }
    ]
});
inspector.clear();
```

---

## CSS Customization

### Using Design Tokens

All colors, spacing, fonts use CSS variables:

```css
/* In your component CSS */
.my-component {
    background-color: var(--bg-panel);      /* Color */
    color: var(--text-primary);               /* Text color */
    padding: var(--spacing-lg);               /* Spacing */
    font-family: var(--font-mono);            /* Font */
    border-radius: var(--radius-md);          /* Border */
    transition: all var(--transition-fast);   /* Animation */
}
```

### Modify Theme

Edit `src/styles/variables.css`:

```css
:root {
    --bg-main: #1E1E1E;           /* Change main background */
    --accent-color: #569CD6;      /* Change accent color */
    --text-primary: #D4D4D4;      /* Change text color */
    /* ... more customizations */
}
```

---

## File Structure Checklist

Before committing, verify:

- ✅ Each module has single responsibility
- ✅ No circular imports
- ✅ No DOM access in `nn-classifier.js`
- ✅ All exports are named (not default)
- ✅ CSS variables used consistently
- ✅ README updated with new features

---

## Performance Tips

1. **Lazy load components** when not immediately needed
2. **Use event delegation** for many similar elements
3. **Cache DOM queries** that are reused
4. **Minimize reflows** by batching DOM changes
5. **Use CSS variables** for dynamic theming (no JS recompute)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Import not found" error | Check file path and use `./` for relative paths |
| CSS not loading | Verify path in `index.html` and load order |
| Component not rendering | Check browser console for JS errors |
| Layout broken | Verify `.workspace` div exists in HTML |
| Modules not executing | Ensure using `<script type="module">` |

---

## Common Patterns

### Component State Management
```javascript
class MyComponent {
    constructor(container) {
        this.container = container;
        this.state = {
            selected: null,
            data: []
        };
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }
}
```

### Callback Pattern
```javascript
component.init(data, (selectedItem) => {
    // Handle selection in parent component
    this.parent.handleSelection(selectedItem);
});
```

### Event Delegation
```javascript
// Instead of adding listeners to each item
container.addEventListener('click', (e) => {
    if (e.target.classList.contains('item')) {
        this.handleItemClick(e.target);
    }
});
```

---

## Next Learning Resources

- **ES6 Modules:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- **DOM API:** https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
- **CSS Variables:** https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Async/Await:** https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await

---

**Happy Coding! 🚀**
