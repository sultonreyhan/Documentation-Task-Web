# 🎯 CRUD Navigation Panel - Design & Implementation

## 1️⃣ DESAIN STRUKTUR DATA FINAL

### A. Data Structure (In-Memory State)

```javascript
// src/data/courses-data.js
export const initialState = {
    courses: [
        {
            id: 'course-1',
            title: 'Introduction to ML',
            tasks: [
                { id: 'task-1', title: 'Data Preprocessing', createdAt: '2024-03-11' },
                { id: 'task-2', title: 'Model Training', createdAt: '2024-03-12' }
            ]
        },
        {
            id: 'course-2',
            title: 'Deep Learning',
            tasks: [
                { id: 'task-3', title: 'CNN Basics', createdAt: '2024-03-15' }
            ]
        }
    ]
};
```

### B. State Management (sederhana, in-memory)

```javascript
// src/ui/state-manager.js
export class StateManager {
    constructor(initialState) {
        this.state = JSON.parse(JSON.stringify(initialState)); // Deep copy
        this.listeners = [];
    }

    // Get current state
    getState() {
        return this.state;
    }

    // Update state & notify listeners
    setState(newState) {
        this.state = newState;
        this.listeners.forEach(listener => listener(this.state));
    }

    // Subscribe to changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}
```

---

## 2️⃣ PSEUDOCODE RENDER & CRUD FLOW

### A. Rendering Flow

```
┌─────────────────────────────────────┐
│  State Change                       │
│  (Add/Edit/Delete Course/Task)      │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  StateManager.setState(newState)    │
│  Notify all listeners               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  NavigationPanel.render(state)      │
│  Clear old DOM                      │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Render Courses                     │
│  For each course:                   │
│  ├─ Render course-item              │
│  ├─ Render tasks                    │
│  └─ Render "Add Task" button        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Render "Add Course" button         │
│  (Always at bottom)                 │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Attach Event Listeners             │
│  - Click handler untuk items        │
│  - CRUD buttons                     │
└─────────────────────────────────────┘
```

### B. CRUD Flow Detail

#### CREATE COURSE:
```
User clicks "Add Course" button
    ↓
Show prompt("Enter course name")
    ↓
Validate input (not empty)
    ↓
Create new course object:
{
    id: generateId(),
    title: userInput,
    tasks: []
}
    ↓
Add ke state.courses
    ↓
StateManager.setState(newState)
    ↓
Listeners triggered → NavigationPanel.render()
    ↓
"Add Course" tetap di paling bawah ✓
```

#### RENAME COURSE:
```
User clicks rename button di course
    ↓
Show prompt("New name?", currentName)
    ↓
Update course.title
    ↓
StateManager.setState(updatedState)
    ↓
Re-render
```

#### DELETE COURSE:
```
User clicks delete button
    ↓
Show confirm("Delete 'Course Name'?")
    ↓
Remove dari state.courses
    ↓
If deleted course was selected:
   → Clear ContentWorkspace
   → Clear InspectorPanel
    ↓
StateManager.setState(newState)
    ↓
Re-render
```

#### CREATE TASK:
```
User clicks "Add Task" di dalam course
    ↓
Show prompt("Enter task name")
    ↓
Create task object:
{
    id: generateId(),
    title: userInput,
    createdAt: new Date().toLocaleDateString()
}
    ↓
Add ke course.tasks (sebelum "Add Task")
    ↓
StateManager.setState(newState)
    ↓
"Add Task" stay di bottom ✓
```

#### RENAME TASK:
```
Similar ke rename course
Update task.title
Re-render
```

#### DELETE TASK:
```
Similar ke delete course
Remove task dari course.tasks
If deleted task was selected → Clear content
```

---

## 3️⃣ CARA MENJAGA "ADD COURSE" & "ADD TASK" DI POSISI BAWAH

### ✅ SOLUSI: List Item vs Button Distinction

