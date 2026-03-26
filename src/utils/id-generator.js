/**
 * Generate unique IDs for courses and tasks
 */

export function generateId() {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
