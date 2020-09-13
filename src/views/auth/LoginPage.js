import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import LoginForm from './components/LoginForm';

import authActions from '../../redux/actions/authuth';
const { clearAuthError, authenticateUser } = authActions;

const LoginPage = (props) => {
  const { classes, error, authenticateUser, loading, clearAuthError, isAuthenticated } = props;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if(error && error.message) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    if(isAuthenticated) {
      enqueueSnackbar('Login successful!', { variant: 'success' });
    }
    return () => {
      clearAuthError();
    };
  },[isAuthenticated, clearAuthError, error, enqueueSnackbar]);

  return (
    <LoginForm
      classes={classes}
      errorMessage={error ? error.message : null}
      authenticateUser={authenticateUser}
      loading={loading}
      clearAuthError={clearAuthError}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.auth.authenticationError,
    loading: state.auth.loading,
    isAuthenticated: state.auth.isAuthenticated
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearAuthError: () => dispatch(clearAuthError()),
    authenticateUser: (payload) => {
      return dispatch(authenticateUser(payload));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