```javascript
// Render logic (pseudocode)

function renderCourseList() {
    // 1. Render actual courses (dari state)
    state.courses.forEach(course => {
        renderCourseItem(course);
    });
    
    // 2. Render "Add Course" SELALU DI AKHIR
    // Ini adalah item khusus, bukan button terpisah
    renderAddCourseItem();  // Item ini di-render SETELAH semua courses
}

function renderTaskList(course) {
    // 1. Render actual tasks (dari state)
    course.tasks.forEach(task => {
        renderTaskItem(task);
    });
    
    // 2. Render "Add Task" SELALU DI AKHIR
    renderAddTaskItem(course.id);
}
```

### ✅ DOM Structure yang Benar

```html
<!-- Course List Container -->
<div class="nav-content">
    <!-- Actual Courses -->
    <div class="course-item" data-course-id="course-1">
        <div class="course-header">
            Introduction to ML
            <div class="course-actions">
                <button class="btn-rename">Rename</button>
                <button class="btn-delete">Delete</button>
            </div>
        </div>
        <div class="task-list">
            <!-- Actual Tasks -->
            <div class="task-item" data-task-id="task-1">
                Data Preprocessing
                <div class="task-actions">
                    <button class="btn-rename">Rename</button>
                    <button class="btn-delete">Delete</button>
                </div>
            </div>
            <!-- "Add Task" sebagai item -->
            <div class="task-item add-task-item">
                + Add Task
            </div>
        </div>
    </div>

    <!-- "Add Course" sebagai item -->
    <div class="course-item add-course-item">
        + Add Course
    </div>
</div>
```

### ⚠️ JANGAN LAKUKAN INI:

```javascript
// ❌ WRONG - Position absolute
const addBtn = document.createElement('button');
addBtn.style.position = 'absolute';
addBtn.style.bottom = '0';
// Ini akan terlepas dari flow!

// ❌ WRONG - Render di tempat random
renderAddCourseItem();
renderActualCourses();  // Urutan salah!

// ❌ WRONG - Hardcode HTML
container.innerHTML = `
    <div class="course-item">Course 1</div>
    <div class="add-course-item">+ Add</div>  // Hardcoded!
`;
```

---

## 4️⃣ BREAKDOWN FILE MODULAR

### Structure Recommendation:

```
src/
│
├── ui/
│   ├── navigation-panel.js          ← Main container & orchestrator
│   ├── course-item.js               ← Single course component
│   ├── course-add-item.js           ← "Add Course" special item
│   ├── task-item.js                 ← Single task component
│   ├── task-add-item.js             ← "Add Task" special item
│   ├── state-manager.js             ← State management
│   └── ui-controller.js             ← (existing) updated untuk state integration
│
├── data/
│   └── courses-data.js              ← Initial data
│
└── utils/
    ├── id-generator.js              ← Generate unique IDs
    └── date-formatter.js            ← Format dates untuk metadata
```

### File Responsibilities:

#### `src/ui/state-manager.js` (NEW)
- Manage in-memory state
- Notify on state changes
- Subscribe/unsubscribe listeners

#### `src/ui/navigation-panel.js` (UPDATED)
- Container component
- Orchestrate rendering
- Track selected course/task
- Attach event listeners

#### `src/ui/course-item.js` (NEW)
- Render single course
- Render course's tasks
- Render "Add Task" item khusus
- Emit events (select, rename, delete)

#### `src/ui/course-add-item.js` (NEW)
- Render "Add Course" item
- Emit add event

#### `src/ui/task-item.js` (NEW)
- Render single task
- Emit events (select, rename, delete)

#### `src/ui/task-add-item.js` (NEW)
- Render "Add Task" item
- Emit add event

#### `src/utils/id-generator.js` (NEW)
```javascript
export function generateId() {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

#### `src/utils/date-formatter.js` (NEW)
```javascript
export function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID');
}
```

---

## 5️⃣ CONTOH IMPLEMENTASI SEDERHANA

### A. State Manager

```javascript
// src/ui/state-manager.js

