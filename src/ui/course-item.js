/**
 * Course Item Component
 * Renders a single course with its tasks and Add Task item
 */

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
        
        // Add expanded class if course is expanded
        if (this.course.expanded) {
            courseEl.classList.add('expanded');
        }

        // Course Header
        const header = document.createElement('div');
        header.className = 'course-header';

        // Expand/Collapse Icon
        const expandIcon = document.createElement('span');
        expandIcon.className = 'expand-icon';
        expandIcon.textContent = this.course.expanded ? '▼' : '▶';
        header.appendChild(expandIcon);

        const nameEl = document.createElement('div');
        nameEl.className = 'course-name';
        nameEl.textContent = this.course.title;
        header.appendChild(nameEl);

        // Course Actions (Rename, Delete)
        const actions = document.createElement('div');
        actions.className = 'course-actions';

        const renameBtn = document.createElement('button');
        renameBtn.className = 'btn-rename';
        renameBtn.textContent = 'Rename';
        renameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleRename();
        });
        actions.appendChild(renameBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleDelete();
        });
        actions.appendChild(deleteBtn);

        header.appendChild(actions);
        courseEl.appendChild(header);

        // Course header click: toggle expand/collapse
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleExpand(courseEl, expandIcon);
            this.navigationPanel.selectCourse(this.course.id);
        });

        // Task List
        const taskList = document.createElement('div');
        taskList.className = 'task-list';

        // Render actual tasks
        this.course.tasks.forEach((task, index) => {
            const taskItem = new TaskItem(
                task,
                this.course.id,
                index,
                this.stateManager,
                this.navigationPanel
            );
            taskItem.render(taskList);
        });

        // Render "Add Task" item ALWAYS AT THE END
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

    toggleExpand(courseEl, expandIcon) {
        // Toggle expanded class
        courseEl.classList.toggle('expanded');
        this.course.expanded = !this.course.expanded;
        
        // Update icon
        expandIcon.textContent = this.course.expanded ? '▼' : '▶';
        
        // Update state (optional: to persist expand state)
        // This will trigger re-render with updated state
    }
}
