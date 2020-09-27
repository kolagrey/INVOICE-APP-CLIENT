import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import Page from '../../shared/components/Page';
import LoginForm from './components/LoginForm';

import authActions from '../../redux/actions/auth';
const { clearAuthError, authenticateUser } = authActions;

const LoginPage = (props) => {
  const {
    classes,
    error,
    authenticateUser,
    loading,
    clearAuthError,
    isAuthenticated
  } = props;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error && error.message) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    if (isAuthenticated) {
      enqueueSnackbar('Login successful!', { variant: 'success' });
    }
    return () => {
      clearAuthError();
    };
  }, [isAuthenticated, clearAuthError, error, enqueueSnackbar]);

  return (
    <Page className={classes.root} title="Billing App | Login">
      <LoginForm
        classes={classes}
        errorMessage={error ? error.message : null}
        authenticateUser={authenticateUser}
        loading={loading}
        clearAuthError={clearAuthError}
      />
    </Page>
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
