
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