export class StateManager {
    constructor(initialState) {
        this.state = JSON.parse(JSON.stringify(initialState));
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = newState;
        // Notify semua listeners
        this.listeners.forEach(listener => listener(this.state));
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Helper methods untuk CRUD operations
    addCourse(title) {
        const { generateId } = require('../utils/id-generator.js');
        const newCourse = {
            id: generateId(),
            title,
            tasks: []
        };
        this.setState({
            courses: [...this.state.courses, newCourse]
        });
        return newCourse;
    }

    deleteCourse(courseId) {
        this.setState({
            courses: this.state.courses.filter(c => c.id !== courseId)
        });
    }

    renameCourse(courseId, newTitle) {
        const courses = this.state.courses.map(c =>
            c.id === courseId ? { ...c, title: newTitle } : c
        );
        this.setState({ courses });
    }

    addTask(courseId, title) {
        const { generateId } = require('../utils/id-generator.js');
        const { formatDate } = require('../utils/date-formatter.js');
        
        const courses = this.state.courses.map(course => {
            if (course.id === courseId) {
                const newTask = {
                    id: generateId(),
                    title,
                    createdAt: formatDate(new Date())
                };
                return {
                    ...course,
                    tasks: [...course.tasks, newTask]
                };
            }
            return course;
        });
        this.setState({ courses });
    }

    deleteTask(courseId, taskId) {
        const courses = this.state.courses.map(course => {
            if (course.id === courseId) {
                return {
                    ...course,
                    tasks: course.tasks.filter(t => t.id !== taskId)
                };
            }
            return course;
        });
        this.setState({ courses });
    }

    renameTask(courseId, taskId, newTitle) {
        const courses = this.state.courses.map(course => {
            if (course.id === courseId) {
                return {
                    ...course,
                    tasks: course.tasks.map(t =>
                        t.id === taskId ? { ...t, title: newTitle } : t
                    )
                };
            }
            return course;
        });
        this.setState({ courses });
    }
}
```

### B. Navigation Panel (Main Container)

```javascript
// src/ui/navigation-panel.js

import { CourseItem } from './course-item.js';
import { CourseAddItem } from './course-add-item.js';
import { StateManager } from './state-manager.js';

export class NavigationPanel {
    constructor(container, stateManager) {
        this.container = container;
        this.stateManager = stateManager;
        this.selectedCourse = null;
        this.selectedTask = null;
        
        // Subscribe to state changes
        this.unsubscribe = this.stateManager.subscribe((state) => {
            this.render(state);
        });
    }

    init() {
        const panel = document.createElement('div');
        panel.className = 'nav-panel';

        // Header
        const header = document.createElement('div');
        header.className = 'nav-header';
        header.innerHTML = '<h3>COURSES</h3>';
        panel.appendChild(header);

        // Content area
        const content = document.createElement('div');
        content.className = 'nav-content';
        content.id = 'navContent';
        panel.appendChild(content);

        this.container.appendChild(panel);
        this.navContent = content;

        // Initial render
        const state = this.stateManager.getState();
        this.render(state);
    }

