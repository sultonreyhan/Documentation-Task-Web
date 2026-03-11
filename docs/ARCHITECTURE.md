# Modular Frontend Architecture Documentation

## Overview

This project has been refactored from a monolithic single-file application into a modular, maintainable frontend architecture using vanilla JavaScript (ES6 modules). The architecture follows **separation of concerns** principles with clear module boundaries.

---

## Project Structure

```
Documentation-Task-Web/
├── src/
│   ├── app.js                    # Entry point - initializes the application
│   ├── index.html                # Minimal HTML - container only
│   │
│   ├── core/                     # Business logic & AI/ML
│   │   └── nn-classifier.js      # Deep Neural Network classifier
│   │
│   ├── ui/                       # UI Components & Controllers
│   │   ├── ui-controller.js      # Main orchestrator
│   │   ├── activity-bar.js       # Activity icons bar
│   │   ├── navigation-panel.js   # Course/task sidebar
│   │   ├── content-workspace.js  # Main content area
│   │   └── inspector-panel.js    # Right metadata panel
│   │
│   ├── utils/                    # Utility functions
│   │   ├── csv-parser.js         # CSV file parsing
│   │   └── file-handler.js       # File I/O operations
│   │
│   └── styles/                   # CSS Modules
│       ├── variables.css         # Design tokens & theme
│       ├── layout.css            # 4-panel layout system
│       └── components.css        # Reusable component styles
│
└── docs/
    └── ARCHITECTURE.md           # This file
```

---

## Module Responsibilities

### Core Layer (`src/core/`)

#### `nn-classifier.js` - Neural Network Classifier
**Responsibility:** All AI/ML logic for training and prediction

**Key Classes:**
- `DNNClassifier` - Main classifier with methods:
  - `initializeModel(config)` - Setup network architecture
  - `train(data, labelColumn)` - Train on dataset
  - `predict(input)` - Get predictions
  - `evaluate(testData, labelColumn)` - Model evaluation metrics
  - `getTrainingHistory()` - Return loss curves

**No UI Dependency:** This module is completely decoupled from UI - it's pure ML logic

**Usage:**
```javascript
import { DNNClassifier } from './core/nn-classifier.js';

const classifier = new DNNClassifier();
classifier.initializeModel({ inputs: 4, hiddenCount: 2, outputs: 3, epochs: 100 });
const history = classifier.train(trainingData, 'label');
```

---

### UI Layer (`src/ui/`)

#### `ui-controller.js` - Main Application Controller
**Responsibility:** Orchestrate all UI components and connect to business logic

**Key Class:**
- `UIController` - Main controller with methods:
  - `init()` - Initialize all components
  - `trainClassifier(config)` - Trigger model training
  - `makePrediction(inputs)` - Get predictions
  - `loadTrainData(file)` - Load CSV training data
  - `loadTestData(file)` - Load CSV test data
  - `exportResults()` - Export model results as JSON

**Composition:** Manages instances of all UI components

---

#### `activity-bar.js` - Activity Bar Component
**Responsibility:** Left icon bar for navigation mode switching

**Key Class:**
- `ActivityBar` - Single component with methods:
  - `init(items, callback)` - Initialize with items
  - `setActive(element)` - Update active state

**DOM Structure:**
```
.activity-bar
  ├─ .activity-item (courses)
  ├─ .activity-item (search)
  ├─ .activity-item (favorites)
  └─ .activity-item (settings)
```

---

#### `navigation-panel.js` - Navigation Sidebar
**Responsibility:** Display course/task hierarchy

**Key Class:**
- `NavigationPanel` - Sidebar navigation with methods:
  - `init(courses, callback)` - Initialize with course data
  - `_createCourseItem(course)` - Create expandable course item

**Features:**
- Expandable/collapsible course groups
- Task selection with visual feedback
- Callback on task selection

**DOM Structure:**
```
.nav-panel
  ├─ .nav-header
  │   ├─ h3 "Courses"
  │   └─ button (add course)
  └─ .nav-content
      ├─ .course-item
      │   ├─ .course-header
      │   │   ├─ .course-toggle
      │   │   └─ .course-name
      │   └─ .task-list
      │       └─ .task-item (clickable)
      └─ ...more courses
```

---

#### `content-workspace.js` - Main Content Area
**Responsibility:** Display task content with flexible block system

**Key Class:**
- `ContentWorkspace` - Content display with methods:
  - `init()` - Initialize workspace
  - `displayTask(task)` - Render task blocks
  - `_createBlock(block)` - Create block based on type
  - `clear()` - Clear content

