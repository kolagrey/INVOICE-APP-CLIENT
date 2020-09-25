import { combineReducers } from 'redux';
import loginReducer from './auth';
import profileReducer from './profile';
import usersReducer from './users';
import dashboardReducer from './dashboard';
import sharedReducer from './shared';
import settingsReducer from './settings';

const rootReducer = combineReducers({
  auth: loginReducer,
  profile: profileReducer,
  users: usersReducer,
  dashboard: dashboardReducer,
  shared: sharedReducer,
  settings: settingsReducer
});

export default rootReducer;
