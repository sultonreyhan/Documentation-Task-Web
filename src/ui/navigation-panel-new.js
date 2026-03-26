/**
 * Navigation Panel Component
 * Main container for course and task navigation with CRUD functionality
 */

import { CourseItem } from './course-item.js';
import { CourseAddItem } from './course-add-item.js';

export class NavigationPanelNew {
    constructor(container, stateManager) {
        this.container = container;
        this.stateManager = stateManager;
        this.selectedCourse = null;
        this.selectedTask = null;
        this.onTaskSelect = null;
        this.onCourseSelect = null;

        // Subscribe to state changes
        this.unsubscribe = this.stateManager.subscribe((state) => {
            this.render(state);
        });
    }

    init() {
        const panel = document.createElement('div');
        panel.className = 'nav-panel';

        // Header with title and add button
        const header = document.createElement('div');
        header.className = 'nav-header';

        const titleEl = document.createElement('h3');
        titleEl.textContent = 'COURSES';
        header.appendChild(titleEl);

        const addBtn = document.createElement('button');
        addBtn.className = 'nav-header-action';
        addBtn.title = 'Add course';
        addBtn.innerHTML = '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
        addBtn.addEventListener('click', () => {
            this.handleAddCourse();
        });
        header.appendChild(addBtn);

        panel.appendChild(header);

        // Content area for courses and tasks
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

    /**
     * Render all courses and the "Add Course" item
     */
    render(state) {
        // Clear content
        this.navContent.innerHTML = '';

        // 1. Render all actual courses
        state.courses.forEach(course => {
            const courseItem = new CourseItem(course, this.stateManager, this);
            courseItem.render(this.navContent);
        });

        // 2. Render "Add Course" item ALWAYS AT THE END
        const addCourseItem = new CourseAddItem(this.stateManager);
        addCourseItem.render(this.navContent);

        // Update selected styling
        this.updateSelectedStyling();
    }

    /**
     * Update visual styling for selected course/task
     */
    updateSelectedStyling() {
        // Remove all active classes
        this.navContent.querySelectorAll('.course-item.active').forEach(el => {
            el.classList.remove('active');
        });
        this.navContent.querySelectorAll('.task-item.active').forEach(el => {
            el.classList.remove('active');
        });

        // Add active class to selected course
        if (this.selectedCourse) {
            const selectedCourseEl = this.navContent.querySelector(
                `[data-course-id="${this.selectedCourse}"]`
            );
            if (selectedCourseEl) {
                selectedCourseEl.classList.add('active');
            }
        }

        // Add active class to selected task
        if (this.selectedTask && this.selectedCourse) {
            const selectedTaskEl = this.navContent.querySelector(
                `[data-course-id="${this.selectedCourse}"] [data-task-id="${this.selectedTask}"]`
            );
            if (selectedTaskEl) {
                selectedTaskEl.classList.add('active');
            }
        }
    }

    /**
     * Select course
     */
    selectCourse(courseId) {
        this.selectedCourse = courseId;
        this.selectedTask = null;
        this.updateSelectedStyling();

        // Emit event
        if (this.onCourseSelect) {
            const course = this.stateManager.getCourse(courseId);
            this.onCourseSelect(course);
        }
    }

    /**
     * Select task
     */
    selectTask(courseId, taskId, taskIndex) {
        this.selectedCourse = courseId;
        this.selectedTask = taskId;
        this.updateSelectedStyling();

        // Emit event
        if (this.onTaskSelect) {
            const task = this.stateManager.getTask(courseId, taskId);
            const course = this.stateManager.getCourse(courseId);
            this.onTaskSelect({
                course,
                task,
                taskIndex
            });
        }
    }

    /**
     * Handle add course from header button
     */
    handleAddCourse() {
        const name = prompt('Enter course name:');
        if (name && name.trim()) {
            this.stateManager.addCourse(name.trim());
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        this.unsubscribe();
    }
}
