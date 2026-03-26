/**
 * Course Add Item Component
 * Special "Add Course" item that appears at the bottom of course list
 */

export class CourseAddItem {
    constructor(stateManager) {
        this.stateManager = stateManager;
    }

    render(container) {
        const addCourseEl = document.createElement('div');
        addCourseEl.className = 'course-item add-course-item';

        const contentEl = document.createElement('div');
        contentEl.className = 'add-course-content';
        contentEl.textContent = '+ Add Course';

        addCourseEl.appendChild(contentEl);

        // Handle click to add new course
        addCourseEl.addEventListener('click', () => {
            this.handleAddCourse();
        });

        container.appendChild(addCourseEl);
    }

    handleAddCourse() {
        const name = prompt('Enter course name:');
        if (name && name.trim()) {
            this.stateManager.addCourse(name.trim());
        }
    }
}
