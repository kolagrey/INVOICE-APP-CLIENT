import {
  SET_USER_PROFILE,
  PROFILE_LOADING,
  CLEAR_PROFILE_ERROR,
  SET_USER_PROFILE_AVATAR
} from '../../action-types';

export default (
  state = { user: {}, loading: true, profileUpdateError: null, success: false },
  action
) => {
  switch (action.type) {
    case PROFILE_LOADING: {
      const {
        loading,
        profileUpdateError = null,
        success = false
      } = action.payload;
      return { ...state, loading, profileUpdateError, success };
    }
    case SET_USER_PROFILE_AVATAR: {
      const {
        data,
        loading,
        profileUpdateError = null,
        success = false
      } = action.payload;
      const newUserState = { ...state.user, avatar: data };
      return {
        ...state,
        loading,
        user: newUserState,
        profileUpdateError,
        success
      };
    }
    case SET_USER_PROFILE: {
      const {
        data,
        loading,
        profileUpdateError = null,
        success = false
      } = action.payload;
      const userState = { ...state.user, ...data};
      return { ...state, loading, user: userState, profileUpdateError, success };
    }
    case CLEAR_PROFILE_ERROR: {
      return {
        ...state,
        loading: false,
        profileUpdateError: null,
        success: false
      };
    }
    default: {
      return state;
    }
  }
};
