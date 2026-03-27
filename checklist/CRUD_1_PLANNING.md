# CRUD_1 — STORAGE & TASK TYPE SYSTEM - PLANNING

**Status:** Planning Phase  
**Date:** March 28, 2026

---

## PROJECT OVERVIEW

Mengembangkan sistem CRUD Course & Task dengan:
- **Persistence:** localStorage (JSON-based)
- **Scalability:** Task Type System
- **Modularity:** Task Type Registry

---

## ARCHITECTURE REQUIREMENTS

### Constraints (WAJIB):
- ✅ Vanilla JS (NO React, Vue, TypeScript)
- ✅ Struktur folder TIDAK berubah (no new root folders)
- ✅ UI harus modular
- ✅ Jangan rewrite sistem existing

### Goals:
1. Data persisten across refresh
2. Task bisa punya logic berbeda (scalable)
3. Tetap modular & tidak overengineering

---

## DESIGN TARGETS

### STATE STRUCTURE
```javascript
courses: [
  {
    id,
    title,
    expanded: true/false,
    tasks: [
      {
        id,
        title,
        type,        // penentu logic
        config,      // input/parameter (editable)
        result       // output hasil logic
      }
    ]
  }
]
```

### TASK REGISTRY MAPPING
```javascript
TASK_REGISTRY = {
  "dnn-classifier": {
    engine: runDNN,
    renderer: renderDNNUI
  },
  "color-classifier": {
    engine: runColorClassifier,
    renderer: renderColorUI
  }
}
```

### DATA FLOW DIAGRAM
```
Load (start) 
  ↓
Check localStorage
  ↓ (jika ada) → Parse JSON
  ↓ (jika tidak) → Use default state
  ↓
Render UI from state
  ↓
User interact (add/edit/delete)
  ↓
Update state + localStorage
  ↓
Re-render
```

---

## IMPLEMENTATION PHASES

### Phase 1: Foundation (Storage & State)
- [ ] Design final state structure
- [ ] Implement storage.js (load/save functions)
- [ ] Implement state initialization
- [ ] Test localStorage persistence

### Phase 2: Registry System
- [ ] Create task-registry.js
- [ ] Implement type mapping
- [ ] Add error handling for unknown types
- [ ] Create placeholder engines (dnn, color)

### Phase 3: Integration
- [ ] Hook storage to existing UI
- [ ] Hook registry to task rendering
- [ ] Connect config updates to storage
- [ ] Test full workflow

### Phase 4: Verification
- [ ] Test data persistence
- [ ] Test task type switching
- [ ] Test error handling
- [ ] Browser compatibility check

---

## FILES TO CREATE/MODIFY

### New Files:
- `src/core/storage.js` → Load/save localStorage
- `src/core/dnn-engine.js` → DNN logic placeholder
- `src/core/color-engine.js` → Color logic placeholder
- `src/registry/task-registry.js` → Type mapping

### Potentially Modify:
- `src/ui/course-item.js` → Hook storage
- `src/ui/task-item.js` → Use registry for rendering
- `src/ui/state-manager.js` → Connect to storage
- `src/app.js` → Initialize storage on load

---

## NOTES & CONSIDERATIONS

### Important Rules:
- ❗ localStorage hanya simpan DATA (bukan logic/function)
- ❗ Jangan manipulasi localStorage langsung dari UI → harus lewat state
- ❗ Graph/visual di-generate ulang dari config (TIDAK disimpan)
- ❗ Jangan simpan function, HTML di JSON → simpan hanya data

### Scalability Pattern:
```
Logic berbeda? → Tipe baru
Parameter berbeda? → Tetap tipe sama, ubah config
```

---

## SUCCESS CRITERIA

✅ State structure consistent across app  
✅ Data survives page refresh  
✅ Task registry works for 2+ types  
✅ Error handling for invalid types  
✅ No breaking changes to existing UI  
✅ Code remains modular & readable

---

**Next Step:** START IMPLEMENTATION (see CRUD_1_IMPLEMENTATION_CHECKLIST.md)
