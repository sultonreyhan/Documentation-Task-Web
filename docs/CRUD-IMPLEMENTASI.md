# 🔄 Implementasi CRUD untuk Meetings dan Sessions

## 📌 Overview

CRUD untuk Meetings = Operasi **Create, Read, Update, Delete** untuk setiap session/pertemuan dalam course.

---

## 1️⃣ Struktur CRUD System

### A. Storage Layer (Database/API)
**Tanggung jawab:** Menyimpan dan mengambil data

```javascript
// src/services/meeting-service.js
export class MeetingService {
    // CREATE - Membuat meeting baru
    async createMeeting(courseId, meetingData) { }
    
    // READ - Mengambil data meeting
    async getMeeting(meetingId) { }
    async getMeetingsByCoarse(courseId) { }
    
    // UPDATE - Mengubah meeting
    async updateMeeting(meetingId, meetingData) { }
    
    // DELETE - Menghapus meeting
    async deleteMeeting(meetingId) { }
}
```

### B. UI Layer (Components)
**Tanggung jawab:** Menampilkan form dan tombol CRUD

```javascript
// src/ui/meeting-crud-panel.js
export class MeetingCRUDPanel {
    // UI untuk membuat meeting baru
    renderCreateForm() { }
    
    // UI untuk mengubah meeting
    renderEditForm(meeting) { }
    
    // UI untuk konfirmasi delete
    renderDeleteConfirm(meeting) { }
}
```

### C. Controller Layer
**Tanggung jawab:** Menghubungkan UI dengan Storage

```javascript
// ui-controller.js
_handleCreateMeeting(courseId, formData) { }
_handleUpdateMeeting(meetingId, formData) { }
_handleDeleteMeeting(meetingId) { }
_handleGetMeetings(courseId) { }
```

---

## 2️⃣ Alur Sistem CRUD

```
┌──────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│  [+ Add Meeting] [Edit] [Delete] [View Tasks]            │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│                   UI CONTROLLER                          │
│  - Handle user events                                    │
│  - Validate input                                        │
│  - Call service methods                                  │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│                  MEETING SERVICE                         │
│  - CRUD operations                                       │
│  - Business logic                                        │
│  - Error handling                                        │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│               STORAGE (LocalStorage/API)                 │
│  - Save/Load data                                        │
│  - Persist changes                                       │
└──────────────────────────────────────────────────────────┘
```

---

## 3️⃣ Contoh Implementasi Lengkap

### STEP 1: Buat Meeting Service

```javascript
// src/services/meeting-service.js

export class MeetingService {
    constructor(storageKey = 'courses-meetings') {
        this.storageKey = storageKey;
    }

    // ===== READ =====
    
    /**
     * Get all meetings untuk suatu course
     */
    async getMeetingsByCoarse(courseId) {
        const data = this._load();
        return data
            .filter(meeting => meeting.courseId === courseId)
            .sort((a, b) => a.weekNumber - b.weekNumber);
    }

    /**
     * Get single meeting by ID
     */
    async getMeeting(meetingId) {
        const data = this._load();
        return data.find(m => m.id === meetingId);
    }

    // ===== CREATE =====

    /**
     * Create new meeting
     * @param {string} courseId - Course ID
     * @param {object} meetingData - {name, weekNumber, date, topic, description}
     */
    async createMeeting(courseId, meetingData) {
        const data = this._load();
        
        const newMeeting = {
            id: this._generateId('meeting'),
            courseId: courseId,
            name: meetingData.name,
            weekNumber: meetingData.weekNumber || 1,
            date: meetingData.date || new Date().toISOString(),
            topic: meetingData.topic || '',
            description: meetingData.description || '',
            tasks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.push(newMeeting);
        this._save(data);

        return newMeeting;
    }

    // ===== UPDATE =====

    /**
     * Update existing meeting
     */
    async updateMeeting(meetingId, updates) {
        const data = this._load();
        const index = data.findIndex(m => m.id === meetingId);

        if (index === -1) {
            throw new Error(`Meeting ${meetingId} not found`);
        }

        data[index] = {
            ...data[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this._save(data);
        return data[index];
    }

    // ===== DELETE =====

    /**
     * Delete meeting
     */
    async deleteMeeting(meetingId) {
        const data = this._load();
        const filtered = data.filter(m => m.id !== meetingId);

        if (filtered.length === data.length) {
            throw new Error(`Meeting ${meetingId} not found`);
        }

        this._save(filtered);
        return true;
    }

    // ===== HELPER METHODS =====

    /**
     * Load data from localStorage
     * @private
     */
    _load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to load meetings:', error);
            return [];
        }
    }

    /**
     * Save data to localStorage
     * @private
     */
    _save(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save meetings:', error);
            throw error;
        }
    }

    /**
     * Generate unique ID
     * @private
     */
    _generateId(prefix) {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
```

