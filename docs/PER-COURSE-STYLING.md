# 🎨 Per-Course Styling & Customization

## 📌 Overview

Setiap course dapat memiliki **tampilan visual yang berbeda** berdasarkan konfigurasi tema yang ditetapkan. Ini memungkinkan pengalaman pengguna yang lebih personal dan branded untuk setiap mata kuliah.

---

## 1️⃣ Struktur Course dengan Tema

### Configuration Course:
```javascript
{
    id: "course-001",
    name: "Introduction to ML",
    description: "Fundamental Machine Learning concepts",
    
    // Tema/Styling
    theme: {
        // Warna
        primaryColor: "#FF6B6B",        // Warna utama
        secondaryColor: "#FFE66D",      // Warna sekunder
        
        // Icon & Visual
        icon: "ml-icon",                // Icon untuk course
        backgroundColor: "#FFF5F5",     // Background color
        
        // Layout
        layout: "standard",             // atau "card", "timeline"
        
        // Font
        fontFamily: "Inter, sans-serif",
        
        // Custom CSS
        customCSS: "/styles/themes/ml-theme.css"
    }
}
```

---

## 2️⃣ Alur Rendering Per-Course

```
┌─────────────────────────────────┐
│  User memilih Course            │
│  "Introduction to ML"           │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│  UIController.handleCourseSelect│
│  - Get course config            │
│  - Read theme data              │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│  Apply Theme                    │
│  - Set CSS variables            │
│  - Load custom CSS              │
│  - Update component colors      │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│  Render Course UI               │
│  - NavigationPanel (meetings)   │
│  - ContentWorkspace (content)   │
│  - InspectorPanel (metadata)    │
│                                 │
│  Semua dengan theme terpilih    │
└─────────────────────────────────┘
```

---

## 3️⃣ Implementasi Theme System

### STEP 1: Definisikan Course Utilities

```javascript
// src/utils/course-utils.js

export class CourseUtils {
    /**
     * Get default theme untuk course
     */
    static getDefaultTheme() {
        return {
            primaryColor: "#6C5CE7",      // Purple
            secondaryColor: "#74B9FF",    // Blue
            backgroundColor: "#F8FAFF",
            icon: "book",
            layout: "standard",
            fontFamily: "Inter, sans-serif"
        };
    }

    /**
     * Predefined themes untuk berbagai course types
     */
    static getPredefinedThemes() {
        return {
            // ML & AI Courses
            ML: {
                primaryColor: "#FF6B6B",
                secondaryColor: "#FFE66D",
                backgroundColor: "#FFF5F5",
                icon: "brain",
                accentColor: "#A29BFE"
            },

            // Web Development
            WEB_DEV: {
                primaryColor: "#00B894",
                secondaryColor: "#00CEC9",
                backgroundColor: "#E8F8F5",
                icon: "globe",
                accentColor: "#55EFC4"
            },

            // Data Science
            DATA_SCIENCE: {
                primaryColor: "#0984E3",
                secondaryColor: "#27AE60",
                backgroundColor: "#EBF5FB",
                icon: "bar-chart",
                accentColor: "#85C1E2"
            },

            // Mobile Development
            MOBILE_DEV: {
                primaryColor: "#E17055",
                secondaryColor: "#FD79A8",
                backgroundColor: "#FFECF0",
                icon: "smartphone",
                accentColor: "#FFAEC9"
            },

            // Cloud & DevOps
            CLOUD: {
                primaryColor: "#FF7675",
                secondaryColor: "#A29BFE",
                backgroundColor: "#FFF1F0",
                icon: "cloud",
                accentColor: "#FDCB6E"
            }
        };
    }
}
```

### STEP 2: Buat Theme Manager

