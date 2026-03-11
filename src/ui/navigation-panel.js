/**
 * Navigation Panel Component
 * Sidebar for course/task hierarchy navigation
 */

export class NavigationPanel {
    constructor(container) {
        this.container = container;
        this.courses = [];
        this.selectedTask = null;
    }

    /**
     * Initialize navigation panel with course data
     * @param {Array} courses - Course data with tasks
     * @param {Function} onTaskSelect - Callback when task is selected
     */
    init(courses, onTaskSelect) {
        this.courses = courses;
        this.onTaskSelect = onTaskSelect;

        const panel = document.createElement('div');
        panel.className = 'nav-panel';

        // Header
        const header = document.createElement('div');
        header.className = 'nav-header';
        header.innerHTML = `
            <h3>Courses</h3>
            <button title="Add course">
                <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
        `;
        panel.appendChild(header);

        // Content
        const content = document.createElement('div');
        content.className = 'nav-content';

        courses.forEach(course => {
            const courseItem = this._createCourseItem(course);
            content.appendChild(courseItem);
        });

        panel.appendChild(content);
        this.container.appendChild(panel);
    }

    /**
     * Create course and task items
     * @private
     * @param {Object} course - Course data
     * @returns {HTMLElement} Course element
     */
    _createCourseItem(course) {
        const courseEl = document.createElement('div');
        courseEl.className = 'course-item expanded';

        const header = document.createElement('div');
        header.className = 'course-header';
        header.innerHTML = `
            <div class="course-toggle">
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="course-name">${course.name}</div>
        `;

        header.addEventListener('click', () => {
            courseEl.classList.toggle('expanded');
            courseEl.classList.toggle('collapsed');
        });

        courseEl.appendChild(header);

        // Task list
        const taskList = document.createElement('div');
        taskList.className = 'task-list';

        course.tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.textContent = task.name;
            taskItem.dataset.taskId = task.id;

            taskItem.addEventListener('click', () => {
                document.querySelectorAll('.task-item.active').forEach(el => {
                    el.classList.remove('active');
                });
                taskItem.classList.add('active');
                this.selectedTask = task;
                this.onTaskSelect(task);
            });

            taskList.appendChild(taskItem);
        });

        courseEl.appendChild(taskList);
        return courseEl;
    }
}
