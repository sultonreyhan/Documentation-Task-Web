/**
 * UI Controller
 * Main orchestrator for all UI components and application logic
 */

import { ActivityBar } from './activity-bar.js';
import { NavigationPanel } from './navigation-panel.js';
import { NavigationPanelNew } from './navigation-panel-new.js';
import { ContentWorkspace } from './content-workspace.js';
import { InspectorPanel } from './inspector-panel.js';
import { formatTaskMetadata, formatCourseMetadata } from '../utils/metadata-formatter.js';
import { StateManager } from './state-manager.js';
import { initialState } from '../data/courses-data.js';

/**
 * Activity Bar Configuration
 * Define all activity items with SVG file references
 * Icons are loaded from pics/ folder with absolute paths from document root
 */
const ACTIVITY_BAR_CONFIG = [
    {
        id: 'courses',
        label: 'Courses',
        iconPath: '/pics/book.svg'
    },
    {
        id: 'search',
        label: 'Search',
        iconPath: '/pics/search.svg'
    },
    {
        id: 'favorites',
        label: 'Favorites',
        iconPath: '/pics/star.svg'
    },
    {
        id: 'settings',
        label: 'Settings',
        iconPath: '/pics/settings.svg'
    }
];

export class UIController {
    constructor(initialStateParam = null) {
        this.components = {};
        this.state = {
            activeActivityId: 'courses'
        };
        // Initialize StateManager with initial data from storage or default
        const stateToUse = initialStateParam || initialState;
        this.stateManager = new StateManager(stateToUse);
    }

    /**
     * Initialize all UI components
     * @param {Object} initialStateParam - optional initial state from app.js
     */
    async init(initialStateParam = null) {
        // Update state if provided
        if (initialStateParam) {
            this.stateManager = new StateManager(initialStateParam);
        }
        
        const workspace = document.querySelector('.workspace');
        
        // Initialize components
        this.components.activityBar = new ActivityBar(workspace);
        this.components.navPanel = new NavigationPanelNew(workspace, this.stateManager);
        this.components.contentWorkspace = new ContentWorkspace(workspace);
        this.components.inspector = new InspectorPanel(workspace);

        // Initialize activity bar with configuration
        this.components.activityBar.init(ACTIVITY_BAR_CONFIG, (activityId) => {
            this._handleActivitySelect(activityId);
        });

        // Setup navigation panel with CRUD support
        this.components.navPanel.onTaskSelect = (taskData) => {
            this._handleTaskSelect(taskData);
        };
        this.components.navPanel.onCourseSelect = (course) => {
            this._handleCourseSelect(course);
        };
        this.components.navPanel.init();

        // Initialize content workspace and inspector
        this.components.contentWorkspace.init();
        this.components.inspector.init();

        this._setupEventListeners();
    }

    /**
     * Handle course selection
     * @private
     */
    _handleCourseSelect(course) {
        console.log('Course selected:', course.title);
        // Display course metadata using formatter
        const metadata = formatCourseMetadata(course, course.tasks.length);
        this.components.inspector.displayMetadata(metadata);
    }

    /**
     * Handle task selection
     * @private
     */
    _handleTaskSelect(taskData) {
        console.log('Task selected:', taskData.task.title);
        
        // Display task content
        const task_content = {
            id: taskData.task.id,
            name: taskData.task.title,
            blocks: [
                {
                    label: 'CONTENT',
                    type: 'text',
                    content: 'Task content will be displayed here'
                }
            ]
        };

        this.components.contentWorkspace.displayTask(task_content);
        
        // Display task metadata
        const taskMetadata = formatTaskMetadata(taskData.task);
        this.components.inspector.displayMetadata(taskMetadata);
    }

    /**
     * Setup event listeners
     * @private
     */
    _setupEventListeners() {
        // Event listeners for UI components can be added here
    }
}
