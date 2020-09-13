import { combineReducers } from 'redux';
import loginReducer from './auth';
import profileReducer from './profile';
import usersReducer from './users';
import dashboardReducer from './dashboard';

const rootReducer = combineReducers({
  auth: loginReducer,
  profile: profileReducer,
  users: usersReducer,
  dashboard: dashboardReducer
});

export default rootReducer;
