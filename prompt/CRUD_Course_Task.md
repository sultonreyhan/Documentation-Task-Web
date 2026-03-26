Project Context:
Saya sedang membangun website dokumentasi tugas berbasis Vanilla JS dengan konsep IDE-style workspace (mirip Visual Studio Code). Arsitektur project sudah FIX dan tidak boleh diubah.

Architecture Rules:

* Menggunakan Vanilla JS (NO React, NO Vue, NO TypeScript)
* Struktur folder:
  src/
  core/    → logic
  ui/      → UI components
  utils/   → helper
  styles/  → CSS
* Tidak boleh menambah root folder baru (seperti client/, components/, dll)
* UI harus modular (dipisah per komponen)

Concept:

* Navigation panel berisi struktur:
  Course → Task
* Menggunakan document flow (bukan canvas)
* Block system hanya untuk konten (bukan fokus sekarang)

Current Goal:
Menambahkan fitur CRUD TERBATAS hanya pada bagian Navigation Panel (Courses & Tasks), dengan fokus pada konsistensi posisi dan urutan.

---

NAVIGATION STRUCTURE REQUIREMENTS:

1. COURSE LIST

* Memiliki tombol "+" di pojok kanan header "COURSES"

* Selain itu, HARUS ada item khusus di dalam list:
  → "Add Course"

* Posisi:

  * Selalu berada di URUTAN PALING BAWAH dari daftar course
  * BUKAN posisi absolute di bawah container
  * Harus ikut flow list (seperti item biasa)

* Behavior:

  * Saat course baru ditambahkan:
    → masuk ke urutan terakhir
    → "Add Course" tetap berada di paling bawah

---

2. TASK LIST (DI DALAM COURSE)

* Setiap course memiliki daftar task

* HARUS ada item:
  → "Add Task"

* Posisi:

  * Selalu berada di urutan paling bawah dalam task list course tersebut
  * Mengikuti flow list

* Behavior:

  * Task baru selalu ditambahkan di akhir sebelum "Add Task"
  * "Add Task" tetap di posisi paling bawah

---

CRUD SCOPE:

Course:

* Tambah Course
* Rename Course (gunakan prompt())
* Hapus Course (gunakan confirm())

Task:

* Tambah Task
* Rename Task (prompt())
* Hapus Task (confirm())

---

DATA & STATE:

* Gunakan in-memory state (tidak perlu backend)

* Data harus berbentuk struktur seperti:

  courses: [
  {
  id,
  title,
  tasks: [
  { id, title }
  ]
  }
  ]

* Tidak boleh hardcode HTML, semua harus render dari state

---

DEFAULT CONTENT BEHAVIOR:

Saat user memilih / membuat task:

Content Workspace:

* Heading: "Content"
* Body: "This is content"

Metadata Panel:

* Course: mengikuti nama course
* Meeting: urutan task dibuat (Task 1, Task 2, dst)
* Date: tanggal saat task dibuat (auto generate)

Catatan:

* Metadata ini hanya READ-ONLY saat ini
* Akan menjadi editable di versi berikutnya (CRUD metadata), TIDAK perlu diimplementasikan sekarang

---

UI CONSTRAINTS:

* Jangan redesign layout utama
* Ikuti struktur visual seperti referensi:

  * Course seperti "Introduction to ML", "Deep Learning"
  * Task berada di dalam course
* "Add Course" dan "Add Task" harus terlihat seperti bagian dari list (bukan tombol terpisah)

---

TECHNICAL CONSTRAINTS:

* Pisahkan logic dan UI

* Gunakan pendekatan modular:

  * navigation.js (container)
  * course-item.js
  * task-item.js

* Gunakan data-driven rendering:
  state → render → UI

---

EXPECTED OUTPUT:

1. Desain struktur data final
2. Pseudocode render & CRUD flow
3. Penjelasan cara menjaga:

   * posisi "Add Course" & "Add Task"
   * urutan tetap konsisten
4. Breakdown file modular
5. Contoh implementasi sederhana (tidak overengineering)

---

IMPORTANT NOTES:

* Jangan gunakan framework apapun
* Jangan ubah arsitektur project
* Jangan membuat sistem kompleks
* Fokus hanya Navigation Panel (Courses & Tasks)
* Jangan implement fitur di luar scope (drag-drop, database, dll)

Mulai dari desain dulu, jangan langsung full coding.


## Revisi_1
Project Context:
Saya sedang mengembangkan website dokumentasi tugas berbasis Vanilla JS dengan konsep IDE-style workspace (mirip Visual Studio Code). Fitur CRUD untuk Course dan Task sudah berhasil diimplementasikan.

Namun setelah penambahan fitur tersebut, terjadi REGRESSION pada UI yang harus diperbaiki tanpa merusak fitur CRUD yang sudah berjalan.

---

MAIN PROBLEMS:

1. Warna UI menjadi tidak konsisten

   * Highlight course yang aktif tidak sesuai dengan desain awal
   * Kemungkinan class active/selected tidak diterapkan dengan benar

2. Icon panah (expand/collapse) pada course hilang

   * Sebelumnya setiap course memiliki ikon panah (▶ / ▼)
   * Digunakan untuk expand/collapse task list seperti folder di VSCode
   * Sekarang tidak muncul sama sekali

3. Behavior expand/collapse task tidak berfungsi

   * Task list tidak bisa di-toggle
   * Struktur hierarchy course → task menjadi tidak jelas

---

