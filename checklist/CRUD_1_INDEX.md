# CRUD_1 — SESSION INDEX

**Date:** March 28, 2026  
**Session Focus:** Storage System & Task Type Architecture  
**Status:** Planning Complete → Ready for Implementation

---

## 📋 CHECKLIST FILES IN THIS SESSION

All files bertujuan untuk implementasi **localStorage persistence + Task Type System** untuk CRUD Course Manager.

### 1. **CRUD_1_PLANNING.md**
   - Desain & requirements
   - State structure overview
   - Data flow diagrams
   - Architecture decisions
   - **Use When:** Understanding what needs to be built

### 2. **CRUD_1_IMPLEMENTATION_CHECKLIST.md**
   - Step-by-step implementation tasks
   - 8 phases dengan sub-tasks
   - Progress tracking
   - **Use When:** Actively developing (mark items as complete)

### 3. **CRUD_1_VERIFICATION.md**
   - Post-implementation verification
   - Testing checklist
   - Browser compatibility
   - Sign-off template
   - **Use When:** Finishing implementation & testing

---

## 🎯 QUICK REFERENCE

### Key Objectives
1. ✅ Data persists across page refresh (localStorage)
2. ✅ Task bisa have different logic (Task Type System)
3. ✅ Registry untuk mapping type → engine → renderer
4. ✅ Stay modular & scalable

### Files to Create
```
src/core/storage.js          → localStorage management
src/core/dnn-engine.js       → DNN classifier logic
src/core/color-engine.js     → Color classifier logic
src/registry/task-registry.js → Type mapping
```

### Files to Modify
```
src/ui/state-manager.js      → Hook storage
src/ui/task-item.js          → Use registry for rendering
src/ui/course-item.js        → Support new state
src/app.js                   → Initialize storage
```

---

## 📊 STATE STRUCTURE (FINAL)

```javascript
{
  courses: [
    {
      id: "uuid",
      title: "Course Name",
      expanded: true,
      tasks: [
        {
          id: "uuid",
          title: "Task Name",
          type: "dnn-classifier",      // key untuk registry
          config: { /* user input */ },
          result: { /* engine output */ }
        }
      ]
    }
  ]
}
```

---

## 🔄 DATA FLOW

```
START
  ↓
[LOAD] → Check localStorage → Parse JSON
  ↓ (tidak ada) → Use default state
  ↓
[UI RENDER] → Render from state using registry
  ↓
[USER ACTION] → Add/Edit/Delete Course/Task
  ↓
[UPDATE] → State + localStorage
  ↓
[RE-RENDER] → UI updates automatically
  ↓
[EXECUTE] → Task execution → Engine → Result
  ↓
[PERSIST] → Save result to state + storage
  ↓
LOOP (user action → update → render)
```

---

## ✅ IMPLEMENTATION PHASES

| # | Phase | Files | Status |
|---|-------|-------|--------|
| 1 | Storage System | storage.js | 🔵 Ready |
| 2 | State Structure | state-manager.js | 🔵 Ready |
| 3 | Task Type System | task-registry.js | 🔵 Ready |
| 4 | Registry Behavior | task-item.js | 🔵 Ready |
| 5 | Config & Result | state-manager.js | 🔵 Ready |
| 6 | UI Integration | course/task components | 🔵 Ready |
| 7 | Error Handling | all files | 🔵 Ready |
| 8 | Testing & Verify | see verification.md | 🔵 Ready |

---

## 🚀 GETTING STARTED

### Step 1: Read Documents
1. Read `CRUD_1_PLANNING.md` untuk understand architecture
2. Read `CRUD_1_IMPLEMENTATION_CHECKLIST.md` untuk understand tasks

### Step 2: Start Implementation
1. Follow Phase 1-8 in checklist
2. Create/modify files sesuai urutan
3. Test setiap phase sebelum lanjut

### Step 3: Complete & Verify
1. Fill in `CRUD_1_VERIFICATION.md` saat complete
2. Run all tests
3. Check "Ready for Production"

---

## 📌 IMPORTANT RULES

❗ **localStorage Rules:**
- Simpan hanya DATA (bukan function/HTML)
- Jangan manipulasi langsung dari UI → harus lewat state
- Gunakan JSON stringify/parse

❗ **Task Type Rules:**
- Type berbeda logic? → Tipe baru
- Type sama, hanya parameter berbeda? → Config only
- Selalu check registry sebelum akses

❗ **UI Rules:**
- Render dari state saja (state = single source of truth)
- Graph/visual di-generate ulang (tidak disimpan)
- Update config → save state → persist storage

❗ **No Breaking Changes:**
- Jangan ubah struktur project
- Jangan rewrite existing code
- Jangan tambah framework/library

---

## 📁 FOLDER STRUCTURE AFTER COMPLETION

```
c:\Documentation-Task-Web\
├── src/
│   ├── app.js
│   ├── index.html
│   ├── core/
│   │   ├── nn-classifier.js
│   │   ├── storage.js ✨ NEW
│   │   ├── dnn-engine.js ✨ NEW
│   │   └── color-engine.js ✨ NEW
│   ├── registry/
│   │   └── task-registry.js ✨ NEW
│   ├── ui/
│   │   ├── state-manager.js (MODIFIED)
│   │   ├── task-item.js (MODIFIED)
│   │   └── ...
│   └── utils/
```

---

## 🤝 NOTES FOR NEXT SESSION

- Semua checklist files sudah di folder `/checklist/`
- Prefix `CRUD_1_` untuk membedakan session ini
- Jika ada session baru, buat folder baru dengan prefix berbeda
- Keep checklist files updated untuk tracking progress

---

**Related Resources:**
- `prompt/CRUD_Course_Task_1.md` - Original detailed requirements
- `docs/ARCHITECTURE.md` - Project architecture overview
- Browser DevTools → Application tab → localStorage (untuk debug)

---

**Session Status:** ✅ Planning Complete → Ready for Development  
**Next Action:** Start Phase 1 (Create storage.js)
