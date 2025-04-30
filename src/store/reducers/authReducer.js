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
        default:
            return state;
    }
}