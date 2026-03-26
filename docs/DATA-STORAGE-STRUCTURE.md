# 📊 Struktur Penyimpanan Data - Courses, Meetings, dan Tasks

## 🎯 Gambaran Umum

Aplikasi ini mengorganisir data dalam struktur hierarki **3-level**:

```
Courses (Mata Kuliah)
    └─ Meetings/Sessions (Pertemuan)
        └─ Tasks (Tugas/Kuis/Materi)
            └─ Blocks (Konten - teks, kode, gambar, dll)
```

---

## 1️⃣ Struktur Data Saat Ini

### Level 1: COURSES (Mata Kuliah)
```javascript
{
    id: "course-001",
    name: "Introduction to ML",
    description: "Pengenalan Machine Learning",
    icon: "ml-icon",
    color: "#FF6B6B",
    meetings: [ ...array of meetings ]
}
```

### Level 2: MEETINGS (Pertemuan)
```javascript
{
    id: "meeting-001",
    courseId: "course-001",
    name: "Week 1: Data Preprocessing",
    weekNumber: 1,
    date: "2024-03-11",
    topic: "Data cleaning and normalization",
    tasks: [ ...array of tasks ]
}
```

### Level 3: TASKS (Tugas)
```javascript
{
    id: "task-001",
    meetingId: "meeting-001",
    courseId: "course-001",
    name: "Understanding Data Types",
    type: "exercise", // atau "quiz", "reading", "assignment"
    blocks: [ ...array of content blocks ],
    metadata: {
        course: "Introduction to ML",
        meeting: "Week 1",
        date: "2024-03-11",
        tags: "preprocessing, data",
        difficulty: "beginner",
        duration: 30  // dalam menit
    }
}
```

### Level 4: BLOCKS (Konten)
```javascript
{
    label: "LEARNING GOAL",
    type: "text", // atau "pseudocode", "code", "image", "question"
    content: "Understand data normalization and cleaning",
    optional: false
}
```

---

## 2️⃣ Di Mana Data Disimpan Saat Ini?

### ❌ Masalah Saat Ini:
- Data **hardcoded** di file `ui-controller.js` dalam method `_loadCourses()`
- Tidak ada database atau storage persistem
- Data **hilang** saat refresh halaman
- Tidak ada CRUD operations

### ✅ Solusi yang Disarankan:
Gunakan **LocalStorage** atau implementasikan **backend API**

```
┌─────────────────────────────────────────┐
│         Pilihan Penyimpanan             │
├─────────────────────────────────────────┤
│  1. LocalStorage (Client-side)          │
│     ✓ Mudah diimplementasikan           │
│     ✓ Cocok untuk prototype             │
│     ✗ Limited storage (~5MB)            │
│     ✗ Tidak sync antar device           │
├─────────────────────────────────────────┤
│  2. Backend API (Recommended)           │
│     ✓ Unlimited storage                 │
│     ✓ Sync antar device                 │
│     ✓ Multi-user support                │
│     ✗ Perlu setup server                │
├─────────────────────────────────────────┤
│  3. Firebase/Supabase (Hybrid)          │
│     ✓ Scalable                          │
│     ✓ Real-time sync                    │
│     ✓ Authentication built-in           │
│     ✗ Dependency eksternal              │
└─────────────────────────────────────────┘
```

---

## 3️⃣ Alur Data Saat Ini

```
┌─────────────────────────────────────────────────────────┐
│  Browser Load                                           │
│  index.html                                             │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  app.js                                                 │
│  initializeApp() → new UIController()                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  UIController.init()                                    │
│  - Calls _loadCourses()                                 │
│  - Returns hardcoded course data                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  NavigationPanel.init(courses)                          │
│  - Displays courses and tasks in sidebar                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  User Interaction                                       │
│  - Click task → ContentWorkspace.displayTask()          │
│  - Show metadata → InspectorPanel.displayMetadata()     │
└─────────────────────────────────────────────────────────┘
```

---

## 4️⃣ Bagaimana Untuk Tiap Course Berbeda Tampilan?

Setiap course dapat memiliki **styling unik** berdasarkan metadata:

### Per Course Styling:
```javascript
// Di setiap course object
{
    id: "course-001",
    name: "Introduction to ML",
    
    // Styling configuration
    theme: {
        primaryColor: "#FF6B6B",
        icon: "book-open",
        layout: "standard", // atau "card", "timeline"
        customCSS: "/styles/themes/ml-theme.css"
    }
}
```

### Implementasi:
```javascript
// ui-controller.js
_applyTheme(course) {
    const theme = course.theme || {};
    document.documentElement.style.setProperty(
        '--primary-color', 
        theme.primaryColor || '#6C5CE7'
    );
    // Load custom CSS if exists
    if (theme.customCSS) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = theme.customCSS;
        document.head.appendChild(link);
    }
}
```

---

## 5️⃣ Struktur Directory untuk Multi-Course Support

```
src/
├── data/
│   ├── courses/              # ← Course configuration
│   │   ├── ml-basics.js
│   │   ├── deep-learning.js
│   │   └── web-dev.js
│   │
│   ├── meetings/             # ← Meeting & Task data
│   │   ├── ml-basics-meetings.js
│   │   └── deep-learning-meetings.js
│   │
│   └── db.js                 # ← Data access layer
│
├── services/
│   └── api-service.js        # ← API calls (future)
```

---

## 📋 Checklist untuk Implementasi

- [ ] Tentukan storage method (LocalStorage / Backend API)
- [ ] Buat data access layer (repository pattern)
- [ ] Move hardcoded data ke file terpisah
- [ ] Implement CRUD for Meetings
- [ ] Update UI components untuk CRUD
- [ ] Add authentication/permission management
