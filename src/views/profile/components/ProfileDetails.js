import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import {
  Button,
  Box,
  Divider,
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent
} from '../../../materials';

const ProfileDetails = (props) => {
  const { classes, user, errorMessage, updateUserProfileInformation } = props;
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    telephone: user.telephone
  });

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfileInformation(state);
      setLoading(false);
    } catch (error) {
      // TODO: Use error logging strategy
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <ValidatorForm
      autoComplete="off"
      noValidate
      onSubmit={(e) => saveProfile(e)}
      className={classes.loginRoot}
    >
      <Card>
        <CardHeader title="My Profile" />
        <Divider />
        <CardContent>
          {errorMessage && (
            <Typography color="textSecondary" variant="body1">
              {errorMessage}
            </Typography>
          )}
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
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
            </Grid>
            <Grid item md={6} xs={12}>
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
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                fullWidth
                label="Email Address"
                name="email"
                margin="normal"
                disabled
                value={state.email}
                variant="outlined"
                id="email"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                value={state.telephone}
                onChange={onInputChange}
                validators={['required']}
                errorMessages={['Telephone is required']}
                type="tel"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="telephone"
                label="Telephone"
                name="telephone"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            type="submit"
            disabled={props.loading}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {!loading ? 'Save' : <CircularProgress />}
          </Button>
        </Box>
      </Card>
    </ValidatorForm>
  );
};

ProfileDetails.propTypes = {
  classes: PropTypes.object,
  errorMessage: PropTypes.string,
  user: PropTypes.object,
  updateUserProfileInformation: PropTypes.func
};

export default ProfileDetails;
