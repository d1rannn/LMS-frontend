// store/reducers/progressReducer.js
const initialState = {
    progressByCourse: {}
};

export default function progressReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_PROGRESS':
            return {
                ...state,
                progressByCourse: {
                    ...state.progressByCourse,
                    [action.payload.courseId]: action.payload.completedModules
                }
            };

        case 'ADD_COMPLETED_MODULE': {
            const existingModules = state.progressByCourse[action.payload.courseId] || [];
            if (existingModules.includes(action.payload.moduleId)) {
                return state; // No need to update
            }
            return {
                ...state,
                progressByCourse: {
                    ...state.progressByCourse,
                    [action.payload.courseId]: [...existingModules, action.payload.moduleId]
                }
            };
        }

        default:
            return state;
    }
}