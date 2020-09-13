import { SET_AUTHENTICATION_STATE, SET_REGISTRATION_STATE, CLEAR_AUTHENTICATION_STATE } from '../../action-types';

export default (state = {
  loading: false,
  isAuthenticated: false,
  authenticationError: null,
  registrationError: null
}, action = { type: '' }) => {
  switch (action.type) {
    case SET_AUTHENTICATION_STATE: {
      const { loading = false, isAuthenticated = false, authenticationError = null } = action.payload;
      return {
        ...state,
        loading,
        isAuthenticated,
        authenticationError
      };
    }
    case SET_REGISTRATION_STATE: {
      const { loading = false, isAuthenticated = false, registrationError = null } = action.payload;
      return {
        ...state,
        loading,
        isAuthenticated,
        registrationError
      };
    }
    case CLEAR_AUTHENTICATION_STATE: {
      return {
        ...state,
        loading: false,
        authenticationError: null,
        registrationError: null
      };
    }
    default: {
      return state
    }
  }
};
