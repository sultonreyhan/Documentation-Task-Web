/**
 * Inspector Panel Component
 * Right side panel showing metadata and task information
 */

export class InspectorPanel {
    constructor(container) {
        this.container = container;
        this.currentMetadata = null;
    }

    /**
     * Initialize inspector panel
     */
    init() {
        const panel = document.createElement('div');
        panel.className = 'inspector-panel';

        // Header
        const header = document.createElement('div');
        header.className = 'inspector-header';
        header.innerHTML = '<h3>Metadata</h3>';
        panel.appendChild(header);

        // Content
        const content = document.createElement('div');
        content.className = 'inspector-content';
        content.id = 'inspectorContent';
        panel.appendChild(content);

        this.container.appendChild(panel);
    }

    /**
     * Display metadata for current task
     * @param {Object} metadata - Metadata object with fields
     */
    displayMetadata(metadata) {
        this.currentMetadata = metadata;
        const content = document.getElementById('inspectorContent');
        content.innerHTML = '';

        if (!metadata) {
            const emptyEl = document.createElement('p');
            emptyEl.className = 'block-text';
            emptyEl.textContent = 'No metadata available';
            content.appendChild(emptyEl);
            return;
        }

        // Display fields
        Object.entries(metadata).forEach(([key, value]) => {
            if (key !== 'buttons') {
                const fieldEl = document.createElement('div');
                fieldEl.className = 'inspector-field';

                const labelEl = document.createElement('label');
                labelEl.className = 'inspector-label';
                labelEl.textContent = key.charAt(0).toUpperCase() + key.slice(1);

                const valueEl = document.createElement('div');
                valueEl.className = 'inspector-value';
                valueEl.textContent = value;

                fieldEl.appendChild(labelEl);
                fieldEl.appendChild(valueEl);
                content.appendChild(fieldEl);
            }
        });

        // Display action buttons if provided
        if (metadata.buttons) {
            const buttonsEl = document.createElement('div');
            buttonsEl.className = 'inspector-buttons';

            metadata.buttons.forEach(btn => {
                const btnEl = document.createElement('button');
                btnEl.className = `btn ${btn.className || ''}`;
                btnEl.textContent = btn.label;
                btnEl.addEventListener('click', btn.onClick);
                buttonsEl.appendChild(btnEl);
            });

            content.appendChild(buttonsEl);
        }
    }

    /**
     * Clear metadata display
     */
    clear() {
        const content = document.getElementById('inspectorContent');
        if (content) {
            content.innerHTML = '';
        }
    }
}
