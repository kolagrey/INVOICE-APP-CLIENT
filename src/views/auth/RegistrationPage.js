import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';

import RegistrationForm from './components/RegistrationForm';

import authAction from '../../redux/actions/authuth';
const { clearAuthError, registerAdminUser } = authAction;

const RegistrationPage = (props) => {
  const { classes, error, registerUser, loading } = props; 
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error && error.message) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    return () => {
      clearAuthError();
    };
  }, [error, enqueueSnackbar]);

  return (
    <RegistrationForm
      classes={classes}
      errorMessage={error ? error.message : null}
      registerUser={registerUser}
      loading={loading}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.auth.registrationError,
    loading: state.auth.loading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearAuthError: () => dispatch(clearAuthError()),
    registerUser: (payload) => {
      return dispatch(registerAdminUser(payload));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationPage);
