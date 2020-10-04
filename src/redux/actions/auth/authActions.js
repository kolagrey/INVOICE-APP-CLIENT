import {
  SET_AUTHENTICATION_STATE,
  SET_REGISTRATION_STATE,
  CLEAR_AUTHENTICATION_STATE
} from '../../action-types';

import { dispatcher } from '../action.helper';
import { history } from '../../../router';

import {
  signUp,
  signIn,
  signOut,
  sendVerificationEmail
} from '../../../firebase-helpers/functions/authFunctions';
import { updateAdminProfile } from '../../../firebase-helpers/functions/userProfileFunctions';
import { UserAuth, UserProfile } from '../../../models/User';

export const registerAdminUser = (payload) => async (dispatch) => {
  dispatcher(dispatch, SET_REGISTRATION_STATE, { loading: true });
  try {
    // Create User Account
    const userAuth = new UserAuth(payload).sanitize();
    const newUserCredential = await signUp(userAuth.credentials);

    // Create User Profile
    const { uid } = newUserCredential.user;
    const newPayload = { id: uid, ...payload };
    const user = new UserProfile(newPayload).sanitize();
    await updateAdminProfile(user.credentials);
    await sendVerificationEmail();
    dispatcher(dispatch, SET_REGISTRATION_STATE, {
      loading: false
    });
    dispatcher(dispatch, SET_AUTHENTICATION_STATE, {
      loading: false
    });
    await signOut();
    history.push('/login');
  } catch (error) {
    dispatcher(dispatch, SET_REGISTRATION_STATE, {
      registrationError: error,
      loading: false
    });
  }
};

export const authenticateUser = (payload) => async (dispatch) => {
  dispatcher(dispatch, SET_AUTHENTICATION_STATE, { loading: true });
  try {
    await signIn(payload);
    dispatcher(dispatch, SET_AUTHENTICATION_STATE, {
      isAuthenticated: true
    });
  } catch (error) {
    dispatcher(dispatch, SET_AUTHENTICATION_STATE, {
      authenticationError: error,
      loading: false
    });
  }
};

export const logOutUser = () => async (dispatch) => {
  dispatcher(dispatch, SET_AUTHENTICATION_STATE, { loading: true });
  await signOut();
  dispatcher(dispatch, SET_AUTHENTICATION_STATE, {
    loading: false,
    isAuthenticated: false
  });
  history.push('/');
};

export const clearAuthError = () => async (dispatch) => {
  dispatcher(dispatch, CLEAR_AUTHENTICATION_STATE);
};
