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

/**
 * Parse CSV for DNN binary classification
 * @param {string} csvText - CSV content as text
 * @param {string} targetColumn - target column name
 * @returns {Object} {valid, features, labels, errors}
 */
export function parseCSV(csvText, targetColumn = 'target') {
    const errors = [];
    
    try {
        const lines = csvText.trim().split('\n');
        
        if (lines.length < 2) {
            errors.push('CSV must have header and at least one data row');
            return { valid: false, features: [], labels: [], errors };
        }

        // Parse header
        const headers = lines[0].split(',').map(h => h.trim());
        const targetIdx = headers.indexOf(targetColumn);

        if (targetIdx === -1) {
            errors.push(`Target column '${targetColumn}' not found in CSV`);
            return { valid: false, features: [], labels: [], errors };
        }

        const features = [];
        const labels = [];

        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Skip empty lines

            const values = line.split(',').map(v => v.trim());

            if (values.length !== headers.length) {
                errors.push(`Row ${i + 1}: Expected ${headers.length} columns, got ${values.length}`);
                continue;
            }

            // Extract target
            const targetValue = values[targetIdx];
            let label;

            try {
                label = parseInt(targetValue);
                
                if (label !== 0 && label !== 1) {
                    errors.push(`Row ${i + 1}: Target must be 0 or 1, got '${targetValue}'`);
                    continue;
                }
            } catch (e) {
                errors.push(`Row ${i + 1}: Target '${targetValue}' is not an integer`);
                continue;
            }

            // Extract features
            const feature = [];
            for (let j = 0; j < headers.length; j++) {
                if (j !== targetIdx) {
                    try {
                        const val = parseFloat(values[j]);
                        if (isNaN(val)) {
                            errors.push(`Row ${i + 1}, Column '${headers[j]}': '${values[j]}' is not a valid number`);
                            continue;
                        }
                        feature.push(val);
                    } catch (e) {
                        errors.push(`Row ${i + 1}, Column '${headers[j]}': parsing error`);
                        continue;
                    }
                }
            }

            if (feature.length === headers.length - 1) {
                features.push(feature);
                labels.push(label);
            }
        }

        if (features.length === 0) {
            errors.push('No valid data rows found after parsing');
            return { valid: false, features: [], labels: [], errors };
        }

        return {
            valid: true,
            features,
            labels,
            errors: errors.length > 0 ? errors : []
        };

    } catch (error) {
        return {
            valid: false,
            features: [],
            labels: [],
            errors: [error.message]
        };
    }
}
