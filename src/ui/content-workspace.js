/**
 * Content Workspace Component
 * Main documentation editor area with document flow layout
 */

export class ContentWorkspace {
    constructor(container) {
        this.container = container;
        this.currentTask = null;
    }

    /**
     * Initialize content workspace
     */
    init() {
        const workspace = document.createElement('div');
        workspace.className = 'content-workspace';

        // Header
        const header = document.createElement('div');
        header.className = 'content-header';
        header.innerHTML = `
            <h2>TASK CONTENT</h2>
            <button class="content-header-action" title="More options">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
        `;
        workspace.appendChild(header);

        // Body for blocks
        const body = document.createElement('div');
        body.className = 'content-body';
        body.id = 'contentBody';
        workspace.appendChild(body);

        this.container.appendChild(workspace);
    }

    /**
     * Display task content with blocks
     * @param {Object} task - Task data with blocks
     */
    displayTask(task) {
        this.currentTask = task;
        const contentBody = document.getElementById('contentBody');
        contentBody.innerHTML = '';

        if (!task || !task.blocks) {
            contentBody.innerHTML = '<p class="block-text">Select a task to view content</p>';
            return;
        }

        task.blocks.forEach(block => {
            const blockEl = this._createBlock(block);
            contentBody.appendChild(blockEl);
        });
    }

    /**
     * Create block element based on type
     * @private
     * @param {Object} block - Block configuration
     * @returns {HTMLElement} Block element
     */
    _createBlock(block) {
        const blockEl = document.createElement('div');
        blockEl.className = `block ${block.type}-block`;

        if (block.label) {
            const labelEl = document.createElement('div');
            labelEl.className = 'block-label';
            labelEl.textContent = block.label;
            blockEl.appendChild(labelEl);
        }

        if (block.title) {
            const titleEl = document.createElement('div');
            titleEl.className = 'block-title';
            titleEl.textContent = block.title;
            blockEl.appendChild(titleEl);
        }

        switch (block.type) {
            case 'pseudocode':
                const codeEl = document.createElement('pre');
                codeEl.className = 'pseudocode-block';
                codeEl.textContent = block.content;
                blockEl.appendChild(codeEl);
                break;

            case 'text':
            default:
                const textEl = document.createElement('p');
                textEl.className = 'block-text';
                textEl.textContent = block.content;
                blockEl.appendChild(textEl);
                break;

            case 'analysis':
                const analysisEl = document.createElement('div');
                analysisEl.className = 'block-text';
                analysisEl.innerHTML = block.content;
                blockEl.appendChild(analysisEl);
                break;
        }

        return blockEl;
    }

    /**
     * Clear current content
     */
    clear() {
        const contentBody = document.getElementById('contentBody');
        if (contentBody) {
            contentBody.innerHTML = '';
        }
    }
}
