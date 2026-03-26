/**
 * State Manager
 * Manages in-memory state and notifies listeners on changes
 */

import { generateId } from '../utils/id-generator.js';
import { formatDate } from '../utils/date-formatter.js';

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
     * Add task to course
     */
    addTask(courseId, title) {
        const courses = this.state.courses.map(course => {
            if (course.id === courseId) {
                const newTask = {
                    id: generateId(),
                    title,
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
}
