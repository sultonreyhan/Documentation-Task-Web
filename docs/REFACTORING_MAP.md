# Refactoring Mapping: From Monolithic to Modular

This document shows exactly which functions and responsibilities from the original code were moved to which files during the refactoring.

---

## Original Structure vs. New Structure

### Original Files
- `app.js` - 500+ lines containing everything
- `index.html` - HTML + inline CSS (1000+ lines)

### New Files
- **Core Logic:** `src/core/nn-classifier.js`
- **UI Components:** `src/ui/{ui-controller, activity-bar, navigation-panel, content-workspace, inspector-panel}.js`
- **Utilities:** `src/utils/{csv-parser, file-handler}.js`
- **Styles:** `src/styles/{variables, layout, components}.css`

---

## Function Migration Table

### From `ORIGINAL app.js` → Neural Network Core

| Original Function | New Location | Module | Notes |
|-------------------|--------------|--------|-------|
| `DNNClassifier.constructor()` | `src/core/nn-classifier.js` line 10 | `nn-classifier.js` | Moved intact |
| `parseCSV(file)` | **Moved to:** `src/utils/csv-parser.js` | `csv-parser.js` | Extracted as dedicated utility |
| `initializeModel(config)` | `src/core/nn-classifier.js` line 38 | `nn-classifier.js` | Exact copy |
| `_initializeWeights()` | `src/core/nn-classifier.js` line 65 | `nn-classifier.js` | Private method maintained |
| `_sigmoid(x)` | `src/core/nn-classifier.js` line 95 | `nn-classifier.js` | Activation function |
| `_forward(input)` | `src/core/nn-classifier.js` line 104 | `nn-classifier.js` | Forward propagation |
| `predict(input)` | `src/core/nn-classifier.js` line 139 | `nn-classifier.js` | Public prediction API |
| `predictClass(input)` | `src/core/nn-classifier.js` line 148 | `nn-classifier.js` | Class prediction |
| `train(data, labelColumn)` | `src/core/nn-classifier.js` line 157 | `nn-classifier.js` | Training loop |
| `_getFeatureMean(data, index)` | `src/core/nn-classifier.js` line 210 | `nn-classifier.js` | Helper function |
| `evaluate(testData, labelColumn)` | `src/core/nn-classifier.js` line 221 | `nn-classifier.js` | Model evaluation |
| `_calculateMetrics(predictions, labels)` | `src/core/nn-classifier.js` line 239 | `nn-classifier.js` | Metrics calculation |
| `getTrainingHistory()` | `src/core/nn-classifier.js` line 302 | `nn-classifier.js` | History getter |

**Total Functions Migrated to Core:** 13

---

### From `ORIGINAL app.js` → UI Utilities

| Original Function | New Location | Module | Notes |
|-------------------|--------------|--------|-------|
| `parseCSV(file)` | `src/utils/csv-parser.js` line 8 | `csv-parser.js` | **Extracted** from DNNClassifier |
| `CSVParser.getColumns(data)` | `src/utils/csv-parser.js` line 22 | `csv-parser.js` | **New** utility method |
| `CSVParser.validate(data, col)` | `src/utils/csv-parser.js` line 32 | `csv-parser.js` | **New** validation method |
| **File Export Logic** (from JSON export) | `src/utils/file-handler.js` line 8 | `file-handler.js` | **Extracted & Enhanced** |
| `downloadJSON(data, filename)` | `src/utils/file-handler.js` line 8 | `file-handler.js` | **New** - extracted from exportResults |
| `downloadCSV(data, filename)` | `src/utils/file-handler.js` line 24 | `file-handler.js` | **New** - CSV export added |
| `getTimestamp()` | `src/utils/file-handler.js` line 47 | `file-handler.js` | **New** - timestamp helper |

**Total Functions Extracted to Utilities:** 7

---

### From `ORIGINAL app.js` → UI Controller

| Original Function | New Location | Module | Notes |
|-------------------|--------------|--------|-------|
| `UIController.constructor()` | `src/ui/ui-controller.js` line 15 | `ui-controller.js` | Updated with new state |
| `UIController.init()` | `src/ui/ui-controller.js` line 22 | `ui-controller.js` | Now orchestrates components |
| `setupEventListeners()` | `src/ui/ui-controller.js` line 249 | `ui-controller.js` | Consolidated event setup |
| `handleTrainFileSelect()` | Renamed → `loadTrainData()` | `ui-controller.js` | Added error handling |
| `handleTestFileSelect()` | Renamed → `loadTestData()` | `ui-controller.js` | Added error handling |
| `trainModel()` | Renamed → `trainClassifier()` | `ui-controller.js` | Cleaner naming |
| `makePrediction(inputs)` | `src/ui/ui-controller.js` line 317 | `ui-controller.js` | Exact copy |
| `exportResults()` | `src/ui/ui-controller.js` line 341 | `ui-controller.js` | Now delegates to FileHandler |

