# CRUD_1 — IMPLEMENTATION CHECKLIST

**Status:** Ready to Start  
**Last Updated:** March 28, 2026

---

## PHASE 1: STORAGE SYSTEM (localStorage)

### Part 1.1: Create storage.js
- [ ] Create file: `src/core/storage.js`
- [ ] Function: `initStorage()` - Initialize state from localStorage or use default
- [ ] Function: `loadFromStorage()` - Parse localStorage to JS object
- [ ] Function: `saveToStorage(state)` - Stringify & save state to localStorage
- [ ] Function: `getStorageKey()` - Return consistent key name
- [ ] Add error handling for JSON parse errors
- [ ] Add console logs for debugging

### Part 1.2: Test Storage Functions
- [ ] Verify `loadFromStorage()` returns correct structure
- [ ] Verify `saveToStorage()` writes to localStorage
- [ ] Test recovery from refresh (manual refresh page)
- [ ] Test with empty localStorage (first run)

### Part 1.3: Hook Storage to State Manager
- [ ] Modify `src/ui/state-manager.js` to use storage.js
- [ ] Call `initStorage()` on app load
- [ ] Call `saveToStorage()` after each state mutation (add/edit/delete)
- [ ] Verify state persists after page refresh

---

## PHASE 2: STATE STRUCTURE

### Part 2.1: Design Final State
- [ ] Define courses[] structure with all properties (id, title, expanded, tasks[])
- [ ] Define task[] structure (id, title, type, config, result)
- [ ] Create default data (at least 1 course with 2 tasks)
- [ ] Document in CRUD_1_PLANNING.md

### Part 2.2: Implement State Initialization
- [ ] Create default state constant in `src/ui/state-manager.js` or separate file
- [ ] Ensure state loads from storage OR uses default on first run
- [ ] Verify state structure consistency across app

### Part 2.3: Test State Consistency
- [ ] Add all CRUD operations (add/edit/delete)
- [ ] Verify state remains consistent after each operation
- [ ] Check localStorage reflects correct state
- [ ] Check UI renders correctly from state

---

## PHASE 3: TASK TYPE SYSTEM

### Part 3.1: Create Task Registry
- [ ] Create file: `src/registry/task-registry.js`
- [ ] Define TASK_REGISTRY object with structure:
  ```javascript
  {
    "type-name": {
      engine: function,
      renderer: function
    }
  }
  ```
- [ ] Export TASK_REGISTRY

### Part 3.2: Create Placeholder Engines
- [ ] Create `src/core/dnn-engine.js` with `runDNN(config)` → returns result object
- [ ] Create `src/core/color-engine.js` with `runColorClassifier(config)` → returns result object
- [ ] Both engines accept config from task.config
- [ ] Both return result object (not function/HTML)

### Part 3.3: Create Placeholder Renderers
- [ ] Create renderer functions in task-registry.js or separate files
- [ ] `renderDNNUI(task)` → return visual representation
- [ ] `renderColorUI(task)` → return visual representation
- [ ] Renderers are pure (no side effects)

### Part 3.4: Register Types in Registry
- [ ] Register "dnn-classifier" with engine + renderer
- [ ] Register "color-classifier" with engine + renderer
- [ ] Add export for registry access

---

## PHASE 4: TASK TYPE REGISTRY BEHAVIOR

### Part 4.1: Implement Task Rendering Logic
- [ ] Modify task rendering to use registry
- [ ] When rendering task: `TASK_REGISTRY[task.type].renderer(task)`
- [ ] Add error handling: if type not found → show error message
- [ ] Prevent breaking UI when type missing

### Part 4.2: Implement Task Execution Logic
- [ ] Create function to run task: `executeTask(task)`
- [ ] Get engine from registry: `TASK_REGISTRY[task.type].engine`
- [ ] Run engine with task.config
- [ ] Save result to task.result
- [ ] Update state + storage
- [ ] Add error handling for failures

### Part 4.3: Test Registry Functions
- [ ] Test task rendering with different types
- [ ] Test task execution produces correct result
- [ ] Test error handling with invalid type
- [ ] Test result persists in storage

---

## PHASE 5: CONFIG & RESULT FLOW

### Part 5.1: Implement Config Update Flow
- [ ] User edits config in UI (form/input)
- [ ] Update task.config in state
- [ ] Save to storage
- [ ] Re-render task UI

### Part 5.2: Implement Result Flow
- [ ] Engine generates result from config
- [ ] Result saved to task.result
- [ ] Result displayed in UI
- [ ] Result persists in storage

### Part 5.3: Implement Config Validation
- [ ] Add validation before engine execution
- [ ] Ensure config meets requirements (type checks, required fields)
- [ ] Show validation errors to user

---

## PHASE 6: UI INTEGRATION

### Part 6.1: Update Task Item Component
- [ ] Hook task rendering to use registry
- [ ] Add config input fields based on task type
- [ ] Add result display area
- [ ] Connect to storage on update

### Part 6.2: Update Course Item Component
- [ ] Ensure course data uses new state structure
- [ ] Verify expanded state persists

### Part 6.3: Test Full UI Flow
- [ ] Create new course/task → verify in state & storage
- [ ] Edit task config → verify result updates
- [ ] Refresh page → verify data persists
- [ ] Delete task → verify state & UI update

---

## PHASE 7: ERROR HANDLING & VALIDATION

### Part 7.1: Add Guard Clauses
- [ ] Check type exists in registry before using
- [ ] Check config is valid before engine execution
- [ ] Check localStorage is accessible (try/catch)

### Part 7.2: Error Display
- [ ] Show user-friendly error messages
- [ ] Log errors to console for debugging
- [ ] Prevent UI crashes on errors

### Part 7.3: Test Error Scenarios
- [ ] Test unknown task type → should show error
- [ ] Test invalid config → should show error
- [ ] Test localStorage disabled → should use memory state
- [ ] Test corrupted storage → should reset to default

---

## PHASE 8: VERIFICATION & TESTING

### Part 8.1: Functionality Tests
- [ ] ✅ Add course/task works
- [ ] ✅ Edit course/task works
- [ ] ✅ Delete course/task works
- [ ] ✅ Task execution produces correct result
- [ ] ✅ Data persists across refresh
- [ ] ✅ Registry works for multiple types

### Part 8.2: Code Quality
- [ ] ✅ No breaking changes to existing code
- [ ] ✅ Code is modular & readable
- [ ] ✅ No console errors
- [ ] ✅ Consistent naming conventions

### Part 8.3: Browser Testing
- [ ] ✅ Test in Chrome
- [ ] ✅ Test in Firefox (optional)
- [ ] ✅ Check localStorage works
- [ ] ✅ Check no memory leaks

### Part 8.4: Documentation
- [ ] ✅ Update code comments for clarity
- [ ] ✅ Document state structure in code
- [ ] ✅ Document registry usage
- [ ] ✅ Update CRUD_1_VERIFICATION.md with results

---

## NOTES

- ❗ Keep changes incremental - don't implement everything at once
- ❗ Test after each phase before moving to next
- ❗ Preserve existing functionality - no breaking changes
- ❗ Ask for clarification if requirements unclear

---

**See Also:**
- `CRUD_1_PLANNING.md` - Design & architecture
- `CRUD_1_VERIFICATION.md` - Post-implementation verification