GOAL:

Memperbaiki tampilan dan behavior berikut:

1. Restore icon panah di setiap course:

   * ▶ (collapsed)
   * ▼ (expanded)

2. Restore fitur expand/collapse:

   * Klik course → toggle task list
   * State expand harus disimpan di state (bukan DOM saja)

3. Perbaiki konsistensi warna:

   * Active course memiliki highlight yang konsisten
   * Hover & selected state sesuai desain awal
   * Tidak merusak styling global

---

IMPORTANT UI RULES:

* Course harus terlihat seperti "folder"
* Task seperti "file" di dalamnya
* Icon panah berada di sebelah kiri nama course
* Task hanya muncul jika course dalam keadaan expanded

---

TECHNICAL REQUIREMENTS:

* Jangan ubah arsitektur project

* Tetap gunakan Vanilla JS

* Tetap modular:

  * navigation.js
  * course-item.js
  * task-item.js

* Tambahkan state berikut jika belum ada:

  course: {
  id,
  title,
  expanded: true/false,
  tasks: []
  }

---

EXPECTED FIX:

1. Tambahkan kembali render icon panah di course-item
2. Tambahkan logic toggle expand/collapse
3. Pastikan task list hanya render jika expanded = true
4. Perbaiki class CSS untuk:

   * active
   * hover
   * selected
5. Pastikan tidak ada inline style yang merusak theme

---

DEBUGGING INSTRUCTION:

* Cek apakah icon tidak dirender atau hanya hidden oleh CSS
* Cek apakah class active tertimpa oleh class lain
* Cek apakah event click override fungsi expand

---

IMPORTANT NOTES:

* Jangan rewrite seluruh sistem
* Jangan menghapus fitur CRUD yang sudah ada
* Fokus hanya pada perbaikan UI dan behavior yang hilang
* Gunakan pendekatan minimal perubahan (surgical fix)

Mulai dari analisis penyebab masalah, lalu berikan solusi dan implementasi perbaikan.


## Revisi_2
Project Context:
Saya sedang mengembangkan website dokumentasi tugas berbasis Vanilla JS dengan konsep IDE-style workspace (mirip Visual Studio Code). Fitur CRUD untuk Course dan Task sudah berjalan dengan baik.

Namun saat ini terdapat masalah pada konsistensi UI, khususnya pada penggunaan warna dan indikator visual di navigation panel (Course → Task).

Tujuan utama: memperbaiki konsistensi visual tanpa merusak fitur CRUD yang sudah ada.

---

CURRENT ISSUES:

1. Terlalu banyak indikator visual (warna & garis)

   * Ada garis vertikal berwarna (ungu pada course, biru pada task)
   * Warna muncul bahkan saat item belum dipilih

2. Warna tidak merepresentasikan state dengan jelas

   * Ungu dan biru digunakan bersamaan tanpa makna yang jelas
   * Beberapa item terlihat aktif padahal tidak dipilih

3. Parent (course) ikut terpengaruh saat child (task) di-hover

   * Ini menyebabkan visual ambiguity

---

DESIGN PRINCIPLE (WAJIB DIIKUTI):

1. Gunakan SATU warna utama:
   → Biru = SELECTED / ACTIVE ONLY

2. State harus jelas:

   * Default → tanpa warna (background normal)
   * Hover → abu tipis (subtle)
   * Selected → biru
   * Expanded → TIDAK menggunakan warna

3. Struktur ≠ warna:

   * Hierarki ditunjukkan oleh indent & arrow (▶ / ▼)
   * BUKAN oleh warna atau garis

---

REQUIRED CHANGES:

❌ REMOVE:

* Semua garis vertikal di kiri (ungu & biru)
* Warna default pada course dan task (jika belum dipilih)
* Penggunaan warna ungu sebagai state

✅ KEEP:

* Highlight berbasis opacity (grouping visual) yang sudah ada
* Struktur hierarchy (course → task)
* Indentasi task

🔄 MODIFY:

1. Highlight System:

   * Gunakan biru hanya untuk item yang dipilih (selected)
   * Opacity layering boleh dipertahankan untuk grouping, tetapi harus subtle

2. Hover Behavior:

   * Hover hanya mempengaruhi elemen yang disentuh
   * Tidak boleh mempengaruhi parent (course)

3. Expand/Collapse:

   * Gunakan arrow (▶ / ▼)
   * Tidak menggunakan warna tambahan

---

EXPECTED UI RESULT:

* Course & task terlihat clean (tanpa garis tambahan)
* Tidak ada warna mencolok sebelum interaksi
* Saat dipilih → baris berubah menjadi biru (seperti active item di VSCode)
* Hover hanya memberi efek ringan (abu)
* Hierarki tetap jelas hanya dengan indent + arrow

---

TECHNICAL NOTES:

* Jangan ubah arsitektur project

* Tetap gunakan Vanilla JS

* Jangan rewrite seluruh sistem

* Fokus pada perbaikan CSS + class state

* Pastikan class berikut digunakan dengan jelas:

  * .hover
  * .active / .selected

* Pastikan tidak ada CSS selector yang menyebabkan:
  parent berubah saat child di-hover

---

IMPORTANT:

* Ini adalah perbaikan UI (refinement), bukan penambahan fitur
* Jangan menambahkan indikator visual baru
* Gunakan pendekatan minimal perubahan (surgical fix)

Mulai dari analisis penyebab masalah, lalu implementasikan perbaikan secara bertahap.
