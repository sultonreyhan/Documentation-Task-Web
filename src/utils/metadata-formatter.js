/**
 * Task Metadata Formatter
 * Formats task information for display in metadata panel
 */

import { formatDate } from './date-formatter.js';

/**
 * Format task metadata for inspector panel display
 * @param {Object} task - Task object
 * @returns {Object} Metadata object formatted for display
 */
export function formatTaskMetadata(task) {
    const metadata = {};
    
    // Task ID
    if (task.id) {
        metadata['ID'] = task.id;
    }
    
    // Task Title
    if (task.title) {
        metadata['Title'] = task.title;
    }
    
    // Task Type
    if (task.type) {
        metadata['Type'] = task.type;
    }
    
    // Created Date
    if (task.createdAt) {
        metadata['Created'] = formatDate(task.createdAt);
    }
    
    // Config
    if (task.config && Object.keys(task.config).length > 0) {
        metadata['Configuration'] = JSON.stringify(task.config, null, 2);
    }
    
    // Result Status
    if (task.result) {
        metadata['Status'] = 'Executed';
        metadata['Last Result'] = new Date(task.result.timestamp || new Date()).toLocaleString();
    } else {
        metadata['Status'] = 'Not executed';
    }
    
    return metadata;
}

/**
 * Format course metadata for inspector panel display
 * @param {Object} course - Course object
 * @param {number} taskCount - Number of tasks in course
 * @returns {Object} Metadata object formatted for display
 */
export function formatCourseMetadata(course, taskCount = 0) {
    const metadata = {};
    
    // Course ID
    if (course.id) {
        metadata['ID'] = course.id;
    }
    
    // Course Title
    if (course.title) {
        metadata['Title'] = course.title;
    }
    
    // Task Count
    metadata['Tasks'] = `${taskCount} task${taskCount !== 1 ? 's' : ''}`;
    
    // Expanded State
    metadata['Status'] = course.expanded ? 'Expanded' : 'Collapsed';
    
    return metadata;
}