### STEP 2: Buat UI Component untuk CRUD

```javascript
// src/ui/meeting-manager-panel.js

import { MeetingService } from '../services/meeting-service.js';

export class MeetingManagerPanel {
    constructor(container) {
        this.container = container;
        this.service = new MeetingService();
        this.currentCourseId = null;
        this.meetings = [];
    }

    /**
     * Initialize panel
     */
    async init(courseId) {
        this.currentCourseId = courseId;
        await this.loadMeetings();
        this.render();
    }

    /**
     * Load meetings dari service
     */
    async loadMeetings() {
        try {
            this.meetings = await this.service.getMeetingsByCoarse(
                this.currentCourseId
            );
        } catch (error) {
            console.error('Failed to load meetings:', error);
            this.meetings = [];
        }
    }

    /**
     * Render panel UI
     */
    render() {
        const panel = document.createElement('div');
        panel.className = 'meeting-manager-panel';

        // Header
        const header = document.createElement('div');
        header.className = 'meeting-header';
        header.innerHTML = `
            <h3>📅 Meetings</h3>
            <button class="btn-add-meeting" title="Add new meeting">
                <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Meeting
            </button>
        `;
        panel.appendChild(header);

        // Meetings list
        const list = document.createElement('div');
        list.className = 'meetings-list';

        if (this.meetings.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'empty-state';
            empty.textContent = 'No meetings yet. Click "Add Meeting" to create one.';
            list.appendChild(empty);
        } else {
            this.meetings.forEach(meeting => {
                const item = this.createMeetingItem(meeting);
                list.appendChild(item);
            });
        }

        panel.appendChild(list);

        // Modal forms (hidden by default)
        const modals = document.createElement('div');
        modals.className = 'meeting-modals';
        modals.id = 'meetingModals';
        panel.appendChild(modals);

        // Clear container and append new panel
        this.container.innerHTML = '';
        this.container.appendChild(panel);

        // Attach event listeners
        this.attachEventListeners();
    }

    /**
     * Create meeting item element
     */
    createMeetingItem(meeting) {
        const item = document.createElement('div');
        item.className = 'meeting-item';
        item.dataset.meetingId = meeting.id;

        item.innerHTML = `
            <div class="meeting-item-content">
                <div class="meeting-week">Week ${meeting.weekNumber}</div>
                <div class="meeting-title">${meeting.name}</div>
                <div class="meeting-topic">${meeting.topic}</div>
                <div class="meeting-date">${new Date(meeting.date).toLocaleDateString()}</div>
            </div>
            <div class="meeting-item-actions">
                <button class="btn-edit" data-id="${meeting.id}" title="Edit">
                    <svg viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="btn-delete" data-id="${meeting.id}" title="Delete">
                    <svg viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
                <button class="btn-view" data-id="${meeting.id}" title="View tasks">
                    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        `;

        return item;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Add meeting button
        const addBtn = this.container.querySelector('.btn-add-meeting');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showCreateForm());
        }

        // Edit buttons
        this.container.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const meetingId = e.currentTarget.dataset.id;
                this.showEditForm(meetingId);
            });
        });

        // Delete buttons
        this.container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const meetingId = e.currentTarget.dataset.id;
                this.showDeleteConfirm(meetingId);
            });
        });

        // View buttons
        this.container.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const meetingId = e.currentTarget.dataset.id;
                this.viewMeetingTasks(meetingId);
            });
        });
    }

    /**
     * Show create meeting form
     */
    showCreateForm() {
        const modal = this.createFormModal({
            title: 'Create New Meeting',
            action: 'create',
            onSubmit: (data) => this.handleCreate(data)
        });
        this.container.querySelector('#meetingModals').appendChild(modal);
        modal.showModal();
    }

    /**
     * Show edit meeting form
     */
    async showEditForm(meetingId) {
        const meeting = await this.service.getMeeting(meetingId);
        const modal = this.createFormModal({
            title: 'Edit Meeting',
            action: 'edit',
            meeting: meeting,
            onSubmit: (data) => this.handleUpdate(meetingId, data)
        });
        this.container.querySelector('#meetingModals').appendChild(modal);
        modal.showModal();
    }

    /**
     * Show delete confirmation
     */
    showDeleteConfirm(meetingId) {
        const meeting = this.meetings.find(m => m.id === meetingId);
        if (!meeting) return;

        const confirmed = confirm(
            `Are you sure you want to delete "${meeting.name}"?\n\nThis action cannot be undone.`
        );

        if (confirmed) {
            this.handleDelete(meetingId);
        }
    }

    /**
     * Create form modal
     */
    createFormModal(config) {
        const dialog = document.createElement('dialog');
        dialog.className = 'meeting-form-modal';

        const form = document.createElement('form');
        form.innerHTML = `
            <h2>${config.title}</h2>
            
            <div class="form-group">
                <label for="meetingName">Meeting Name:</label>
                <input 
                    type="text" 
                    id="meetingName" 
                    name="name"
                    value="${config.meeting?.name || ''}"
                    placeholder="e.g., Week 1: Introduction"
                    required
                />
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="weekNumber">Week Number:</label>
                    <input 
                        type="number" 
                        id="weekNumber" 
                        name="weekNumber"
                        value="${config.meeting?.weekNumber || 1}"
                        min="1"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="meetingDate">Date:</label>
                    <input 
                        type="date" 
                        id="meetingDate" 
                        name="date"
                        value="${config.meeting?.date?.split('T')[0] || ''}"
                        required
                    />
                </div>
            </div>

            <div class="form-group">
                <label for="topic">Topic:</label>
                <input 
                    type="text" 
                    id="topic" 
                    name="topic"
                    value="${config.meeting?.topic || ''}"
                    placeholder="Main topic for this meeting"
                    required
                />
            </div>

            <div class="form-group">
                <label for="description">Description (optional):</label>
                <textarea 
                    id="description" 
                    name="description"
                    rows="4"
                    placeholder="Additional details about this meeting"
                >${config.meeting?.description || ''}</textarea>
            </div>

            <div class="form-actions">
                <button type="button" class="btn-cancel">Cancel</button>
                <button type="submit" class="btn-submit">
                    ${config.action === 'create' ? 'Create Meeting' : 'Update Meeting'}
                </button>
            </div>
        `;

        // Handle submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                weekNumber: parseInt(formData.get('weekNumber')),
                date: formData.get('date'),
                topic: formData.get('topic'),
                description: formData.get('description')
            };
            config.onSubmit(data);
            dialog.close();
            dialog.remove();
        });

        // Handle cancel
        form.querySelector('.btn-cancel').addEventListener('click', () => {
            dialog.close();
            dialog.remove();
        });

        dialog.appendChild(form);
        return dialog;
    }

    /**
     * Handle create meeting
     */
    async handleCreate(data) {
        try {
            await this.service.createMeeting(this.currentCourseId, data);
            await this.loadMeetings();
            this.render();
            console.log('Meeting created successfully');
        } catch (error) {
            console.error('Failed to create meeting:', error);
            alert('Failed to create meeting');
        }
    }

    /**
     * Handle update meeting
     */
    async handleUpdate(meetingId, data) {
        try {
            await this.service.updateMeeting(meetingId, data);
            await this.loadMeetings();
            this.render();
            console.log('Meeting updated successfully');
        } catch (error) {
            console.error('Failed to update meeting:', error);
            alert('Failed to update meeting');
        }
    }

    /**
     * Handle delete meeting
     */
    async handleDelete(meetingId) {
        try {
            await this.service.deleteMeeting(meetingId);
            await this.loadMeetings();
            this.render();
            console.log('Meeting deleted successfully');
        } catch (error) {
            console.error('Failed to delete meeting:', error);
            alert('Failed to delete meeting');
        }
    }

    /**
     * View meeting tasks
     */
    viewMeetingTasks(meetingId) {
        console.log('Viewing tasks for meeting:', meetingId);
        // TODO: Implement task list view for this meeting
    }
}
```