    render(state) {
        // Clear content (tapi jangan destroy listeners)
        this.navContent.innerHTML = '';

        // 1. Render all courses
        state.courses.forEach(course => {
            const courseItem = new CourseItem(course, this.stateManager, this);
            courseItem.render(this.navContent);
        });

        // 2. Render "Add Course" item SELALU DI AKHIR
        const addCourseItem = new CourseAddItem(this.stateManager);
        addCourseItem.render(this.navContent);

        // Re-attach event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Course selection
        this.navContent.querySelectorAll('.course-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const courseId = e.currentTarget.closest('.course-item').dataset.courseId;
                this.selectCourse(courseId);
            });
        });

        // Add Course
        this.navContent.querySelector('.add-course-item')?.addEventListener('click', () => {
            this.handleAddCourse();
        });
    }

    handleAddCourse() {
        const name = prompt('Enter course name:');
        if (name && name.trim()) {
            this.stateManager.addCourse(name.trim());
        }
    }

    selectCourse(courseId) {
        this.selectedCourse = courseId;
        // Highlight selected course (di content workspace & inspector)
        // TODO: emit event ke UIController
    }

    selectTask(courseId, taskId) {
        this.selectedCourse = courseId;
        this.selectedTask = taskId;
        // TODO: emit event ke UIController untuk display content & metadata
    }

    destroy() {
        this.unsubscribe();
    }
}
```

### C. Course Item Component

```javascript
// src/ui/course-item.js

import { TaskItem } from './task-item.js';
import { TaskAddItem } from './task-add-item.js';

export class CourseItem {
    constructor(course, stateManager, navigationPanel) {
        this.course = course;
        this.stateManager = stateManager;
        this.navigationPanel = navigationPanel;
    }

    render(container) {
        const courseEl = document.createElement('div');
        courseEl.className = 'course-item';
        courseEl.dataset.courseId = this.course.id;

        // Course Header
        const header = document.createElement('div');
        header.className = 'course-header';

        const nameEl = document.createElement('div');
        nameEl.className = 'course-name';
        nameEl.textContent = this.course.title;
        header.appendChild(nameEl);

        // Course Actions
        const actions = document.createElement('div');
        actions.className = 'course-actions';

        const renameBtn = document.createElement('button');
        renameBtn.textContent = 'Rename';
        renameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleRename();
        });
        actions.appendChild(renameBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleDelete();
        });
        actions.appendChild(deleteBtn);

        header.appendChild(actions);
        courseEl.appendChild(header);

        // Task List
        const taskList = document.createElement('div');
        taskList.className = 'task-list';

        // Render actual tasks
        this.course.tasks.forEach(task => {
            const taskItem = new TaskItem(
                task,
                this.course.id,
                this.stateManager,
                this.navigationPanel
            );
            taskItem.render(taskList);
        });

        // Render "Add Task" item SELALU DI AKHIR
        const addTaskItem = new TaskAddItem(this.course.id, this.stateManager);
        addTaskItem.render(taskList);

        courseEl.appendChild(taskList);
        container.appendChild(courseEl);
    }

    handleRename() {
        const newName = prompt('New course name:', this.course.title);
        if (newName && newName.trim()) {
            this.stateManager.renameCourse(this.course.id, newName.trim());
        }
    }

    handleDelete() {
        if (confirm(`Delete course "${this.course.title}"?`)) {
            this.stateManager.deleteCourse(this.course.id);
        }
    }
}
```

### D. Task Item Component

```javascript
// src/ui/task-item.js

export class TaskItem {
    constructor(task, courseId, stateManager, navigationPanel) {
        this.task = task;
        this.courseId = courseId;
        this.stateManager = stateManager;
        this.navigationPanel = navigationPanel;
    }

    render(container) {
        const taskEl = document.createElement('div');
        taskEl.className = 'task-item';
        taskEl.dataset.taskId = this.task.id;

        const nameEl = document.createElement('div');
        nameEl.className = 'task-name';
        nameEl.textContent = this.task.title;
        taskEl.appendChild(nameEl);

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const renameBtn = document.createElement('button');
        renameBtn.textContent = 'Rename';
        renameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleRename();
        });
        actions.appendChild(renameBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleDelete();
        });
        actions.appendChild(deleteBtn);

        taskEl.appendChild(actions);

        // Click untuk select task
        taskEl.addEventListener('click', () => {
            this.navigationPanel.selectTask(this.courseId, this.task.id);
        });

        container.appendChild(taskEl);
    }

    handleRename() {
        const newName = prompt('New task name:', this.task.title);
        if (newName && newName.trim()) {
            this.stateManager.renameTask(
                this.courseId,
                this.task.id,
                newName.trim()
            );
        }
    }

    handleDelete() {
        if (confirm(`Delete task "${this.task.title}"?`)) {
            this.stateManager.deleteTask(this.courseId, this.task.id);
        }
    }
}
```

### E. Add Course Item Component

```javascript
// src/ui/course-add-item.js

