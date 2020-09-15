import { combineReducers } from 'redux';
import loginReducer from './auth';
import profileReducer from './profile';
import usersReducer from './users';
import dashboardReducer from './dashboard';
import sharedReducer from './shared';

const rootReducer = combineReducers({
  auth: loginReducer,
  profile: profileReducer,
  users: usersReducer,
  dashboard: dashboardReducer,
  shared: sharedReducer
});

export default rootReducer;
