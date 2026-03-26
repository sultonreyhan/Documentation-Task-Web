/**
 * Format dates for metadata display
 */

export function formatDate(date) {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

/**
 * Get meeting text based on task index (Task 1, Task 2, etc)
 */
export function getMeetingLabel(taskIndex) {
    return `Task ${taskIndex + 1}`;
}
