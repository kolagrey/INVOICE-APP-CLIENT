import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { CUSTOMERS_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';

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
import { titleCase } from '../../shared/utils';

const CustomerForm = (props) => {
  const { classes, user } = props;
  const { action, id: documentId } = useParams();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useState({
    createdBy: user.id,
    ownerFirstName: '',
    ownerLastName: '',
    ownerEmail: '',
    ownerTelephone: '',
    customerFullName: '',
    customerCompanyName: '',
    customerEmail: '',
    customerTelephone: '',
    customerAddress: '',
    customerCity: '',
    customerState: '',
    customerCountry: ''
  });

  useEffect(() => {
    if (action === EDIT) {
      const documentDocRef = db
        .collection(CUSTOMERS_COLLECTION)
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
      const newDocumentRef = db.collection(CUSTOMERS_COLLECTION).doc();
      const newDocumentData = payload;
      newDocumentData.id = newDocumentRef.id;
      newDocumentData.customerFullName = titleCase(payload.customerFullName);
      newDocumentData.customerCompanyName = titleCase(
        payload.customerCompanyName
      );
      await newDocumentRef.set(newDocumentData);
      enqueueSnackbar('Customer saved successfully!', { variant: 'success' });
      history.goBack();
    } catch (error) {
      // TODO: Handle error properly
      enqueueSnackbar(error.message, { variant: 'error' });
      Sentry.captureException(error);
    }
  };

  const updateDocument = async (payload) => {
    try {
      const customorRef = db.collection(CUSTOMERS_COLLECTION).doc(documentId);
      const customerData = { ...payload };
      customerData.customerFullName = titleCase(payload.customerFullName);
      customerData.customerCompanyName = titleCase(payload.customerCompanyName);
      await customorRef.set(customerData);
      enqueueSnackbar('Customer saved successfully!', { variant: 'success' });
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
      setLoading(false);
      enqueueSnackbar(error.message, { variant: 'error' });
      Sentry.captureException(error);
    }
  };

  return (
    <Page title="Billing App | Manage Customer">
      <ValidatorForm
        autoComplete="off"
        noValidate
        onSubmit={(e) => saveDocument(e)}
        className={classes.loginRoot}
      >
        <Card>
          <CardHeader title="Customer Profile" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h3>Owner's Information</h3>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.ownerFirstName}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Owner firstname is required']}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="ownerFirstName"
                  label="Owner Firstname"
                  name="ownerFirstName"
                  autoFocus
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.ownerLastName}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Owner lastname is required']}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="ownerLastName"
                  label="Owner Lastname"
                  name="ownerLastName"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextValidator
                  fullWidth
                  label="Owner Email Address"
                  name="ownerEmail"
                  margin="normal"
                  value={state.ownerEmail}
                  onChange={onInputChange}
                  variant="outlined"
                  id="ownerEmail"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.ownerTelephone}
                  onChange={onInputChange}
                  type="tel"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="ownerTelephone"
                  label="Owner Telephone"
                  name="ownerTelephone"
                />
              </Grid>
              <Divider />
              <Grid item xs={12}>
                <h3>Operator's Information</h3>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.customerFullName}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Operator fullname is required']}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="customerFullName"
                  label="Fullname"
                  name="customerFullName"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.customerCompanyName}
                  onChange={onInputChange}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="customerCompanyName"
                  label="Company Name"
                  name="customerCompanyName"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.customerAddress}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Address is required']}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="customerAddress"
                  label="Address"
                  name="customerAddress"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <SelectValidator
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={state.customerCity}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['City is required']}
                  id="customerCity"
                  label="City"
                  name="customerCity"
                >
                  <MenuItem value="Abraham Adesanya">Abraham Adesanya</MenuItem>
                </SelectValidator>
              </Grid>
              <Grid item md={6} xs={12}>
                <SelectValidator
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={state.customerState}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['State is required']}
                  id="customerState"
                  label="State"
                  name="customerState"
                >
                  <MenuItem value="Lagos">Lagos</MenuItem>
                </SelectValidator>
              </Grid>
              <Grid item md={6} xs={12}>
                <SelectValidator
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={state.customerCountry}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Country is required']}
                  id="customerCountry"
                  label="Country"
                  name="customerCountry"
                >
                  <MenuItem value="Nigeria">Nigeria</MenuItem>
                </SelectValidator>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextValidator
                  fullWidth
                  label="Email Address"
                  name="customerEmail"
                  margin="normal"
                  value={state.customerEmail}
                  onChange={onInputChange}
                  variant="outlined"
                  id="customerEmail"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.customerTelephone}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Operator telephone is required']}
                  type="tel"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="customerTelephone"
                  label="Telephone"
                  name="customerTelephone"
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
    </Page>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.profile.user
  };
};

export default connect(mapStateToProps, null)(CustomerForm);
