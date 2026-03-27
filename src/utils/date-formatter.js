/**
 * Format dates for metadata display
 * Returns format: YYYY-MM-DD
 */
export function formatDate(date) {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

/**
 * Get meeting text based on task index (Task 1, Task 2, etc)
 */
export function getMeetingLabel(taskIndex) {
    return `Task ${taskIndex + 1}`;
}
