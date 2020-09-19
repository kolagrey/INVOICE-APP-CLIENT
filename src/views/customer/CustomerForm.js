import React, { useEffect, useState } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CUSTOMERS_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';

import {
  Button,
  Box,
  Divider,
  CircularProgress,
  Grid,
  Card,
  CardHeader,
  CardContent
} from '../../materials';
import { history } from '../../router';
import { db } from '../../services/firebase';
import Page from '../../shared/components/Page';
import { EDIT } from '../../shared/constants';

function CustomerForm(props) {
  const { classes, user } = props;
  const { action, id: customerId } = useParams();
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    createdBy: user.id,
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    telephone: '',
    operatorName: '',
    operatorTelephone: ''
  });

  useEffect(() => {
    if (action === EDIT) {
      const customerDocRef = db
        .collection(CUSTOMERS_COLLECTION)
        .doc(customerId);
      customerDocRef.get().then((customerDoc) => {
        setState(customerDoc.data());
      });
    }
  }, [action, customerId]);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const createCustomer = async (payload) => {
    try {
      const newCustomoreRef = db.collection(CUSTOMERS_COLLECTION).doc();
      const newCustomerData = payload;
      newCustomerData.id = newCustomoreRef.id;
      await newCustomoreRef.set(newCustomerData);
      history.goBack();
    } catch (error) {
      // TODO: Handle error properly
      console.log(error);
    }
  };

  const updateCustomer = async (payload) => {
    try {
      const customoreRef = db.collection(CUSTOMERS_COLLECTION).doc(customerId);
      const customerData = { ...payload };
      await customoreRef.set(customerData);
      history.goBack();
    } catch (error) {
      // TODO: Handle error properly
      console.log(error);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      action === EDIT
        ? await updateCustomer(state)
        : await createCustomer(state);
      setLoading(false);
    } catch (error) {
      // TODO: Use error logging strategy
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Page title="Invoice App | Manage Customer">
      <ValidatorForm
        autoComplete="off"
        noValidate
        onSubmit={(e) => saveProfile(e)}
        className={classes.loginRoot}
      >
        <Card>
          <CardHeader title="Customer Profile" />
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
                  value={state.companyName}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Company name is required']}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="companyName"
                  label="Company Name"
                  name="companyName"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextValidator
                  fullWidth
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
                <TextValidator
                  value={state.operatorName}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Operator fullname is required']}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="operatorName"
                  label="Operator Fullname"
                  name="operatorName"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.operatorTelephone}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Operator telephone is required']}
                  type="tel"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="operatorTelephone"
                  label="Operator Telephone"
                  name="operatorTelephone"
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
}

const mapStateToProps = (state) => {
  return {
    user: state.profile.user
  };
};

export default connect(mapStateToProps, null)(CustomerForm);
