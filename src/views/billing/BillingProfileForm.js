import React, { useCallback, useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  CUSTOMERS_COLLECTION,
  SETTINGS_COLLECTION,
  BILLING_PROFILES_COLLECTION
} from '../../firebase-helpers/constants/collectionsTypes';
import { useSnackbar } from 'notistack';

import {
  Button,
  Box,
  Divider,
  CircularProgress,
  Grid,
  Card,
  CardHeader,
  CardContent,
  MenuItem,
  Typography
} from '../../materials';
import { history } from '../../router';
import { db } from '../../services/firebase';
import Page from '../../shared/components/Page';
import { ACTIVE, EDIT, SETTINGS_ID } from '../../shared/constants';
import { currencyFormatter } from '../../shared/utils';

const BillingProfileForm = (props) => {
  const { classes, user } = props;
  const { action, id: documentId } = useParams();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [customers, setCustomers] = useState([]);
  const [settings, setSettings] = useState({});

  const [state, setState] = useState({
    createdBy: user.id,
    customer: '',
    customerId: '',
    shopNumber: '',
    shopUnits: 1,
    shopStatus: 'Active',
    baseServiceCharge: 0,
    serviceCharge: 0
  });

  const calculateServiceCharge = (
    baseServiceFee,
    units,
    shopStatus,
    activeDiscountValue,
    inActiveDiscountValue
  ) => {
    const baseFee = +baseServiceFee;
    const activeDiscount = +activeDiscountValue;
    const inActiveDiscount = +inActiveDiscountValue;

    if (shopStatus === ACTIVE) {
      const activeDiscountPercentage = (100 - activeDiscount) / 100;
      if (+units <= 1) return baseFee;
      const activeDiscountedBaseFee = baseFee * activeDiscountPercentage;
      const otherUnitsCharge = (units - 1) * activeDiscountedBaseFee;
      return baseFee + otherUnitsCharge;
    } else {
      const inActiveDiscountPercentage = (100 - inActiveDiscount) / 100;
      const inActiveDiscountedBaseFee = baseFee * inActiveDiscountPercentage;
      if (units <= 1) return inActiveDiscountedBaseFee;
      const otherUnitsCharge = (units - 1) * inActiveDiscountedBaseFee;
      return inActiveDiscountedBaseFee + otherUnitsCharge;
    }
  };

  const getShopDocument = useCallback(async (shopId) => {
    const documentRef = db.collection(BILLING_PROFILES_COLLECTION).doc(shopId);
    return documentRef.get().then((doc) => {
      return doc.data();
    });
  }, []);

  useEffect(() => {
    db.collection(SETTINGS_COLLECTION)
      .doc(SETTINGS_ID)
      .get()
      .then((doc) => {
        setSettings(doc.data());
      });
  }, []);

  useEffect(() => {
    if (action === EDIT) {
      getShopDocument(documentId).then((shopDocData) => {
        setState((prevState) => ({
          ...prevState,
          ...shopDocData
        }));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [action, documentId, getShopDocument]);

  useEffect(() => {
    const serviceCharge = calculateServiceCharge(
      settings.baseServiceCharge,
      state.shopUnits,
      state.shopStatus,
      settings.serviceChargeActiveDiscount,
      settings.serviceChargeInActiveDiscount
    );
    setState((prevState) => ({
      ...prevState,
      serviceCharge: serviceCharge ? serviceCharge : 0
    }));
  }, [
    settings.baseServiceCharge,
    state.shopUnits,
    state.shopStatus,
    settings.serviceChargeActiveDiscount,
    settings.serviceChargeInActiveDiscount
  ]);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const createDocument = async (payload) => {
    try {
      const newDocumentRef = db.collection(BILLING_PROFILES_COLLECTION).doc();
      const newDocumentData = payload;
      newDocumentData.id = newDocumentRef.id;
      await newDocumentRef.set(newDocumentData);
      enqueueSnackbar('Shop created successfully!', { variant: 'success' });
      history.goBack();
    } catch (error) {
      // TODO: Handle error properly
      enqueueSnackbar(error.message, { variant: 'error' });
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    const _customers = [];
    db.collection(CUSTOMERS_COLLECTION)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          _customers.push(doc.data());
        });
        if (_customers.length) {
          setCustomers(_customers);
        } else {
          enqueueSnackbar(
            'No customer found! Please create a customer first.',
            { variant: 'error' }
          );
          history.goBack();
        }
      });
  }, [enqueueSnackbar]);

  useEffect(() => {
    const customer = customers.filter((doc) => doc.id === state.customerId)[0];
    setState((prevState) => ({
      ...prevState,
      customer: customer
        ? `${customer.customerFirstName} ${customer.customerLastName}`
        : ''
    }));
  }, [state.customerId, customers]);

  const updateDocument = async (payload) => {
    try {
      const customoreRef = db
        .collection(BILLING_PROFILES_COLLECTION)
        .doc(documentId);
      const customerData = { ...payload };
      await customoreRef.set(customerData);
      enqueueSnackbar('Billing profile saved successfully!', {
        variant: 'success'
      });
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
    <Page title="Billing App | Manage Billing Profile">
      <ValidatorForm
        autoComplete="off"
        noValidate
        onSubmit={(e) => saveDocument(e)}
        className={classes.loginRoot}
      >
        <Card>
          <CardHeader title="Billing Profile" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.shopNumber}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Shop numnber is required']}
                  disabled={action === EDIT}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="shopNumber"
                  label="Shop Number"
                  name="shopNumber"
                  autoFocus
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <SelectValidator
                  fullWidth
                  disabled={action === EDIT}
                  validators={['required']}
                  errorMessages={['Shop units is required']}
                  margin="normal"
                  variant="outlined"
                  label="Shop Units"
                  value={state.shopUnits}
                  onChange={onInputChange}
                  id="shopUnits"
                  name="shopUnits"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(
                    (value) => (
                      <MenuItem key={value} value={value}>
                        {value} Unit
                      </MenuItem>
                    )
                  )}
                </SelectValidator>
              </Grid>

              <Grid item md={6} xs={12}>
                {customers.length && (
                  <SelectValidator
                    fullWidth
                    disabled={action === EDIT}
                    validators={['required']}
                    errorMessages={['Occupant is required']}
                    required
                    margin="normal"
                    variant="outlined"
                    label="Occupant"
                    value={state.customerId}
                    onChange={action !== EDIT ? onInputChange : () => {}}
                    id="customerId"
                    name="customerId"
                  >
                    {customers.map((customer) => {
                      return (
                        <MenuItem key={customer.id} value={customer.id}>
                          {customer.customerCompanyName}
                        </MenuItem>
                      );
                    })}
                  </SelectValidator>
                )}
              </Grid>

              <Grid item md={6} xs={12}>
                <SelectValidator
                  fullWidth
                  validators={['required']}
                  errorMessages={['Shop status is required']}
                  margin="normal"
                  variant="outlined"
                  label="Shop Status"
                  value={state.shopStatus}
                  onChange={onInputChange}
                  id="shopStatus"
                  name="shopStatus"
                >
                  <MenuItem value="Active">Functional</MenuItem>
                  <MenuItem value="In Active">Non Functional</MenuItem>
                </SelectValidator>
              </Grid>

              <Grid item md={12} xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Typography variant="caption">Service Charge</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                  <Typography variant="h5" component="h5">
                    NGN{currencyFormatter(state.serviceCharge)}
                  </Typography>
                </Box>
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

export default connect(mapStateToProps, null)(BillingProfileForm);
