# CRUD_1 — QUICK TEST GUIDE

**Date:** March 28, 2026  
**Purpose:** Manual testing checklist for CRUD_1 implementation

---

## 🧪 QUICK TEST STEPS

### Test 1: First Load & Default Data
```
1. Open src/index.html in browser
2. Check console for: "✓ Storage initialized" message
3. Verify sample course visible in left panel
4. Verify 2 sample tasks shown
Expected: Should see "Sample Course" with 2 tasks
```

### Test 2: Task Type Display
```
1. Look at task items in left panel
2. Check task type badge (e.g., "🧠 DNN Classifier")
3. Verify color/styling differs per type
Expected: Each task shows correct type badge + icon
```

### Test 3: Execute DNN Task
```
1. Click "▶ Run" button on "Sample Task - DNN Classifier"
2. Check console for execution logs
3. View result displayed in content area
4. Verify shows classification + confidence
Expected: 
  - Console: "🔹 Executing DNN Classifier"
  - Result shows class prediction + confidence
  - Task shows "✓ Has result" indicator
```

### Test 4: Execute Color Task
```
1. Click "▶ Run" button on "Sample Task - Color Classifier"
2. Check console for execution logs
3. View result with color swatch
4. Verify shows color name + hex + RGB
Expected:
  - Console: "🔹 Executing Color Classifier"
  - Result shows color swatch (visual box)
  - Displays color information (name, hex, RGB)
```

### Test 5: Page Refresh Persistence
```
1. After executing both tasks, refresh page (Ctrl+R)
2. Check console for: "✓ State loaded from localStorage"
3. Verify results still visible after refresh
Expected:
  - Data persists
  - Results still shown
  - localStorage message in console
```

### Test 6: localStorage Inspection
```
1. Press F12 (DevTools)
2. Go to Application tab → Local Storage
3. Find key: "crud-course-manager-state"
4. View JSON structure
5. Verify tasks with type/config/result fields
Expected:
  - Valid JSON structure
  - Contains courses, tasks, types
  - Results populated after execution
```

### Test 7: Add New Course
```
1. Click "New Course" button
2. Type course name
3. Verify added to state
4. Add a task to new course
5. Refresh → verify persists
Expected:
  - Course creates with new state structure
  - Can add tasks to it
  - Persists on refresh
```

### Test 8: Task Rename
```
1. Click "Rename" on a task
2. Type new name
3. Confirm change
Expected:
  - Task name updates
  - State persists on refresh
```

### Test 9: Task Delete
```
1. Click "Delete" on a task
2. Confirm deletion
3. Verify task removed
4. Refresh → verify deleted
Expected:
  - Task removed
  - Persists after refresh
  - Storage updated
```

### Test 10: Error Handling
```
1. Open DevTools console
2. Manually edit localStorage JSON to:
   - Change a task type to "invalid-type"
   - Save changes
3. Refresh page
4. Check task display
Expected:
  - Task shows error badge: "❌ Unknown (invalid-type)"
  - No crash
  - App still functional
  - Error message in console
```

---

## 🔍 WHAT TO CHECK IN CONSOLE

When everything works correctly, you should see logs like:

```
✓ Storage initialized: {courses: Array(1)}
✓ State saved to localStorage
✓ State loaded from localStorage
🔹 Executing DNN Classifier with config: {inputSize: 784, outputSize: 10}
✓ DNN result: {type: 'dnn-classifier', classification: 'Class 3', ...}
✓ State saved to localStorage
```

If something is wrong, look for errors like:

```
Error executing task: Unknown task type: "invalid-type"
Failed to parse localStorage: SyntaxError
```

---

## 📊 VERIFICATION CHECKLIST

| Test | Status | Notes |
|------|--------|-------|
| Default data loads | [ ] | Should see Sample Course |
| Type badges display | [ ] | 🧠 and 🎨 icons visible |
| DNN execution works | [ ] | Produces classification result |
| Color execution works | [ ] | Shows color swatch + info |
| Data persists on refresh | [ ] | Still there after Ctrl+R |
| localStorage saves correctly | [ ] | Can inspect in DevTools |
| New course creation | [ ] | New courses have new structure |
| Task rename works | [ ] | Updates and persists |
| Task delete works | [ ] | Removes and persists |
| Error handling | [ ] | Invalid types show error badge |

---

## 🐛 TROUBLESHOOTING

### Issue: Tasks not showing type badge
**Solution:** Check console for errors. Task might not have `type` property.

### Issue: Execute button not appearing
**Solution:** Task type might be unknown. Check task structure in DevTools Application tab.

### Issue: Results not displaying
**Solution:** Check that renderer function is defined in registry for that type.

### Issue: Data not persisting
**Solution:** Check DevTools Console for "Failed to save to storage" error. May be quota issue.

### Issue: localStorage appears empty
**Solution:** On first run, data hasn't been added yet. Create/execute a task first.

---

## 🎯 SUCCESS CRITERIA

After all tests pass:
- ✅ Data persists across page refresh
- ✅ All 10 manual tests pass
- ✅ No console errors
- ✅ localStorage shows valid JSON state
- ✅ Task execution produces correct results
- ✅ UI elements display correctly
- ✅ Error handling works gracefully

---

## 📝 TEST NOTES

**Tested By:** _________________  
**Date:** _________________  
**Browser:** _________________  
**Issues Found:** 

```
(List any issues or unexpected behavior)
```

**Sign-Off:** 
I confirm all tests passed and CRUD_1 is ready for production use.

_Signature:_ _________________ Date: _________

---

**See Also:** CRUD_1_VERIFICATION.md for more detailed testing info
