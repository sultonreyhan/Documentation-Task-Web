/**
 * File Handler Utilities
 * Manages file operations: upload, download, export
 */

export class FileHandler {
    /**
     * Download data as JSON file
     * @param {Object} data - Data to export
     * @param {string} filename - Output filename
     */
    static downloadJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Download data as CSV file
     * @param {Array} data - Array of objects to export
     * @param {string} filename - Output filename
     */
    static downloadCSV(data, filename) {
        if (!Array.isArray(data) || data.length === 0) {
            console.error('No data to export');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(h => {
                    const val = row[h];
                    return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Create timestamp for filenames
     * @returns {string} ISO timestamp formatted for filenames
     */
    static getTimestamp() {
        return new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    }
}
