/**
 * Initial courses data
 */

export const initialState = {
    courses: [
        {
            id: 'course-1',
            title: 'Introduction to JavaScript',
            expanded: true,
            tasks: [
                {
                    id: 'task-1',
                    title: 'Getting Started',
                    createdAt: '01/01/2024'
                },
                {
                    id: 'task-2',
                    title: 'Basic Concepts',
                    createdAt: '01/02/2024'
                }
            ]
        },
        {
            id: 'course-2',
            title: 'Web Development Basics',
            expanded: true,
            tasks: [
                {
                    id: 'task-3',
                    title: 'HTML & CSS',
                    createdAt: '01/03/2024'
                }
            ]
        }
    ]
};
