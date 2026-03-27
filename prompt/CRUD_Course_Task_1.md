Project Context:
Saya sedang mengembangkan website dokumentasi tugas berbasis Vanilla JS dengan konsep IDE-style workspace (mirip Visual Studio Code). Sistem sudah memiliki fitur CRUD untuk Course dan Task serta UI navigation panel.

Sekarang saya ingin mengembangkan sistem agar:

* Data tidak hilang saat refresh (persistent)
* Task bisa memiliki logic berbeda (scalable)
* Sistem tetap modular dan tidak overengineering

---

ARCHITECTURE RULES (WAJIB DIIKUTI):

* Gunakan Vanilla JS (NO React, NO Vue, NO TypeScript)

* Struktur project TIDAK boleh diubah:
  src/
  core/    → logic (engine)
  ui/      → UI components
  utils/   → helper
  styles/  → CSS

* Tidak boleh menambah root folder baru

* UI harus tetap modular

* Jangan rewrite sistem yang sudah ada

---

GOAL UTAMA:

1. Menambahkan persistence menggunakan localStorage (JSON)
2. Mendesain struktur state untuk Course & Task
3. Mengimplementasikan Task Type System
4. Membuat Task Type Registry (mapping type → engine → UI)

---

PART 1 — STORAGE SYSTEM (localStorage)

Implementasikan sistem penyimpanan lokal:

* Gunakan localStorage
* Data disimpan dalam bentuk JSON (stringify / parse)

Behavior:

* Saat aplikasi load:
  → cek localStorage
  → jika ada → load ke state
  → jika tidak → gunakan default state

* Saat terjadi perubahan:
  (add / rename / delete course/task, update config, update result)
  → update state
  → simpan ke localStorage

Catatan:

* localStorage hanya menyimpan DATA (bukan logic)
* Jangan langsung manipulasi localStorage dari UI, harus lewat state

---

PART 2 — STATE STRUCTURE

Gunakan struktur berikut sebagai standar:

