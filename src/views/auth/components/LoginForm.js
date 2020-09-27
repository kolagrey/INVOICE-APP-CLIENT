import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import * as Sentry from '@sentry/react';
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

const LoginForm = (props) => {
  const { classes, authenticateUser, loading } = props;
  const [state, setState] = useState({
    email: '',
    password: '',
    remember: false
  });

  const onInputChange = (event) => {
    const { name, value, type } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? event.target.checked : value
    }));
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      await authenticateUser(state);
    } catch (error) {
      // TODO: Use error logging strategy
      Sentry.captureException(error);
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
            Sign in
          </Typography>
          <ValidatorForm
            onSubmit={(e) => submitLogin(e)}
            className={classes.form}
            noValidate
          >
            <TextValidator
              value={state.email}
              onChange={onInputChange}
              validators={['required', 'isEmail']}
              errorMessages={['Email is required', 'Email is not valid']}
              type="email"
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextValidator
              value={state.password}
              onChange={onInputChange}
              validators={['required']}
              errorMessages={['Password is required']}
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              disabled={props.loading}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {!loading ? 'Sign In' : <CircularProgress />}
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </ValidatorForm>
        </div>
      </Grid>
    </Grid>
  );
};

LoginForm.propTypes = {
  classes: PropTypes.object,
  authenticateUser: PropTypes.func,
  errorMessage: PropTypes.string,
  chartData: PropTypes.object,
  chartOptions: PropTypes.object,
  loading: PropTypes.bool
};

export default LoginForm;