**Block Types Supported:**
- **text** - Plain text content
- **pseudocode** - Code/algorithm blocks (monospace)
- **analysis** - Analysis sections with special styling
- **image** - Image blocks (extendable)
- **table** - Table blocks (extendable)

**DOM Structure:**
```
.content-workspace
  ├─ .content-header
  └─ .content-body
      ├─ .block
      │   ├─ .block-label
      │   ├─ .block-title
      │   └─ .block-text / .pseudocode-block
      └─ ...more blocks
```

---

#### `inspector-panel.js` - Right Metadata Panel
**Responsibility:** Display task metadata and action buttons

**Key Class:**
- `InspectorPanel` - Metadata display with methods:
  - `init()` - Initialize inspector
  - `displayMetadata(metadata)` - Show metadata fields
  - `clear()` - Clear display

**Features:**
- Dynamic field display from metadata object
- Clickable action buttons
- Responsive to task selection

**DOM Structure:**
```
.inspector-panel
  ├─ .inspector-header
  │   └─ h3 "Metadata"
  └─ .inspector-content
      ├─ .inspector-field
      │   ├─ .inspector-label
      │   └─ .inspector-value
      └─ .inspector-buttons
          └─ .btn (action buttons)
```

---

### Utilities Layer (`src/utils/`)

#### `csv-parser.js` - CSV File Parser
**Responsibility:** Parse and validate CSV data

**Key Class:**
- `CSVParser` - Static utility with methods:
  - `parse(file)` - Async parse CSV file to objects
  - `getColumns(data)` - Extract column names
  - `validate(data, labelColumn)` - Validate structure

**Usage:**
```javascript
import { CSVParser } from './utils/csv-parser.js';

const data = await CSVParser.parse(csvFile);
const validation = CSVParser.validate(data, 'label');
```

---

#### `file-handler.js` - File I/O Utilities
**Responsibility:** Handle file downloads and exports

**Key Class:**
- `FileHandler` - Static utility with methods:
  - `downloadJSON(data, filename)` - Export as JSON
  - `downloadCSV(data, filename)` - Export as CSV
  - `getTimestamp()` - Generate filename timestamp

**Usage:**
```javascript
import { FileHandler } from './utils/file-handler.js';

FileHandler.downloadJSON(modelResults, 'results.json');
FileHandler.downloadCSV(predictions, 'predictions.csv');
```

---

### Styles Layer (`src/styles/`)

#### `variables.css` - Design Tokens
**Purpose:** Centralized theme and spacing variables

**Sections:**
- Color palette (9 colors + semantic names)
- Typography (fonts and sizes)
- Spacing scale (6 levels)
- Border radius presets
- Animation timings

**Usage:**
```css
background-color: var(--bg-main);
font-family: var(--font-mono);
padding: var(--spacing-lg);
```

#### `layout.css` - 4-Panel Layout
**Purpose:** Define workspace layout system

**Defines:**
- Main 4-panel flex layout
- Activity bar positioning
- Navigation panel sizing
- Content workspace flex behavior
- Inspector panel layout
- Scrollbar styling

#### `components.css` - Component Styles
**Purpose:** Reusable component styles

**Components:**
- Activity items
- Navigation items & tasks
- Content blocks (text, pseudocode, analysis)
- Form elements
- Buttons (primary & secondary)
- Inspector fields
- File upload widget

---

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    App Entry (app.js)                        │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
         ┌──────────────────────────┐
         │   UIController (init)    │
         └────┬──────┬──────┬───────┘
              │      │      │
        ┌─────▼┐ ┌───▼──┐ ┌─▼───────┐
        │ Nav  │ │Content│ │Inspector│
        │Panel │ │  WS   │ │ Panel   │
        └──────┘ └───────┘ └─────────┘
             │
    Task selected
             │
             ▼
        ┌──────────────────────┐
        │ displayTask()        │
        │ displayMetadata()    │
        └──────────────────────┘
             │
        User clicks button
             │
             ▼
        ┌──────────────────────┐
        │ trainClassifier()   │ ◄─── Uses DNNClassifier
        │ makePrediction()    │ ◄─── Uses CSVParser
        │ loadTrainData()     │ ◄─── Uses FileHandler
        │ exportResults()     │
        └──────────────────────┘
