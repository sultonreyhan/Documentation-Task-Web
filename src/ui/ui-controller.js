/**
 * UI Controller
 * Main orchestrator for all UI components and application logic
 */

import { ActivityBar } from './activity-bar.js';
import { NavigationPanel } from './navigation-panel.js';
import { NavigationPanelNew } from './navigation-panel-new.js';
import { ContentWorkspace } from './content-workspace.js';
import { InspectorPanel } from './inspector-panel.js';
import { DNNClassifier } from '../core/nn-classifier.js';
import { CSVParser } from '../utils/csv-parser.js';
import { FileHandler } from '../utils/file-handler.js';
import { StateManager } from './state-manager.js';
import { initialState } from '../data/courses-data.js';
import { getMeetingLabel } from '../utils/date-formatter.js';

/**
 * Activity Bar Configuration
 * Define all activity items with SVG file references
 * Icons are loaded from pics/ folder with paths relative to index.html
 */
const ACTIVITY_BAR_CONFIG = [
    {
        id: 'courses',
        label: 'Courses',
        iconPath: '../pics/book.svg'
    },
    {
        id: 'search',
        label: 'Search',
        iconPath: '../pics/search.svg'
    },
    {
        id: 'favorites',
        label: 'Favorites',
        iconPath: '../pics/star.svg'
    },
    {
        id: 'settings',
        label: 'Settings',
        iconPath: '../pics/settings.svg'
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
        // Initialize StateManager with initial data
        this.stateManager = new StateManager(initialState);
    }

    /**
     * Initialize all UI components
     */
    async init() {
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
        // Display course metadata
        const metadata = {
            course: course.title,
            tasks: `${course.tasks.length} tasks`,
            date: new Date().toLocaleDateString('id-ID')
        };
        this.components.inspector.displayMetadata(metadata);
    }

    /**
     * Handle task selection
     * @private
     */
    _handleTaskSelect(taskData) {
        console.log('Task selected:', taskData.task.title);
        
        // Create task object with blocks
        const task = {
            id: taskData.task.id,
            name: taskData.task.title,
            blocks: [
                {
                    label: 'CONTENT',
                    type: 'text',
                    content: 'This is content'
                }
            ],
            metadata: {
                course: taskData.course.title,
                meeting: getMeetingLabel(taskData.taskIndex),
                date: taskData.task.createdAt
            }
        };

        // Display task content
        this.components.contentWorkspace.displayTask(task);
        
        // Display metadata (read-only for now)
        this.components.inspector.displayMetadata(task.metadata);
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