---

## 4️⃣ Integrasi dengan UIController

```javascript
// Perbarui ui-controller.js

import { MeetingManagerPanel } from './ui/meeting-manager-panel.js';

export class UIController {
    constructor() {
        // ... existing code
        this.meetingManager = new MeetingManagerPanel(workspace);
    }

    async init() {
        // ... existing init code

        // Initialize meeting manager when course is selected
        this.components.navPanel.onCourseSelect = async (course) => {
            await this.meetingManager.init(course.id);
        };
    }
}
```

---

## 5️⃣ Struktur File yang Direkomendasikan

```
src/
├── app.js
├── index.html
├── core/
│   └── nn-classifier.js
│
├── services/                    ← NEW
│   ├── meeting-service.js       ← NEW
│   └── task-service.js          ← NEW
│
├── ui/
│   ├── ui-controller.js
│   ├── activity-bar.js
│   ├── navigation-panel.js
│   ├── content-workspace.js
│   ├── inspector-panel.js
│   └── meeting-manager-panel.js ← NEW
│
├── utils/
│   ├── csv-parser.js
│   └── file-handler.js
│
└── styles/
    ├── variables.css
    ├── layout.css
    ├── components.css
    └── meetings.css              ← NEW
```

---

## 6️⃣ Contoh Penggunaan