```

---

## Component Communication Patterns

### 1. **Initialization Flow**
```javascript
// app.js
const app = new UIController();
await app.init();  // Initializes all components in order
```

### 2. **Event-Driven Communication**
```javascript
// navigation-panel.js executes callback on task selection
this.components.navPanel.init(courses, (task) => {
    this._handleTaskSelect(task);  // Method in UIController
});

// Handler updates content and inspector
_handleTaskSelect(task) {
    this.components.contentWorkspace.displayTask(task);
    this.components.inspector.displayMetadata(task.metadata);
}
```

### 3. **Data Passing**
- **UI → Core:** UIController passes configs and data to DNNClassifier
- **Core → Utils:** DNNClassifier processes data, results go to FileHandler for export
- **Utils → UI:** File operations trigger in response to UI actions

---

## How to Extend the Architecture

### Adding a New UI Component

1. **Create new file** in `src/ui/new-component.js`:
```javascript
export class NewComponent {
    constructor(container) {
        this.container = container;
    }
    
    init() {
        // Create and mount DOM elements
    }
}
```

2. **Import in UIController**:
```javascript
import { NewComponent } from './new-component.js';
```

3. **Instantiate in UIController.init()**:
```javascript
this.components.newComponent = new NewComponent(workspace);
this.components.newComponent.init();
```

### Adding a New Utility

1. **Create** `src/utils/new-utility.js` with static methods
2. **Import** where needed: `import { NewUtility } from '../utils/new-utility.js';`

### Adding New Block Types

1. **Update** `ContentWorkspace._createBlock()`:
```javascript
case 'newBlockType':
    // Handle rendering
    break;
```

2. **Add styling** in `src/styles/components.css`:
```css
.new-block-type {
    /* styles */
}
```

---

## Module Dependencies Map

```
app.js
  └─ ui-controller.js
      ├─ activity-bar.js
      ├─ navigation-panel.js
      ├─ content-workspace.js
      ├─ inspector-panel.js
      ├─ nn-classifier.js (core logic)
      ├─ csv-parser.js (utils)
      └─ file-handler.js (utils)

styles/
  ├─ variables.css (imported by others)
  ├─ layout.css (uses variables)
  └─ components.css (uses variables)
```

**No Circular Dependencies** - Clean unidirectional dependency chain

---

## Performance Considerations

1. **Lazy Loading:** Components only initialize when needed
2. **No Global State:** All state managed in UIController
3. **ES6 Modules:** Browser handles tree-shaking of unused code
4. **Minimal DOM:** Only visible components in DOM tree

---

## Testing Integration

### How to Test Each Module

**Core Logic (nn-classifier.js):**
```javascript
const classifier = new DNNClassifier();
classifier.initializeModel(config);
const predictions = classifier.predict(input);
assert(predictions.length === expectedOutputSize);
```

**UI Components (independent):**
```javascript
const panel = new NavigationPanel(testContainer);
panel.init(courses, callback);
assert(testContainer.querySelector('.nav-panel') !== null);
```

**Utilities (no DOM required):**
```javascript
const result = await CSVParser.parse(testFile);
assert(result.length > 0);
```

---

## VS Code Setup Recommendation

Create `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bierner.markdown-preview-github-styles"
  ]
}
```

Create `.eslintrc.json`:
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended"
}
```

---

## Summary of Changes from Original

| Aspect | Before | After |
|--------|--------|-------|
| Files | 1 (app.js + index.html) | 13 modular files |
| CSS | Inline in HTML | Separated into 3 files |
| Code Organization | Monolithic | Layered (core/ui/utils) |
| Module System | Global scope | ES6 modules |
| Reusability | Components mixed together | Isolated, reusable modules |
| Maintainability | Difficult | Clean separation of concerns |
| Testability | Tightly coupled | Independent modules |
| Scalability | Hard to extend | Easy to add features |

---

## Running the Application

```bash
# Option 1: Using vs Code Live Server
# Right-click on src/index.html → Open with Live Server

# Option 2: Using Python server
python -m http.server 8000
# Then visit: http://localhost:8000/src/index.html

# Option 3: Using Node.js http-server
npx http-server
# Then visit: http://localhost:8080/src/index.html
```

---

## Troubleshooting

**Issue:** Modules not loading (CORS error)?
- Use a local server (not `file://` protocol)
- See "Running the Application" section above

**Issue:** Styles not applied?
- Check CSS file paths in index.html are correct
- Verify variables.css loads before other CSS files

**Issue:** Components not rendering?
- Check browser console for errors
- Verify UIController.init() completes successfully
- Confirm workspace div exists in index.html

---

**End of Documentation**