```javascript
// src/services/theme-service.js

export class ThemeService {
    constructor() {
        this.currentTheme = null;
    }

    /**
     * Apply theme untuk course
     * @param {Object} course - Course object dengan theme config
     */
    applyTheme(course) {
        const theme = course.theme || CourseUtils.getDefaultTheme();
        this.currentTheme = theme;

        // Apply CSS variables
        this._applyCSSVariables(theme);

        // Load custom CSS if exists
        if (theme.customCSS) {
            this._loadCustomCSS(theme.customCSS);
        }

        // Update component styling
        this._updateComponentStyles(theme);

        console.log('Theme applied:', course.name, theme);
    }

    /**
     * Apply CSS custom properties (variables)
     * @private
     */
    _applyCSSVariables(theme) {
        const root = document.documentElement;

        root.style.setProperty('--primary-color', theme.primaryColor);
        root.style.setProperty('--secondary-color', theme.secondaryColor || '#74B9FF');
        root.style.setProperty('--bg-color', theme.backgroundColor || '#F8FAFF');
        root.style.setProperty('--accent-color', theme.accentColor || theme.primaryColor);

        // Derived colors
        root.style.setProperty(
            '--primary-color-dark',
            this._darkenColor(theme.primaryColor, 20)
        );
        root.style.setProperty(
            '--primary-color-light',
            this._lightenColor(theme.primaryColor, 20)
        );
    }

    /**
     * Load custom CSS file
     * @private
     */
    _loadCustomCSS(cssPath) {
        // Remove existing theme CSS
        const existing = document.querySelector('[data-theme-css]');
        if (existing) {
            existing.remove();
        }

        // Load new theme CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath;
        link.setAttribute('data-theme-css', 'true');
        document.head.appendChild(link);
    }

    /**
     * Update inline styles untuk components tertentu
     * @private
     */
    _updateComponentStyles(theme) {
        // Update activity bar
        const activityItems = document.querySelectorAll('.activity-item.active');
        activityItems.forEach(item => {
            item.style.backgroundColor = theme.primaryColor;
        });

        // Update nav panel header
        const navHeader = document.querySelector('.nav-header');
        if (navHeader) {
            navHeader.style.borderBottomColor = theme.secondaryColor;
        }

        // Update buttons
        const buttons = document.querySelectorAll('button[data-theme]');
        buttons.forEach(btn => {
            btn.style.backgroundColor = theme.primaryColor;
            btn.style.borderColor = theme.primaryColor;
        });
    }

    /**
     * Darken color by percentage
     * @private
     */
    _darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;

        return '#' + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }

    /**
     * Lighten color by percentage
     * @private
     */
    _lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;

        return '#' + (
            0x1000000 +
            (R > 255 ? 255 : R) * 0x10000 +
            (G > 255 ? 255 : G) * 0x100 +
            (B > 255 ? 255 : B)
        ).toString(16).slice(1);
    }

    /**
     * Reset theme ke default
     */
    resetTheme() {
        const defaultTheme = CourseUtils.getDefaultTheme();
        this.applyTheme({ theme: defaultTheme });
    }
}
```

### STEP 3: Update UIController

```javascript
// ui-controller.js

import { ThemeService } from '../services/theme-service.js';

export class UIController {
    constructor() {
        // ... existing code
        this.themeService = new ThemeService();
        this.currentCourse = null;
    }

    /**
     * Handle course selection
     */
    async _handleCourseSelect(course) {
        this.currentCourse = course;

        // Apply course theme
        this.themeService.applyTheme(course);

        // Update page title
        document.title = `${course.name} - Documentation`;

        // Update UI header
        const header = document.querySelector('.nav-header h3');
        if (header) {
            header.textContent = course.name.toUpperCase();
        }

        // Load meetings untuk course ini
        const meetings = await this.meetingManager.loadMeetingsForCourse(course.id);
        console.log(`Loaded ${meetings.length} meetings for ${course.name}`);
    }
}
```

---

## 4️⃣ CSS Custom Properties yang Digunakan

```css
/* styles/variables.css */

:root {
    /* Primary Colors */
    --primary-color: #6C5CE7;
    --primary-color-dark: #5F3DC4;
    --primary-color-light: #A29BFE;

    /* Secondary Colors */
    --secondary-color: #74B9FF;
    --accent-color: #6C5CE7;

    /* Background */
    --bg-color: #F8FAFF;
    --bg-light: #FFFFFF;
    --bg-dark: #F0F0F0;

    /* Text */
    --text-primary: #2D3436;
    --text-secondary: #636E72;
    --text-light: #B2BEC3;

    /* Borders */
    --border-color: #DFE6E9;
    --border-color-light: #F0F0F0;

    /* Spacing & Sizing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;

    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Component styling dengan CSS variables */

.btn-primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: var(--primary-color-dark);
}

.nav-header {
    border-bottom: 3px solid var(--secondary-color);
}

.course-item.active {
    background-color: var(--primary-color-light);
}

.activity-item.active {
    background-color: var(--primary-color);
    border-color: var(--primary-color-dark);
}
```

---

## 5️⃣ Contoh Per-Course Customization

### A. Machine Learning Course

```javascript
{
    id: "course-001",
    name: "Introduction to ML",
    theme: {
        primaryColor: "#FF6B6B",       // Merah
        secondaryColor: "#FFE66D",     // Kuning
        backgroundColor: "#FFF5F5",
        icon: "brain",
        customCSS: "/styles/themes/ml-theme.css"
    }
}

// ml-theme.css
.course-icon::before {
    content: "🧠";
    font-size: 24px;
}

.course-header {
    background: linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%);
}
```