courses: [
{
id,
title,
expanded: true/false,
tasks: [
{
id,
title,

```
    type,        // penentu logic
    config,      // input/parameter (editable dari UI)
    result       // output dari logic
  }
]
```

}
]

Catatan:

* Setiap task WAJIB punya: type, config, result
* Struktur harus konsisten untuk semua task

---

PART 3 — TASK TYPE SYSTEM

Konsep:

* Type = engine (logika)
* Task = instance

Contoh:

* "dnn-classifier"
* "color-classifier"

Aturan:

* Jika logic berbeda → type baru
* Jika hanya parameter berbeda → tetap type yang sama

---

PART 4 — TASK TYPE REGISTRY

Buat sistem registry untuk mapping:

type → engine → renderer

Contoh struktur:

const TASK_REGISTRY = {
"dnn-classifier": {
engine: runDNN,
renderer: renderDNNUI
},
"color-classifier": {
engine: runColorClassifier,
renderer: renderColorUI
}
}

Behavior:

* Saat render task:
  → ambil task.type
  → panggil renderer dari registry

* Saat menjalankan logic:
  → ambil engine dari registry
  → jalankan dengan task.config
  → simpan hasil ke task.result

Tambahkan guard:

* Jika type tidak ditemukan → error handling

---

PART 5 — CONFIG & RESULT FLOW

* config:
  → berasal dari user input (UI)
  → disimpan di state & localStorage

* result:
  → dihasilkan oleh engine
  → disimpan ke state
  → ditampilkan ulang oleh UI

PENTING:

* Jangan menyimpan function di JSON
* Jangan menyimpan HTML di JSON
* Simpan hanya data

---

PART 6 — UI BEHAVIOR

* UI harus render berdasarkan state

* Graph / visual (node-edge, dll):
  → TIDAK disimpan
  → di-generate ulang dari config

* Perubahan config dari user:
  → update state
  → simpan ke localStorage
  → render ulang

---

PART 7 — FILE STRUCTURE (IMPLEMENTATION TARGET)

Tambahkan / gunakan file berikut:

src/core/
storage.js          → load & save localStorage
dnn-engine.js       → logic DNN
color-engine.js     → logic color

src/ui/
navigation.js
course-item.js
task-item.js
(opsional) dnn-ui.js
(opsional) color-ui.js

src/registry/
task-registry.js

---

EXPECTED OUTPUT:

1. Desain final struktur state
2. Implementasi storage.js (load/save)
3. Implementasi Task Type Registry
4. Contoh 1–2 engine sederhana (DNN & color placeholder cukup)
5. Alur lengkap:
   load → state → render → update → save

---

IMPORTANT NOTES:

* Jangan overengineering
* Jangan gunakan framework
* Jangan ubah arsitektur utama
* Fokus pada sistem yang scalable & modular
* Mulai dari desain, lalu implementasi bertahap

## REVISI_1
Project Context:
Saya sedang mengembangkan website dokumentasi tugas berbasis Vanilla JS dengan konsep IDE-style workspace (mirip Visual Studio Code). Sistem sudah memiliki fitur CRUD, persistence (localStorage), dan Task Type System.

Saat ini terdapat masalah pada UI Task List (Navigation Panel) yang harus diperbaiki agar konsisten, profesional, dan sesuai prinsip information hierarchy.

---

MAIN PROBLEMS:

1. Type (logic seperti "DNN Classifier", "Color Classifier") ditampilkan di list task
2. Penggunaan emoji pada task item
3. Layout task menjadi padat dan tidak rapi
4. Tombol Rename/Delete terpotong karena layout tidak cukup lebar
5. Informasi yang seharusnya detail (type) ditampilkan di level navigasi
6. Format tanggal metadata terlalu teknis (ISO lengkap dengan waktu)

---

GOAL:

Merapikan UI Task List agar:

* Bersih (clean)
* Profesional
* Konsisten dengan konsep IDE-style
* Tidak overload informasi

---

STRICT UI RULES (WAJIB DIIKUTI):

1. Navigation Panel (Course → Task):

   * HANYA menampilkan:
     → Nama Task
   * TIDAK BOLEH menampilkan:
     ❌ Type (DNN, Color, dll)
     ❌ Badge
     ❌ Emoji
     ❌ Informasi tambahan lain

2. Type (logic task):

   * WAJIB dipindahkan ke Metadata Panel
   * Ditampilkan sebagai field:
     → "Type: DNN Classifier" (contoh)
   * Mengikuti style metadata (font, spacing, dll)

3. Emoji:

   * HAPUS seluruh emoji dari UI
   * Tidak boleh digunakan sebagai indikator visual

---

LAYOUT REQUIREMENTS:

1. Task Item Layout:

   * Gunakan struktur horizontal yang bersih:
     [Task Name] ---------------------- [Actions]

2. Action Buttons (Rename, Delete, Run):

   * Tidak boleh terpotong
   * Harus selalu terlihat jelas
   * Gunakan flex layout yang benar

3. Lebar container:

   * Perlebar area task item jika diperlukan
   * Pastikan tidak ada overflow yang memotong konten

4. Hover behavior:

   * Action button boleh muncul saat hover
   * Tidak mengganggu layout utama

---

METADATA FIX:

Field DATE:

* Format saat ini:
  ❌ 2026-03-27T17:19:33.109Z

* Ubah menjadi:
  ✅ YYYY-MM-DD (contoh: 2026-03-27)

* Tidak perlu jam, menit, detik

---

IMPORTANT DESIGN PRINCIPLE:

* Navigation = struktur (Course → Task)
* Metadata = detail (type, config, dll)
* Jangan mencampur keduanya

---

TECHNICAL CONSTRAINTS:

* Jangan ubah arsitektur project
* Tetap gunakan Vanilla JS
* Jangan rewrite seluruh sistem
* Fokus hanya pada:
  → UI cleanup
  → layout fix
  → metadata adjustment

---

EXPECTED OUTPUT:

1. Perbaikan UI task list (tanpa type & emoji)
2. Perbaikan layout agar tidak overflow
3. Pemindahan type ke metadata panel
4. Format date yang lebih clean
5. Penyesuaian CSS & class yang diperlukan

---

IMPORTANT NOTES:

* Ini adalah REFINEMENT, bukan penambahan fitur
* Jangan menambahkan elemen visual baru
* Jangan membuat desain baru
* Ikuti prinsip minimal & professional UI

Implementasikan perubahan secara langsung tanpa opsi alternatif.
