import * as Sentry from '@sentry/react';
import {
  SET_USER_PROFILE,
  PROFILE_LOADING,
  CLEAR_PROFILE_ERROR,
  SET_USER_PROFILE_AVATAR
} from '../../action-types';
import { dispatcher } from '../action.helper';
import {
  getProfile,
  updateUserProfile,
  updateUserProfileAvatar
} from '../../../firebase-helpers/functions/userProfileFunctions';
import { UserProfile } from '../../../models/User';
import { Avatar } from '../../../models/Avatar';

export const setUserProfile = (data) => async (dispatch) => {
  dispatcher(dispatch, SET_USER_PROFILE, {
    loading: false,
    data
  });
};

export const getUserProfile = (id) => async (dispatch) => {
  try {
    const userProfile = await getProfile(id);

    Sentry.setUser({
      id,
      email: userProfile.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName
    });

    dispatcher(dispatch, SET_USER_PROFILE, {
      data: userProfile,
      loading: false
    });
  } catch (error) {
    dispatcher(dispatch, SET_USER_PROFILE, {
      profileUpdateError: error,
      loading: false
    });
  }
};

export const updateUserProfileInformation = (payload) => async (dispatch) => {
  dispatcher(dispatch, PROFILE_LOADING, {
    loading: true,
    success: false
  });
  try {
    const userProfile = new UserProfile(payload).sanitize();
    await updateUserProfile(userProfile.credentials);
    dispatcher(dispatch, SET_USER_PROFILE, {
      data: userProfile.credentials,
      success: true,
      loading: false
    });
  } catch (error) {
    dispatcher(dispatch, PROFILE_LOADING, {
      profileUpdateError: error,
      success: false,
      loading: false
    });
  }
};

export const updateProfileAvatar = (payload) => async (dispatch) => {
  dispatcher(dispatch, PROFILE_LOADING, {
    loading: true,
    success: false
  });
  try {
    const userAvatar = new Avatar(payload).sanitize();
    const avatarUrl = await updateUserProfileAvatar(userAvatar.credentials);
    dispatcher(dispatch, SET_USER_PROFILE_AVATAR, {
      data: avatarUrl,
      success: true,
      loading: false
    });
  } catch (error) {
    dispatcher(dispatch, PROFILE_LOADING, {
      profileUpdateError: error,
      success: false,
      loading: false
    });
  }
};

export const clearProfileError = () => async (dispatch) => {
  dispatcher(dispatch, CLEAR_PROFILE_ERROR);
};
