/**
 * Initial courses data
 */

export const initialState = {
    courses: [
        {
            id: 'course-1',
            title: 'Introduction to ML',
            expanded: true,
            tasks: [
                {
                    id: 'task-1',
                    title: 'Data Preprocessing',
                    createdAt: '11/03/2024'
                },
                {
                    id: 'task-2',
                    title: 'Model Training',
                    createdAt: '12/03/2024'
                }
            ]
        },
        {
            id: 'course-2',
            title: 'Deep Learning',
            expanded: true,
            tasks: [
                {
                    id: 'task-3',
                    title: 'CNN Basics',
                    createdAt: '15/03/2024'
                }
            ]
        }
    ]
};
