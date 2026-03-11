/**
 * CSV File Parser
 * Handles parsing and processing of CSV files
 */

export class CSVParser {
    /**
     * Parse CSV file into array of objects
     * @param {File} file - CSV file to parse
     * @returns {Promise<Array>} Parsed data as array of objects
     */
    static async parse(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.trim().split('\n');
                    const headers = lines[0].split(',');
                    
                    const data = lines.slice(1).map(line => {
                        const values = line.split(',');
                        const row = {};
                        
                        headers.forEach((header, i) => {
                            const val = values[i]?.trim();
                            row[header.trim()] = isNaN(val) ? val : parseFloat(val);
                        });
                        
                        return row;
                    });
                    
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    /**
     * Get column names from parsed data
     * @param {Array} data - Parsed CSV data
     * @returns {Array} Array of column names
     */
    static getColumns(data) {
        return data.length > 0 ? Object.keys(data[0]) : [];
    }

    /**
     * Validate CSV data structure
     * @param {Array} data - Parsed CSV data
     * @param {string} labelColumn - Expected label column name
     * @returns {Object} Validation result
     */
    static validate(data, labelColumn) {
        if (!Array.isArray(data) || data.length === 0) {
            return { valid: false, error: 'Data is empty' };
        }

        const columns = Object.keys(data[0]);
        if (!columns.includes(labelColumn)) {
            return { valid: false, error: `Label column '${labelColumn}' not found` };
        }

        return { valid: true };
    }
}