**Total Functions in UI Controller:** 8

---

## New UI Components (Created for Modularity)

### `src/ui/activity-bar.js`
**Purpose:** Activity bar navigation

| Component | Method | Responsibility |
|-----------|--------|-----------------|
| `ActivityBar` | `init(items, callback)` | Initialize activity bar with items |
| | `setActive(element)` | Update active state |

**New lines of code:** ~50

---

### `src/ui/navigation-panel.js`
**Purpose:** Course/task navigation sidebar

| Component | Method | Responsibility |
|-----------|--------|-----------------|
| `NavigationPanel` | `init(courses, callback)` | Initialize with course hierarchy |
| | `_createCourseItem(course)` | Create expandable course items |

**New lines of code:** ~80

---

### `src/ui/content-workspace.js`
**Purpose:** Main content display area

| Component | Method | Responsibility |
|-----------|--------|-----------------|
| `ContentWorkspace` | `init()` | Initialize workspace |
| | `displayTask(task)` | Render task content |
| | `_createBlock(block)` | Create different block types |
| | `clear()` | Clear content |

**New lines of code:** ~100

---

### `src/ui/inspector-panel.js`
**Purpose:** Right metadata display panel

| Component | Method | Responsibility |
|-----------|--------|-----------------|
| `InspectorPanel` | `init()` | Initialize inspector |
| | `displayMetadata(metadata)` | Show metadata fields |
| | `clear()` | Clear display |

**New lines of code:** ~70

---

## Responsibility Reorganization

### Original Monolithic Organization:

```
app.js
├─ DNNClassifier (everything AI/ML)
│  ├─ Data parsing (CSV)
│  ├─ Model training
│  ├─ Predictions
│  └─ Evaluation
└─ UIController (everything UI)
   ├─ File handling
   ├─ Event listeners
   ├─ Form interaction
   └─ Direct DOM manipulation
```

### New Modular Organization:

```
Core Layer (AI/ML Logic)
└─ nn-classifier.js
   ├─ Model training
   ├─ Predictions
   └─ Evaluation

Utilities Layer (Support Functions)
├─ csv-parser.js
│  ├─ CSV parsing
│  └─ Data validation
└─ file-handler.js
   ├─ JSON export
   ├─ CSV export
   └─ File utilities

UI Layer (User Interface)
├─ ui-controller.js (orchestrator)
│  ├─ Component management
│  ├─ Event coordination
│  └─ Business logic integration
├─ activity-bar.js (left icons)
├─ navigation-panel.js (sidebar)
├─ content-workspace.js (main area)
└─ inspector-panel.js (right panel)

Styles Layer (Visual Design)
├─ variables.css (theme tokens)
├─ layout.css (4-panel layout)
└─ components.css (component styles)
```

---

## CSS Migration

### Original: All CSS in `index.html` (1000+ lines inline)

### New: Modularized into 3 files

| CSS Section | Original Location | New Location | Lines |
|-------------|------------------|--------------|-------|
| CSS Variables & Theme | Inline in `<style>` | `src/styles/variables.css` | 30 |
| 4-Panel Layout System | Inline in `<style>` | `src/styles/layout.css` | 80 |
| Component Styles | Inline in `<style>` | `src/styles/components.css` | 350 |
| **Total CSS** | **Original: 1000+** | **New: ~460 organized** | **Modular** |

**CSS File Organization:**
```
variables.css
  ├─ Color palette (--bg-main, --text-primary, etc.)
  ├─ Typography (--font-primary, --font-mono)
  ├─ Spacing scale (--spacing-xs through --spacing-2xl)
  └─ Design tokens

layout.css (depends on variables.css)
  ├─ Workspace flex layout
  ├─ Activity bar
  ├─ Navigation panel
  ├─ Content workspace
  ├─ Inspector panel
  └─ Scrollbar styling

components.css (depends on variables.css)
  ├─ Activity items
  ├─ Navigation items
  ├─ Content blocks
  ├─ Forms & inputs
  ├─ Buttons
  └─ Inspector fields
```

