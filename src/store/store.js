// src/store/store.js
import { createStore, combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
// import other reducers...

const rootReducer = combineReducers({
    auth: authReducer,
    // other: otherReducer,
});

const store = createStore(
    rootReducer
    // , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;