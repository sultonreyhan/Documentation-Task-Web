/**
 * Task Add Item Component
 * Special "Add Task" item that appears at the bottom of task list
 */

export class TaskAddItem {
    constructor(courseId, stateManager) {
        this.courseId = courseId;
        this.stateManager = stateManager;
    }

    render(container) {
        const addTaskEl = document.createElement('div');
        addTaskEl.className = 'task-item add-task-item';

        const contentEl = document.createElement('div');
        contentEl.className = 'add-task-content';
        contentEl.textContent = '+ Add Task';

        addTaskEl.appendChild(contentEl);

        // Handle click to add new task
        addTaskEl.addEventListener('click', () => {
            this.handleAddTask();
        });

        container.appendChild(addTaskEl);
    }

    handleAddTask() {
        const name = prompt('Enter task name:');
        if (name && name.trim()) {
            this.stateManager.addTask(this.courseId, name.trim());
        }
    }
}
