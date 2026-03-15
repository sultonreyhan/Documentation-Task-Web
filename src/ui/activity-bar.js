/**
 * Activity Bar Component
 * Left icon bar for switching navigation modes
 * Configuration-driven architecture: icons defined separately
 */

export class ActivityBar {
    constructor(container) {
        this.container = container;
        this.activeItem = null;
        this.items = [];
        this.barElement = null;
    }

    /**
     * Initialize activity bar with configuration
     * @param {Array} items - Activity items configuration with id, icon, label
     * @param {Function} onItemClick - Callback when item is clicked
     */
    init(items, onItemClick) {
        this.items = items;
        this.barElement = this._createBar();

        items.forEach((item, index) => {
            const buttonEl = this._createButton(item);
            
            buttonEl.addEventListener('click', () => {
                this.setActive(index);
                onItemClick(item.id);
            });

            this.barElement.appendChild(buttonEl);
        });

        this.container.appendChild(this.barElement);
        
        // Set first item as active by default
        if (items.length > 0) {
            this.setActive(0);
        }
    }

    /**
     * Create activity bar container
     * @private
     */
    _createBar() {
        const bar = document.createElement('div');
        bar.className = 'activity-bar';
        bar.setAttribute('role', 'toolbar');
        bar.setAttribute('aria-label', 'Activity Navigation');
        return bar;
    }

    /**
     * Create button for activity item
     * @private
     */
    _createButton(item) {
        const button = document.createElement('button');
        button.className = 'activity-bar-button';
        button.setAttribute('title', item.label);
        button.setAttribute('aria-label', item.label);
        button.dataset.activityId = item.id;

        // Load SVG from file if iconPath provided
        if (item.iconPath) {
            this._loadSVGIcon(button, item.iconPath);
        } else if (item.icon) {
            // Fallback to inline SVG if provided
            button.innerHTML = item.icon;
        }

        return button;
    }

    /**
     * Load SVG icon from file
     * @private
     */
    _loadSVGIcon(buttonElement, iconPath) {
        console.log(`Loading icon: ${iconPath}`);
        
        fetch(iconPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load icon: ${iconPath} (${response.status})`);
                }
                return response.text();
            })
            .then(svgContent => {
                // Parse SVG content
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
                
                // Check for parsing errors
                if (svgDoc.documentElement.tagName === 'parsererror') {
                    throw new Error('SVG parsing failed');
                }
                
                // Get SVG element
                const svgElement = svgDoc.documentElement;
                
                // Set attributes for proper scaling
                svgElement.setAttribute('width', '24');
                svgElement.setAttribute('height', '24');
                svgElement.setAttribute('viewBox', '0 0 512 512');
                svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                svgElement.classList.add('activity-bar-icon');
                
                // Remove inline styles/colors to allow CSS theming
                svgElement.style.fill = 'currentColor';
                svgElement.style.stroke = 'none';
                
                // Clear button and add SVG
                buttonElement.innerHTML = '';
                buttonElement.appendChild(svgElement);
                
                console.log(`Icon loaded successfully: ${iconPath}`);
            })
            .catch(error => {
                console.error('Icon loading error:', error);
                // Fallback: show a placeholder
                buttonElement.innerHTML = '<span class="activity-bar-icon-error">●</span>';
            });
    }

    /**
     * Set active state on activity item by index
     * @param {number} index - Index of item to activate
     */
    setActive(index) {
        const buttons = this.barElement.querySelectorAll('.activity-bar-button');
        
        buttons.forEach((btn, idx) => {
            if (idx === index) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });

        this.activeItem = buttons[index];
    }

    /**
     * Get current active item ID
     */
    getActiveId() {
        return this.activeItem?.dataset.activityId;
    }
}
