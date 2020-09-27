import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { createUser } from '../../firebase-helpers/functions/authFunctions';
import { USER_PROFILES_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';

import {
  Button,
  Box,
  Divider,
  CircularProgress,
  Grid,
  Card,
  CardHeader,
  CardContent,
  MenuItem
} from '../../materials';
import { history } from '../../router';
import { db } from '../../services/firebase';
import Page from '../../shared/components/Page';
import { EDIT } from '../../shared/constants';
import { UserProfile } from '../../models/User';

const UserForm = (props) => {
  const { classes } = props;
  const { action, id: documentId } = useParams();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    password: '',
    role: ''
  });

  useEffect(() => {
    if (action === EDIT) {
      const documentDocRef = db
        .collection(USER_PROFILES_COLLECTION)
        .doc(documentId);
      documentDocRef.get().then((documentDoc) => {
        setState((prevState) => ({
          ...prevState,
          ...documentDoc.data()
        }));
      });
    }
  }, [action, documentId]);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const createDocument = async (payload) => {
    try {
      // Generate Default Password
      const newDocumentData = payload;

      // Create User Account
      const response = await createUser(newDocumentData);
      console.log({ response });

      // Create User Profile
      const { uid } = response;
      const newDocumentRef = db.collection(USER_PROFILES_COLLECTION).doc(uid);
      newDocumentData.id = uid;
      const newUserProfile = new UserProfile(newDocumentData).sanitize();
      await newDocumentRef.set(newUserProfile.credentials);
      enqueueSnackbar('User created successfully!', { variant: 'success' });
      history.goBack();
    } catch (error) {
      // TODO: Handle error properly
      enqueueSnackbar(error.message, { variant: 'error' });
      Sentry.captureException(error);
    }
  };

  const updateDocument = async (payload) => {
    try {
      const customoreRef = db
        .collection(USER_PROFILES_COLLECTION)
        .doc(documentId);
      const customerData = { ...payload };
      await customoreRef.set(customerData);
      enqueueSnackbar('User saved successfully!', { variant: 'success' });
      history.goBack();
    } catch (error) {
      // TODO: Handle error properly
      enqueueSnackbar(error.message, { variant: 'error' });
      Sentry.captureException(error);
    }
  };

  const saveDocument = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      action === EDIT
        ? await updateDocument(state)
        : await createDocument(state);
      setLoading(false);
    } catch (error) {
      // TODO: Use error logging strategy
      enqueueSnackbar(error.message, { variant: 'error' });
      setLoading(false);
      Sentry.captureException(error);
    }
  };

  return (
    <Page title="Billing App | Manage User">
      <ValidatorForm
        autoComplete="off"
        noValidate
        onSubmit={(e) => saveDocument(e)}
        className={classes.loginRoot}
      >
        <Card>
          <CardHeader title="User Profile" />
          <Divider />
          <CardContent>
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
                  disabled={action === EDIT}
                  label="Email Address"
                  name="email"
                  margin="normal"
                  value={state.email}
                  validators={['required']}
                  errorMessages={['Email is required']}
                  onChange={onInputChange}
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
              <Grid item md={6} xs={12}>
                <SelectValidator
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  label="Role"
                  value={state.role}
                  onChange={onInputChange}
                  id="role"
                  name="role"
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Invoicing">Invoicing</MenuItem>
                  <MenuItem value="Viewing">Viewing</MenuItem>
                </SelectValidator>
              </Grid>
              {action !== EDIT && (
                <Grid item md={6} xs={12}>
                  <TextValidator
                    value={state.password}
                    onChange={onInputChange}
                    validators={['required']}
                    errorMessages={['Temp password is required']}
                    type="password"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Temporary Password"
                    name="password"
                  />
                </Grid>
              )}
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
    </Page>
  );
};

export default UserForm;
