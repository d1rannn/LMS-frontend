export const loginSuccess = (user) => {
    localStorage.setItem('user', JSON.stringify(user)); // ✅ Save user to localStorage
    return {
        type: 'LOGIN_SUCCESS',
        payload: user,
    };
};

export const logout = () => {
    localStorage.removeItem('user');
    return {
        type: 'LOGOUT',
    };
};

export const clearLoginFlag = () => ({
    type: 'CLEAR_LOGIN_FLAG',
});

export const updateAvatar = (avatarUrl) => {
    return {
        type: 'UPDATE_AVATAR',
        payload: avatarUrl, // Avatar URL to be updated in the store
    };
};
