import {
  SET_SETTINGS,
  SETTINGS_LOADING,
  CLEAR_SETTINGS_ERROR,
  SET_COMPANY_AVATAR
} from '../../action-types';
import { dispatcher } from '../action.helper';
import {
  getCompanySettings,
  updateSettings,
  updateAvatar
} from '../../../firebase-helpers/functions/companySettingsFunctions';
import { Settings } from '../../../models/Settings';
import { Avatar } from '../../../models/Avatar';

export const setSettings = (data) => async (dispatch) => {
  dispatcher(dispatch, SET_SETTINGS, {
    loading: false,
    data
  });
};

export const getSettings = () => async (dispatch) => {
  try {
    const settings = await getCompanySettings();
    dispatcher(dispatch, SET_SETTINGS, {
      data: settings,
      loading: false
    });
  } catch (error) {
    dispatcher(dispatch, SET_SETTINGS, {
      settingsUpdateError: error,
      loading: false
    });
  }
};

export const updateCompanySettings = (payload) => async (dispatch) => {
  dispatcher(dispatch, SETTINGS_LOADING, {
    loading: true,
    success: false
  });
  try {
    const settings = new Settings(payload).sanitize();
    await updateSettings(settings.credentials);
    dispatcher(dispatch, SET_SETTINGS, {
      data: settings.credentials,
      success: true,
      loading: false
    });
  } catch (error) {
    dispatcher(dispatch, SETTINGS_LOADING, {
      settingsUpdateError: error,
      success: false,
      loading: false
    });
  }
};

export const updateCompanyAvatar = (payload) => async (dispatch) => {
  dispatcher(dispatch, SETTINGS_LOADING, {
    loading: true,
    success: false
  });
  try {
    const companyAvatar = new Avatar(payload).sanitize();
    const avatarUrl = await updateAvatar(companyAvatar.credentials);
    dispatcher(dispatch, SET_COMPANY_AVATAR, {
      data: avatarUrl,
      success: true,
      loading: false
    });
  } catch (error) {
    dispatcher(dispatch, SETTINGS_LOADING, {
      settingsUpdateError: error,
      success: false,
      loading: false
    });
  }
};

export const clearSettingsError = () => async (dispatch) => {
  dispatcher(dispatch, CLEAR_SETTINGS_ERROR);
};
