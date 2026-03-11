/**
 * UI Controller
 * Main orchestrator for all UI components and application logic
 */

import { ActivityBar } from './activity-bar.js';
import { NavigationPanel } from './navigation-panel.js';
import { ContentWorkspace } from './content-workspace.js';
import { InspectorPanel } from './inspector-panel.js';
import { DNNClassifier } from '../core/nn-classifier.js';
import { CSVParser } from '../utils/csv-parser.js';
import { FileHandler } from '../utils/file-handler.js';

export class UIController {
    constructor() {
        this.classifier = new DNNClassifier();
        this.components = {};
        this.state = {
            trainData: null,
            testData: null
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

        // Setup activity bar
        const activityItems = [
            {
                action: 'courses',
                title: 'Courses',
                icon: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
            },
            {
                action: 'search',
                title: 'Search',
                icon: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
            },
            {
                action: 'favorites',
                title: 'Favorites',
                icon: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 10.26 24 10.35 17.77 16.01 19.91 24.16 12 18.77 4.09 24.16 6.23 16.01 0 10.35 8.91 10.26 12 2"/></svg>'
            },
            {
                action: 'settings',
                title: 'Settings',
                icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m6.08 0l4.24-4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m6.08 0l4.24 4.24"/></svg>'
            }
        ];

        this.components.activityBar.init(activityItems, (action) => {
            this._handleActivitySelect(action);
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
     */
    _handleActivitySelect(action) {
        console.log('Activity selected:', action);
        // Handle different activity actions
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