### B. Web Development Course

```javascript
{
    id: "course-002",
    name: "Modern Web Development",
    theme: {
        primaryColor: "#00B894",       // Hijau
        secondaryColor: "#00CEC9",     // Cyan
        backgroundColor: "#E8F8F5",
        icon: "globe",
        customCSS: "/styles/themes/webdev-theme.css"
    }
}

// webdev-theme.css
.course-icon::before {
    content: "🌐";
    font-size: 24px;
}

.task-item {
    border-left: 4px solid #00B894;
}
```

---

## 6️⃣ Dynamic Theme Color Generation

```javascript
// Jika ingin generate warna secara otomatis berdasarkan nama course

export class ColorGenerator {
    /**
     * Generate consistent colors dari string
     */
    static generatePalette(courseId, courseName) {
        // Hash the course name/id
        const hash = this._hashCode(courseName);

        // Generate base color dari hash
        const baseHue = (hash % 360);
        const primaryColor = `hsl(${baseHue}, 75%, 50%)`;
        const secondaryColor = `hsl(${(baseHue + 60) % 360}, 75%, 60%)`;
        const backgroundColor = `hsl(${baseHue}, 30%, 95%)`;

        return {
            primaryColor,
            secondaryColor,
            backgroundColor
        };
    }

    /**
     * Java hashCode equivalent untuk konsistensi
     */
    static _hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
}

// Penggunaan:
const palette = ColorGenerator.generatePalette('course-001', 'Introduction to ML');
course.theme = palette;
```

---

## 7️⃣ Implementasi pada Navigation Panel

```javascript
// src/ui/navigation-panel.js (updated)

export class NavigationPanel {
    _createCourseItem(course) {
        const courseEl = document.createElement('div');
        courseEl.className = 'course-item';

        const header = document.createElement('div');
        header.className = 'course-header';

        // Apply course color jika tersedia
        const theme = course.theme;
        if (theme) {
            header.style.borderLeftColor = theme.primaryColor;
            header.style.backgroundColor = theme.backgroundColor;
        }

        header.innerHTML = `
            <div class="course-icon" style="color: ${theme?.primaryColor || 'inherit'}">
                ${this._getIcon(course.id)}
            </div>
            <div class="course-name">${course.name}</div>
        `;

        courseEl.appendChild(header);

        // ...rest of implementation
    }

    _getIcon(courseId) {
        const icons = {
            'course-001': '🤖',  // ML
            'course-002': '🌐',  // Web Dev
            'course-003': '☁️',   // Cloud
        };
        return icons[courseId] || '📚';
    }
}
```

---

## 8️⃣ Best Practices

✅ **DO:**
- Define theme di course config level
- Use CSS variables untuk easy customization
- Provide sensible defaults
- Test theme consistency across all components
- Document available theme properties

❌ **DON'T:**
- Hardcode colors di component files
- Mix inline styles dengan CSS classes
- Forget to reset theme when switching courses
- Use non-standard color formats

---

## 9️⃣ Extensibility - Theme Editor (Future)

```javascript
// Contoh untuk fitur theme editor di masa depan

export class ThemeEditor {
    /**
     * Generate custom theme dari user input
     */
    static generateCustomTheme(formData) {
        return {
            primaryColor: formData.primaryColor,
            secondaryColor: formData.secondaryColor,
            backgroundColor: formData.backgroundColor,
            icon: formData.icon,
            customCSS: `/styles/themes/${formData.themeName}.css`
        };
    }

    /**
     * Export theme ke file JSON
     */
    static exportTheme(course, theme) {
        const json = JSON.stringify({
            courseId: course.id,
            courseName: course.name,
            theme: theme
        }, null, 2);

        // Download file
        // ... implementation
    }

    /**
     * Import theme dari file JSON
     */
    static importTheme(file) {
        // Parse JSON
        // Validate theme structure
        // Return theme object
    }
}
```

---

## 🔟 Ringkasan

| Aspek | Lokasi | Keterangan |
|-------|--------|-----------|
| **Theme Config** | Course object | Warna, font, custom CSS |
| **CSS Variables** | `variables.css` | Dynamic values |
| **Theme Logic** | `theme-service.js` | Apply & manage theme |
| **UI Integration** | `ui-controller.js` | Trigger theme change |
| **Custom Styles** | `themes/*.css` | Per-course styling |
| **Icons** | `navigation-panel.js` | Visual course identifier |
