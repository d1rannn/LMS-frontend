import { createStore, combineReducers } from 'redux';
import authReducer from './reducers/authReducer'; // ✅ correct path

const rootReducer = combineReducers({
    auth: authReducer, // ✅ MUST match what you're accessing in useSelector(state => state.auth.user)
});

const store = createStore(rootReducer);

export default store;