export class CourseAddItem {
    constructor(stateManager) {
        this.stateManager = stateManager;
    }

    render(container) {
        const addCourseEl = document.createElement('div');
        addCourseEl.className = 'course-item add-course-item';

        const contentEl = document.createElement('div');
        contentEl.className = 'add-course-content';
        contentEl.textContent = '+ Add Course';

        addCourseEl.appendChild(contentEl);

        addCourseEl.addEventListener('click', () => {
            const name = prompt('Enter course name:');
            if (name && name.trim()) {
                this.stateManager.addCourse(name.trim());
            }
        });

        container.appendChild(addCourseEl);
    }
}
```

### F. Add Task Item Component

```javascript
// src/ui/task-add-item.js

export class TaskAddItem {
    constructor(courseId, stateManager) {
        this.courseId = courseId;
        this.stateManager = stateManager;
    }

    render(container) {
        const addTaskEl = document.createElement('div');
        addTaskEl.className = 'task-item add-task-item';

        const contentEl = document.createElement('div');
        contentEl.className = 'add-task-content';
        contentEl.textContent = '+ Add Task';

        addTaskEl.appendChild(contentEl);

        addTaskEl.addEventListener('click', () => {
            const name = prompt('Enter task name:');
            if (name && name.trim()) {
                this.stateManager.addTask(this.courseId, name.trim());
            }
        });

        container.appendChild(addTaskEl);
    }
}
```

---

## 6️⃣ INTEGRASI DENGAN UI CONTROLLER

```javascript
// src/ui/ui-controller.js (updated)

import { NavigationPanel } from './navigation-panel.js';
import { StateManager } from './state-manager.js';
import { initialState } from '../data/courses-data.js';

export class UIController {
    constructor() {
        this.stateManager = new StateManager(initialState);
        this.components = {};
    }

    async init() {
        const workspace = document.querySelector('.workspace');

        // Initialize Navigation Panel dengan StateManager
        this.components.navPanel = new NavigationPanel(
            workspace,
            this.stateManager
        );
        this.components.navPanel.init();

        // Initialize other components...
        // this.components.contentWorkspace = new ContentWorkspace(workspace);
        // this.components.inspector = new InspectorPanel(workspace);
    }
}
```

---

## 7️⃣ KEY POINTS SUMMARY

✅ **Posisi "Add Course":**
- Render **SETELAH** semua courses → selalu paling bawah
- Render dari state loop selesai
- Mengikuti document flow (bukan position absolute)

✅ **Posisi "Add Task":**
- Render **SETELAH** semua tasks dalam course → selalu paling bawah
- Same principle

✅ **Data-driven:**
- Semua dirender dari state
- Tidak ada hardcoded HTML
- State change → notify listeners → re-render otomatis

✅ **Modular:**
- Setiap component punya tanggung jawab sendiri
- StateManager terpisah dari UI
- Easy to test & maintain

✅ **CRUD:**
- Semua 4 operasi implemented
- Confirm/Prompt untuk UX
- State otomatis di-update → render otomatis

---

## 8️⃣ TESTING CHECKLIST

- [ ] Add course → muncul & "Add Course" tetap di bawah
- [ ] Rename course → title berubah
- [ ] Delete course → hilang dari list
- [ ] Add task → muncul di course & "Add Task" tetap di bawah
- [ ] Rename task → title berubah
- [ ] Delete task → hilang dari list
- [ ] Select task → display content & metadata
- [ ] Refresh state → semua tetap consistent
- [ ] Multiple courses & tasks → urutan correct