### Dari mana data meetings disimpan?

**Jawab:** LocalStorage di browser
```javascript
// Data tersimpan di:
localStorage['courses-meetings']

// Format:
[
    {
        id: "meeting-1234567890",
        courseId: "course-001",
        name: "Week 1: Introduction",
        weekNumber: 1,
        date: "2024-03-11",
        topic: "Basics",
        ...
    },
    ...
]
```

### Bagaimana alur CRUD?

**CREATE:**
```
User klik "Add Meeting"
    ↓
Tampil form input
    ↓
User submit form
    ↓
MeetingService.createMeeting()
    ↓
Data disimpan ke localStorage
    ↓
Render ulang meeting list
```

**UPDATE:**
```
User klik "Edit" pada meeting
    ↓
Tampil form dengan data terkini
    ↓
User ubah dan submit
    ↓
MeetingService.updateMeeting()
    ↓
UpdatedAt timestampotomatis diperbarui
    ↓
Render ulang
```

**DELETE:**
```
User klik "Delete"
    ↓
Tampil konfirmasi
    ↓
User konfirmasi "Yes"
    ↓
MeetingService.deleteMeeting()
    ↓
Meeting dihapus dari localStorage
    ↓
Render ulang
```

---

## 7️⃣ Tips & Best Practices

✅ **DO:**
- Selalu validate input sebelum menyimpan
- Gunakan try-catch untuk error handling
- Buat backup data (export to JSON)
- Gunakan unique IDs untuk setiap entity
- Simpan timestamps (createdAt, updatedAt)

❌ **DON'T:**
- Langsung modify data tanpa validation
- Hardcode data ke dalam komponen
- Menghapus data tanpa konfirmasi
- Menyimpan data sensitif di localStorage

---

## 8️⃣ Langkah Implementasi

1. ✅ Buat file `src/services/meeting-service.js` (CRUD logic)
2. ✅ Buat file `src/ui/meeting-manager-panel.js` (UI components)
3. ✅ Tambahkan CSS untuk UI (meetings.css)
4. ✅ Integrasi dengan UIController
5. ✅ Test create, read, update, delete
6. ✅ Implementasi task CRUD (similar pattern)
7. ✅ Migrasikan hardcoded data ke localStorage
8. ✅ Implement backend API (future)
