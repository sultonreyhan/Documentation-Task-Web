/**
 * Task Item Component
 * Renders a single task within a course
 * Clean navigation panel without type/emoji/metadata
 */

import { getMeetingLabel } from '../utils/date-formatter.js';

export class TaskItem {
    constructor(task, courseId, taskIndex, stateManager, navigationPanel) {
        this.task = task;
        this.courseId = courseId;
        this.taskIndex = taskIndex;
        this.stateManager = stateManager;
        this.navigationPanel = navigationPanel;
    }

    render(container) {
        const taskEl = document.createElement('div');
        taskEl.className = 'task-item';
        taskEl.dataset.taskId = this.task.id;

        // Task name
        const nameContainer = document.createElement('div');
        nameContainer.className = 'task-name-container';

        const nameEl = document.createElement('div');
        nameEl.className = 'task-name';
        nameEl.textContent = this.task.title;
        nameContainer.appendChild(nameEl);

        taskEl.appendChild(nameContainer);

        // Task actions
        const actions = document.createElement('div');
        actions.className = 'task-actions';

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

        taskEl.appendChild(actions);

        // Select task on click
        taskEl.addEventListener('click', () => {
            this.navigationPanel.selectTask(this.courseId, this.task.id, this.taskIndex);
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
