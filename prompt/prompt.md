
# UI Design Prompt — Developer Documentation Workspace

## 1. Design Goal

Create a modern web application interface for a **technical documentation workspace** used to store and organize university assignments and project documentation.

The interface should combine the feel of:

- a developer IDE
- a technical documentation platform

Primary goals:

- high readability
- structured documentation flow
- developer-oriented workflow
- minimal visual distractions
- professional appearance

---

## 2. Reference Layout

The UI should visually follow the structure and layout similar to the reference images.

The layout should resemble modern developer tools such as **VS Code** or technical documentation platforms.

Reference characteristics:

- dark developer workspace layout
- VS Code style interface
- left activity icon bar
- course/task navigation sidebar
- central documentation editor
- right metadata inspector panel

---

## 3. Visual Style

The design should follow these visual characteristics:

- Dark dominant theme
- Flat design (minimal shadows)
- Serious / professional tone
- Clean modern interface
- Developer-friendly workspace
- High readability for pseudocode and analysis sections

The interface should feel similar to:

- Visual Studio Code
- GitBook
- Notion (technical workspace usage)

---

## 4. Layout Structure

The interface uses a **4-panel workspace layout**.

Activity Bar | Navigation Panel | Content Workspace | Inspector Panel

---

### 4.1 Activity Bar (Far Left)

A thin vertical icon bar used for switching navigation modes.

Example items:

- Courses
- Tasks
- Search
- Favorites
- Settings

Design requirements:

- thin vertical layout
- minimal icon size
- subtle hover highlight
- muted accent colors

---

### 4.2 Navigation Panel (Courses Sidebar)

Displays hierarchical structure:

Course  
└ Task  

Example:

Image Processing  
- RGB Pixel Extraction  
- Histogram Analysis  

Deep Learning  
- AND OR Model  
- Neural Network Experiment  

Features:

- expand / collapse course lists
- add new task
- selected task highlight
- subtle divider lines

The sidebar background should be slightly darker than the main content area.

---

### 4.3 Content Workspace (Main Area)

The main documentation editor using **document flow layout**.

Blocks appear vertically:

SOAL  
PSEUDOCODE  
HASIL  
ANALISIS  

Supported block types:

- Text block
- Pseudocode block
- Image block
- Table block
- File attachment
- Analysis block

Block containers should be:

- flat
- subtle borders
- slightly elevated from background

Pseudocode block styling:

- darker background
- monospaced font
- developer-like syntax style

---

### 4.4 Inspector Panel (Right)

Displays metadata and task information.

Example fields:

Course  
Meeting  
Date  
Tags  

Action buttons:

- Edit Task
- Upload File
- Export PDF

Buttons should follow **flat UI style with subtle hover feedback**.

---

## 5. Icon Style Requirements

Icons must follow the same **developer-oriented visual language** across the entire interface.

Icon characteristics:

- monoline / outline style
- flat design
- consistent stroke thickness
- minimal visual complexity
- monochrome or muted accent color

Icons should resemble those found in **developer IDE tools**.

Recommended inspiration:

- Lucide Icons
- Feather Icons
- Heroicons Outline
- VS Code icon style

Avoid:

- colorful icons
- illustration icons
- skeuomorphic icons
- gradient-heavy icons

---

## 6. Color Palette

Dark developer workspace palette:

Background  
#1E1E1E  

Panels  
#252526  

Borders  
#3C3C3C  

Primary Text  
#D4D4D4  

Accent Color  
#569CD6  

Pseudocode Block Background  
#1B1B1B  

Hover Highlight  
#2A2D2E  

---

## 7. Typography

Primary UI font:

Inter  
or  
IBM Plex Sans

Pseudocode / technical content font:

JetBrains Mono  
or  
Fira Code

---

## 8. Design Characteristics

The interface should feel:

- calm
- professional
- structured
- technical
- developer-oriented

Avoid:

- playful visuals
- bright colors
- heavy shadows
- decorative illustrations

The design should prioritize **clarity, focus, and usability**.

---

## 9. Keywords for Design Generation

developer workspace  
technical documentation UI  
dark theme dashboard  
VS Code inspired layout  
flat modern SaaS UI  
documentation editor blocks  
minimal professional interface

## new prompt 1.1
Analyze the following HTML and JavaScript files.

Goal:
Refactor the project into a modular frontend architecture.

Tasks:

1. Identify all features and responsibilities in the code.
2. Group them into logical modules such as:
   - UI layout
   - navigation system
   - content rendering
   - block rendering
   - application state
   - neural network logic
   - training pipeline
   - prediction system
   - file upload handling
3. Propose a clean project folder structure.
4. Show which functions should move into which files.
5. Refactor the existing code into modular files while preserving functionality.

Important:
Keep the architecture suitable for a local web app without frameworks (vanilla JS).

## new prompt 1.2
Update the UI layout and icon system for the left activity sidebar and section headers.

1. Replace the icons in the left sidebar with image icons from the following paths in this exact order (top to bottom):

* Book icon → `pics/book/book_1.png`
* Search icon → `pics/search.png`
* Favourite icon → `pics/star.png`
* Settings icon → `pics/gear.png`

Each icon should be displayed using an `<img>` element and scaled consistently (around 18–22px). Keep them centered inside the sidebar buttons.

2. Modify the interaction styling of the sidebar icons so they visually match the selection behavior used in the **Courses menu**.

Behavior rules:

* Default state: icon color appears dark/black.
* Hover state: background highlight appears similar to the Courses hover effect and the icon/text becomes **white**.
* Active/selected state: background color matches the currently selected course item style and the icon remains **white**.

Use smooth transitions for hover and active states so the interaction feels consistent with the Courses panel.

3. Adjust the header layout for the following sections:

* **COURSES**
* **TASK CONTENT**

Currently both headers display a symbol directly after the text.
Change the layout so:

* The **text label** stays in the **top-left corner** of the section.
* The **symbol/icon moves to the opposite corner (top-right)** within the same header container.

Example layout behavior:

Top-left → section title (COURSES / TASK CONTENT)
Top-right → the section symbol/icon

Use flexbox or absolute positioning to align them properly.

4. Ensure spacing and alignment remain consistent with the dark theme UI and do not break the existing layout grid.

The goal is to make the sidebar icons visually match the interaction style of the Courses menu while improving header alignment for section symbols.

## new prompt 1.3
# AI Maintenance Prompts

Dokumen ini berisi prompt untuk mengontrol agen AI agar tidak merusak arsitektur proyek.
Project Rules:

1. This project uses Vanilla JavaScript.
2. Do not introduce React, Vue, or TypeScript.
3. Do not create new root folders like client/ or components/.
4. All UI modules must stay inside:

src/ui/

5. All logic modules must stay inside:

src/core/

### PROMPT 1 — Fix Activity Bar (Vanilla JS Only)

Gunakan prompt ini untuk memperbaiki komponen Activity Bar tanpa mengubah struktur proyek.

You are working inside an existing project.

IMPORTANT RULE:
You must NOT create new folders or new architectures.

The project already has a working structure and you must modify ONLY the existing files.

Existing structure that MUST be preserved:

src/
  core/
  styles/
  ui/
    activity-bar.js
    content-workspace.js
    inspector-panel.js
    navigation-panel.js
    ui-controller.js
  utils/
  app.js
  index.html

DO NOT create:

client/
components/
WorkspaceLayout.tsx
React components
TypeScript files

The project is a VANILLA JS project.

Goal:
Improve the Activity Bar component while keeping the architecture unchanged.

Files that may be edited:

src/ui/activity-bar.js
src/styles/components.css
src/index.html

Activity Bar requirements:

1. Activity bar appears on the far left of the layout.
2. Vertical icon layout similar to VSCode.
3. Buttons must support:
   - hover state
   - active state
4. Icons must use SVG (lucide-style icons already used in HTML).
5. Activity bar must control navigation mode such as:
   - courses
   - search
   - favorites
   - settings

Activity bar behavior:

Clicking an icon should change the active state and notify the UI controller.

The logic should remain compatible with:

src/ui/ui-controller.js

Do NOT change other modules.

Output required:

1. Updated src/ui/activity-bar.js
2. Any small CSS additions if necessary
3. No structural changes to the project.

### PROMPT 2 — Remove Incorrect client/ Folder
The project structure was modified incorrectly.

A new folder was created:

client/

This folder must be removed because the project uses the original structure inside:

src/

Instructions:

1. Delete the following folder completely:

client/

2. Restore the original project structure:

src/
  core/
  styles/
  ui/
  utils/
  app.js
  index.html

3. Ensure that all UI components continue to work using the existing files in src/.

4. Do NOT introduce React, TypeScript, or new component folders.

5. The project must remain a vanilla JavaScript web application.

Output:

- Updated project structure
- Confirmation that the client/ folder was removed

