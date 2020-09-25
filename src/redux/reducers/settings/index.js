import {
  SET_SETTINGS,
  SETTINGS_LOADING,
  CLEAR_SETTINGS_ERROR,
  SET_COMPANY_AVATAR
} from '../../action-types';

export default (
  state = {
    settings: {},
    loading: true,
    settingsUpdateError: null,
    success: false
  },
  action
) => {
  switch (action.type) {
    case SETTINGS_LOADING: {
      const {
        loading,
        settingsUpdateError = null,
        success = false
      } = action.payload;
      return { ...state, loading, settingsUpdateError, success };
    }
    case SET_COMPANY_AVATAR: {
      const {
        data,
        loading,
        settingsUpdateError = null,
        success = false
      } = action.payload;
      const newUserState = { ...state.settings, avatar: data };
      return {
        ...state,
        loading,
        settings: newUserState,
        settingsUpdateError,
        success
      };
    }
    case SET_SETTINGS: {
      const {
        data,
        loading,
        settingsUpdateError = null,
        success = false
      } = action.payload;
      const settingsState = { ...state.settings, ...data };
      return {
        ...state,
        loading,
        settings: settingsState,
        settingsUpdateError,
        success
      };
    }
    case CLEAR_SETTINGS_ERROR: {
      return {
        ...state,
        loading: false,
        settingsUpdateError: null,
        success: false
      };
    }
    default: {
      return state;
    }
  }
};
