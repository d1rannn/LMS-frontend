import { combineReducers, createStore } from 'redux';
import authReducer from './reducers/authReducer';
import progressReducer from './reducers/progressReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    progress: progressReducer
});

const store = createStore(rootReducer);

export default store;