---

## Data Flow Changes

### Original Flow (Monolithic)
```
User Action
    ↓
UIController event handler
    ↓
Direct DOM manipulation
    ↓
Call to DNNClassifier method
    ↓
Result handling & export
```

### New Flow (Modular)
```
User Action
    ↓
UI Component (activity-bar, nav-panel, etc.)
    ↓  
Callback to UIController
    ↓
UIController orchestrates:
├─ Call appropriate core module (nn-classifier)
├─ Call utility module if needed (csv-parser, file-handler)
└─ Update other UI components (content-workspace, inspector-panel)
    ↓
Result display through component methods
```

---

## Breaking Down Complex Functions

### Example 1: File Upload Handling

**Original:** Single function in UIController
```javascript
async handleTrainFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        try {
            this.classifier.trainData = await this.classifier.parseCSV(file);
            // ...
        }
    }
}
```

**Refactored:** Separated concerns
```javascript
// In ui-controller.js
async loadTrainData(file) {
    this.state.trainData = await CSVParser.parse(file);  // Use utility
}

// In csv-parser.js (utils)
static async parse(file) {
    // CSV parsing logic isolated
}
```

### Example 2: Results Export

**Original:** Direct download via blob
```javascript
exportResults() {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    // ... direct blob handling
}
```

**Refactored:** Delegated to FileHandler utility
```javascript
// In ui-controller.js
exportResults() {
    FileHandler.downloadJSON(data, 'results.json');  // Cleaner API
}

// In file-handler.js (utils)
static downloadJSON(data, filename) {
    // All file handling logic isolated
}
```

---

## Testing Implications

### Original (Monolithic)
```javascript
// Cannot test CSV parsing without whole DNNClassifier class
// Cannot test UI events without DOM
// No way to test components in isolation
```

### New (Modular)
```javascript
// Test CSV parsing independently
const data = await CSVParser.parse(testFile);

// Test neural network without UI
const classifier = new DNNClassifier();
const predictions = classifier.predict(input);

// Test UI components with mock container
const panel = new NavigationPanel(mockContainer);

// Test utilities without dependencies
FileHandler.downloadJSON(testData, 'test.json');
```

---

## Summary Statistics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Main files | 2 | 13 clearly organized | +550% (modular) |
| Lines in app.js | 500+ | ~20 (just imports) | ✓ Cleaner |
| Largest file | app.js (500 LOC) | ~300 LOC per module | ✓ Manageable |
| CSS organization | 1000+ inline | 460 across 3 files | ✓ Maintainable |
| Circular dependencies | Possible | None | ✓ Clean |
| Reusable components | 0 | 5 UI components | ✓ Extensible |
| Testable modules | Low | High | ✓ Better |
| Lines to understand a feature | Could be anywhere | Specific to module | ✓ Faster |

---

## Migration Checklist

- ✅ Neural network logic → `src/core/nn-classifier.js`
- ✅ CSV parsing → `src/utils/csv-parser.js`
- ✅ File operations → `src/utils/file-handler.js`
- ✅ Activity bar logic → `src/ui/activity-bar.js`
- ✅ Navigation panel logic → `src/ui/navigation-panel.js`
- ✅ Content workspace logic → `src/ui/content-workspace.js`
- ✅ Inspector panel logic → `src/ui/inspector-panel.js`
- ✅ Main controller → `src/ui/ui-controller.js`
- ✅ Color variables → `src/styles/variables.css`
- ✅ Layout styles → `src/styles/layout.css`
- ✅ Component styles → `src/styles/components.css`
- ✅ Entry point → `src/app.js` (using ES6 modules)
- ✅ HTML template → `src/index.html` (minimal, modular)
- ✅ Architecture documentation → `docs/ARCHITECTURE.md`
- ✅ Refactoring mapping → `docs/REFACTORING_MAP.md` (this file)

---

## Next Steps for Developers

1. **Understand Module Boundaries:** Review ARCHITECTURE.md for each module's responsibility
2. **Test Independently:** Each module can be tested in isolation
3. **Extend Safely:** Add new features without affecting existing code
4. **Use TypeScript** (Optional): Consider adding TypeScript for better IDE support
5. **Add Build Tool** (Optional): Consider Webpack/Vite for production optimization

---

**End of Refactoring Mapping Document**
