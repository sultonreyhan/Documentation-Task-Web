/**
 * UI Controller
 * Main orchestrator for all UI components and application logic
 */

import { ActivityBar } from './activity-bar.js';
import { NavigationPanel } from './navigation-panel.js';
import { ContentWorkspace } from './content-workspace.js';
import { InspectorPanel } from './inspector-panel.js';
import { FileHandler } from '../utils/file-handler.js';

/**
 * Activity Bar Configuration
 * Define all activity items with icons and metadata
 * Icons must be defined separately from rendering logic
 */
const ACTIVITY_BAR_CONFIG = [
    {
        id: 'courses',
        label: 'Courses',
        icon: '<svg class="activity-bar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 19.5z"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5v-10A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    },
    {
        id: 'search',
        label: 'Search',
        icon: '<svg class="activity-bar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>'
    },
    {
        id: 'favorites',
        label: 'Favorites',
        icon: '<svg class="activity-bar-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: '<svg class="activity-bar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 10v4M4.22 4.22l2.83 2.83m8.72 0l2.83-2.83M1 12h4m10 0h4M4.22 19.78l2.83-2.83m8.72 0l2.83 2.83"/></svg>'
    }
];

export class UIController {
    constructor() {
        this.classifier = new DNNClassifier();
        this.components = {};
        this.state = {
            trainData: null,
            testData: null,
            activeActivityId: 'courses'
        };
    }

    /**
     * Initialize all UI components
     */
    async init() {
        const workspace = document.querySelector('.workspace');
        
        // Initialize components
        this.components.activityBar = new ActivityBar(workspace);
        this.components.navPanel = new NavigationPanel(workspace);
        this.components.contentWorkspace = new ContentWorkspace(workspace);
        this.components.inspector = new InspectorPanel(workspace);

        // Initialize activity bar with configuration
        this.components.activityBar.init(ACTIVITY_BAR_CONFIG, (activityId) => {
            this._handleActivitySelect(activityId);
        });

        // Setup navigation panel with sample courses
        const courses = await this._loadCourses();
        this.components.navPanel.init(courses, (task) => {
            this._handleTaskSelect(task);
        });

        // Initialize content workspace and inspector
        this.components.contentWorkspace.init();
        this.components.inspector.init();

        this._setupEventListeners();
    }

    /**
     * Load course and task data
     * @private
     * @returns {Promise<Array>} Courses data
     */
    async _loadCourses() {
        return [
            {
                name: 'Introduction to ML',
                tasks: [
                    {
                        id: 'task-1',
                        name: 'Data Preprocessing',
                        blocks: [
                            { label: 'LEARNING GOAL', type: 'text', content: 'Understand data normalization and cleaning' }
                        ],
                        metadata: {
                            course: 'Introduction to ML',
                            meeting: 'Week 1',
                            date: '2024-03-11',
                            tags: 'preprocessing, data'
                        }
                    },
                    {
                        id: 'task-2',
                        name: 'Model Training',
                        blocks: [
                            { label: 'GOAL', type: 'text', content: 'Train your first neural network' }
                        ],
                        metadata: {
                            course: 'Introduction to ML',
                            meeting: 'Week 2',
                            date: '2024-03-18'
                        }
                    }
                ]
            },
            {
                name: 'Deep Learning',
                tasks: [
                    {
                        id: 'task-3',
                        name: 'CNN Basics',
                        blocks: [
                            { label: 'EXERCISE', type: 'text', content: 'Implement convolutional layers' }
                        ],
                        metadata: {
                            course: 'Deep Learning',
                            meeting: 'Week 5',
                            date: '2024-05-01'
                        }
                    }
                ]
            }
        ];
    }

    /**
     * Handle activity bar selection
     * @private
     * @param {string} activityId - ID of selected activity
     */
    _handleActivitySelect(activityId) {
        this.state.activeActivityId = activityId;
        console.log('Activity selected:', activityId);
        
        // Handle different activity modes
        switch (activityId) {
            case 'courses':
                this._showCoursesMode();
                break;
            case 'search':
                this._showSearchMode();
                break;
            case 'favorites':
                this._showFavoritesMode();
                break;
            case 'settings':
                this._showSettingsMode();
                break;
        }
    }

    /**
     * Show courses navigation mode
     * @private
     */
    _showCoursesMode() {
        // Show navigation panel with courses
        console.log('Showing courses mode');
    }

    /**
     * Show search mode
     * @private
     */
    _showSearchMode() {
        console.log('Showing search mode');
    }

    /**
     * Show favorites mode
     * @private
     */
    _showFavoritesMode() {
        console.log('Showing favorites mode');
    }

    /**
     * Show settings mode
     * @private
     */
    _showSettingsMode() {
        console.log('Showing settings mode');
    }

    /**
     * Handle task selection
     * @private
     */
    _handleTaskSelect(task) {
        this.components.contentWorkspace.displayTask(task);
        
        // Add action buttons to metadata
        const metadata = {
            ...task.metadata,
            buttons: [
                {
                    label: 'Edit Task',
                    className: '',
                    onClick: () => alert('Edit functionality')
                },
                {
                    label: 'Export as PDF',
                    className: 'btn-secondary',
                    onClick: () => this._exportTaskPDF(task)
                }
            ]
        };
        
        this.components.inspector.displayMetadata(metadata);
    }

    /**
     * Setup event listeners
     * @private
     */
    _setupEventListeners() {
        // File upload handling would be added here
        // This connects to form elements if they exist in HTML
    }

    /**
     * Train classifier with current data
     */
    async trainClassifier(config) {
        if (!this.state.trainData) {
            alert('Please upload training data first');
            return;
        }

        try {
            this.classifier.initializeModel(config);
            this.classifier.train(this.state.trainData, config.labelColumn);

            if (this.state.testData) {
                this.classifier.results = this.classifier.evaluate(
                    this.state.testData,
                    config.labelColumn
                );
            }

            return {
                status: 'success',
                history: this.classifier.getTrainingHistory(),
                results: this.classifier.results
            };
        } catch (error) {
            console.error('Training error:', error);
            throw error;
        }
    }

    /**
     * Make prediction
     */
    makePrediction(inputs) {
        if (!this.classifier.model) {
            alert('Train the model first');
            return null;
        }

        try {
            const predictions = this.classifier.predict(inputs);
            const predictedClass = this.classifier.predictClass(inputs);

            return {
                class: predictedClass,
                probabilities: predictions.map((p, i) => ({
                    class: i,
                    probability: (p * 100).toFixed(1)
                }))
            };
        } catch (error) {
            console.error('Prediction error:', error);
            throw error;
        }
    }

    /**
     * Export classifier results
     */
    exportResults() {
        if (!this.classifier.results) {
            alert('No results to export. Train the model first.');
            return;
        }

        const data = {
            config: this.classifier.config,
            trainingHistory: this.classifier.trainingHistory,
            evaluationResults: this.classifier.results,
            timestamp: new Date().toISOString()
        };

        FileHandler.downloadJSON(
            data,
            `dnn-classifier-results-${FileHandler.getTimestamp()}.json`
        );
    }

    /**
     * Load and parse training data from file
     */
    async loadTrainData(file) {
        try {
            this.state.trainData = await CSVParser.parse(file);
            console.log('Train data loaded:', this.state.trainData);
            return this.state.trainData;
        } catch (error) {
            console.error('Error loading train data:', error);
            alert('Error loading train file: ' + error.message);
            throw error;
        }
    }

    /**
     * Load and parse test data from file
     */
    async loadTestData(file) {
        try {
            this.state.testData = await CSVParser.parse(file);
            console.log('Test data loaded:', this.state.testData);
            return this.state.testData;
        } catch (error) {
            console.error('Error loading test data:', error);
            alert('Error loading test file: ' + error.message);
            throw error;
        }
    }

    /**
     * Export task as PDF
     * @private
     */
    _exportTaskPDF(task) {
        // Placeholder for PDF export functionality
        alert('PDF export functionality - implement using html2pdf or similar library');
    }
}
