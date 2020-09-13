import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import {
  Avatar,
  Button,
  CssBaseline,
  CircularProgress,
  Paper,
  Box,
  Grid,
  Typography
} from '../../../materials';
import Copyright from '../../../shared/components/Copyright';
import { Logo192 } from '../../../assets';

const RegistrationForm = (props) => {
  const { classes, registerUser, loading, errorMessage } = props;
  const [state, setState] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordValid', (value) => {
      if (value < 6) {
        return false;
      }
      return true;
    });

    return () => {
      ValidatorForm.removeValidationRule('isPasswordValid');
    };
  });

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      await registerUser(state);
    } catch (error) {
      // TODO: Use error logging strategy
      console.log(error);
    }
  };

  return (
    <Grid container component="main" className={classes.loginRoot}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.logo} src={Logo192} />
          <Typography component="h1" variant="h5">
            Create an Account
          </Typography>
          <ValidatorForm
            onSubmit={(e) => submitLogin(e)}
            className={classes.form}
            noValidate
          >
            <TextValidator
              value={state.firstName}
              onChange={onInputChange}
              validators={['required']}
              errorMessages={['Firstname is required']}
              type="text"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="Firstname"
              name="firstName"
              autoFocus
            />
            <TextValidator
              value={state.lastName}
              onChange={onInputChange}
              validators={['required']}
              errorMessages={['Lastname is required']}
              type="text"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Lastname"
              name="lastName"
            />
            <TextValidator
              value={state.email}
              onChange={onInputChange}
              validators={['required', 'isEmail']}
              errorMessages={['Email is required', 'Email is not valid']}
              type="email"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <TextValidator
              value={state.password}
              onChange={onInputChange}
              validators={['required', 'isPasswordValid']}
              error={errorMessage ? errorMessage.indexOf("Password") !== -1 : false}
              errorMessages={[
                'Password is required',
                'Password must be at least 6 characters'
              ]}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            <Button
              type="submit"
              disabled={props.loading}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {!loading ? 'Create Account' : <CircularProgress />}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/login" variant="body2">
                  Got an account? Sign In
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </ValidatorForm>
        </div>
      </Grid>
    </Grid>
  );
};

RegistrationForm.propTypes = {
  classes: PropTypes.object,
  errorMessage: PropTypes.string,
  registerUser: PropTypes.func,
  loading: PropTypes.bool
};

export default RegistrationForm;
