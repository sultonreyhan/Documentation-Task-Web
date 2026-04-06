/**
 * State Manager
 * Manages in-memory state and notifies listeners on changes
 * Integrated with localStorage persistence
 */

import { generateId } from '../utils/id-generator.js';
import { formatDate } from '../utils/date-formatter.js';
import { saveToStorage } from '../core/storage.js';

export class StateManager {
    constructor(initialState) {
        // Deep copy initial state
        this.state = JSON.parse(JSON.stringify(initialState));
        this.listeners = [];
    }

    /**
     * Get current state
     */
    getState() {
        return this.state;
    }

    /**
     * Update state and notify all listeners
     */
    setState(newState) {
        this.state = newState;
        
        // Persist to localStorage
        try {
            saveToStorage(this.state);
        } catch (error) {
            console.warn('Failed to save state to storage:', error);
        }
        
        // Notify all listeners
        this.listeners.forEach(listener => listener(this.state));
    }

    /**
     * Subscribe to state changes
     * Returns unsubscribe function
     */
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Create new course
     */
    addCourse(title) {
        const newCourse = {
            id: generateId(),
            title,
            tasks: []
        };
        this.setState({
            courses: [...this.state.courses, newCourse]
        });
        return newCourse;
    }

    /**
     * Delete course
     */
    deleteCourse(courseId) {
        this.setState({
            courses: this.state.courses.filter(c => c.id !== courseId)
        });
    }

    /**
     * Rename course
     */
    renameCourse(courseId, newTitle) {
        const courses = this.state.courses.map(c =>
            c.id === courseId ? { ...c, title: newTitle } : c
        );
        this.setState({ courses });
    }

    /**
     * Add task to course with task type support
     * @param {string} courseId - course ID
     * @param {string} title - task title
     * @param {string} type - task type (e.g., 'dnn-classifier', 'color-classifier')
     * @param {Object} config - task configuration
     */
    addTask(courseId, title, type = 'dnn-classifier', config = {}) {
        const courses = this.state.courses.map(course => {
            if (course.id === courseId) {
                const newTask = {
                    id: generateId(),
                    title,
                    type,
                    config: config,
                    result: null,
                    createdAt: formatDate(new Date())
                };
                return {
                    ...course,
                    tasks: [...course.tasks, newTask]
                };
            }
            return course;
        });
        this.setState({ courses });
    }

    /**
     * Delete task from course
     */
    deleteTask(courseId, taskId) {
        const courses = this.state.courses.map(course => {
            if (course.id === courseId) {
                return {
                    ...course,
                    tasks: course.tasks.filter(t => t.id !== taskId)
                };
            }
            return course;
        });
        this.setState({ courses });
    }

    /**
     * Rename task
     */
    renameTask(courseId, taskId, newTitle) {
        const courses = this.state.courses.map(course => {
            if (course.id === courseId) {
                return {
                    ...course,
                    tasks: course.tasks.map(t =>
                        t.id === taskId ? { ...t, title: newTitle } : t
                    )
                };
            }
            return course;
        });
        this.setState({ courses });
    }

    /**
     * Get course by ID
     */
    getCourse(courseId) {
        return this.state.courses.find(c => c.id === courseId);
    }

    /**
     * Get task by ID
     */
    getTask(courseId, taskId) {
        const course = this.getCourse(courseId);
        if (!course) return null;
        return course.tasks.find(t => t.id === taskId);
    }

    /**
     * Execute task using its registered engine
     * @param {string} courseId - course ID
     * @param {string} taskId - task ID
     * @returns {Object|null} execution result or null if task not found
     */
    executeTask(courseId, taskId) {
        const course = this.getCourse(courseId);
        if (!course) {
            console.error('Course not found:', courseId);
            return null;
        }

        const task = course.tasks.find(t => t.id === taskId);
        if (!task) {
            console.error('Task not found:', taskId);
            return null;
        }

        try {
            const result = runTask(task);
            
            // Update task result in state
            const courses = this.state.courses.map(c => {
                if (c.id === courseId) {
                    return {
                        ...c,
                        tasks: c.tasks.map(t =>
                            t.id === taskId ? { ...t, result } : t
                        )
                    };
                }
                return c;
            });
            
            this.setState({ courses });
            return result;
        } catch (error) {
            console.error('Error executing task:', error);
            throw error;
        }
    }

    /**
     * Update task config
     * @param {string} courseId - course ID
     * @param {string} taskId - task ID
     * @param {Object} newConfig - new configuration object
     */
    updateTaskConfig(courseId, taskId, newConfig) {
        const course = this.getCourse(courseId);
        if (!course) {
            console.error('Course not found:', courseId);
            return;
        }

        const task = course.tasks.find(t => t.id === taskId);
        if (!task) {
            console.error('Task not found:', taskId);
            return;
        }

        const courses = this.state.courses.map(c => {
            if (c.id === courseId) {
                return {
                    ...c,
                    tasks: c.tasks.map(t =>
                        t.id === taskId ? { ...t, config: newConfig } : t
                    )
                };
            }
            return c;
        });

        this.setState({ courses });
        console.log('✓ Task config updated');
    }

    /**
     * Toggle course expanded state
     * @param {string} courseId - course ID
     */
    toggleCourseExpanded(courseId) {
        const courses = this.state.courses.map(c =>
            c.id === courseId ? { ...c, expanded: !c.expanded } : c
        );
        this.setState({ courses });
    }
}
