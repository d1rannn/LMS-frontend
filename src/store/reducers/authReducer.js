const savedUser = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: savedUser || null,
    justLoggedIn: false,
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload,
                justLoggedIn: true,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                justLoggedIn: false,
            };
        case 'CLEAR_LOGIN_FLAG':
            return {
                ...state,
                justLoggedIn: false,
            };
        case 'UPDATE_AVATAR': // New action to handle avatar update
            return {
                ...state,
                user: {
                    ...state.user,
                    avatarUrl: action.payload, // Update the avatar URL in the user object
                },
            };
        default:
            return state;
    }
}