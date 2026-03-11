/**
 * Activity Bar Component
 * Left icon bar for switching navigation modes
 */

export class ActivityBar {
    constructor(container) {
        this.container = container;
        this.activeItem = null;
    }

    /**
     * Initialize activity bar with items
     * @param {Array} items - Activity items configuration
     * @param {Function} onItemClick - Callback when item is clicked
     */
    init(items, onItemClick) {
        const bar = document.createElement('div');
        bar.className = 'activity-bar';
        bar.setAttribute('role', 'toolbar');
        bar.setAttribute('aria-label', 'Activity Navigation');

        items.forEach(item => {
            const itemEl = document.createElement('button');
            itemEl.className = 'activity-item';
            itemEl.setAttribute('title', item.title);
            itemEl.setAttribute('aria-label', item.title);
            itemEl.innerHTML = item.icon;
            itemEl.dataset.action = item.action;

            itemEl.addEventListener('click', () => {
                this.setActive(itemEl);
                onItemClick(item.action);
            });

            bar.appendChild(itemEl);
        });

        this.container.appendChild(bar);
    }

    /**
     * Set active state on activity item
     * @param {HTMLElement} element - Item element to activate
     */
    setActive(element) {
        if (this.activeItem) {
            this.activeItem.classList.remove('active');
        }
        element.classList.add('active');
        this.activeItem = element;
    }
}
