import React, { useCallback, useEffect, useState } from 'react';
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
  SHOPS_COLLECTION
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

const ShopsForm = (props) => {
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
    serviceCharge: 0,
    availability: 'Not Available',
    note: ''
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
    const documentRef = db.collection(SHOPS_COLLECTION).doc(shopId);
    return documentRef.get().then((doc) => {
      return doc.data();
    });
  }, []);

  const getShopDocumentByShopNumber = useCallback(async (shopNumber) => {
    const documentRef = db
      .collection(SHOPS_COLLECTION)
      .where('shopNumber', '==', shopNumber);
    return documentRef.get().then((querySnapshot) => {
      const result = [];
      querySnapshot.forEach(function (doc) {
        result.push(doc.data());
      });
      return result.length ? result[0] : null;
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
      state.baseServiceCharge,
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
    state.baseServiceCharge,
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
      const shopDoc = await getShopDocumentByShopNumber(state.shopNumber);
      if (shopDoc) {
        enqueueSnackbar(`Shop with ${state.shopNumber} already exisit!`, {
          variant: 'error'
        });
      } else {
        const newDocumentRef = db.collection(SHOPS_COLLECTION).doc();
        const newDocumentData = payload;
        newDocumentData.id = newDocumentRef.id;
        await newDocumentRef.set(newDocumentData);
        enqueueSnackbar('Shop created successfully!', { variant: 'success' });
        history.goBack();
      }
    } catch (error) {
      // TODO: Handle error properly
      enqueueSnackbar(error.message, { variant: 'error' });
      console.log(error);
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
        setCustomers(_customers);
      });
  }, []);

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
      const customoreRef = db.collection(SHOPS_COLLECTION).doc(documentId);
      const customerData = { ...payload };
      await customoreRef.set(customerData);
      enqueueSnackbar('Shop saved successfully!', { variant: 'success' });
      history.goBack();
    } catch (error) {
      // TODO: Handle error properly
      enqueueSnackbar(error.message, { variant: 'error' });
      console.log(error);
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
      console.log(error);
    }
  };

  return (
    <Page title="Invoice App | Manage Shop">
      <ValidatorForm
        autoComplete="off"
        noValidate
        onSubmit={(e) => saveDocument(e)}
        className={classes.loginRoot}
      >
        <Card>
          <CardHeader title="Shop Profile" />
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
                  <MenuItem value={1}>1 Unit</MenuItem>
                  <MenuItem value={2}>2 Units</MenuItem>
                  <MenuItem value={3}>3 Units</MenuItem>
                  <MenuItem value={4}>4 Units</MenuItem>
                  <MenuItem value={5}>5 Units</MenuItem>
                  <MenuItem value={6}>6 Units</MenuItem>
                </SelectValidator>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.baseServiceCharge}
                  onChange={onInputChange}
                  validators={[
                    'required',
                    'minNumber:1000',
                    'maxNumber:1000000'
                  ]}
                  errorMessages={[
                    'Base service charge is required',
                    'Base service charge must be greater than One Thousand',
                    'Base service charge must be less than One Million'
                  ]}
                  type="tel"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="baseServiceCharge"
                  label="Base Service Charge"
                  name="baseServiceCharge"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <SelectValidator
                  fullWidth
                  validators={['required']}
                  errorMessages={['Occupant is required']}
                  required
                  margin="normal"
                  variant="outlined"
                  label="Occupant"
                  value={state.customerId}
                  onChange={onInputChange}
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
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="In Active">In Active</MenuItem>
                </SelectValidator>
              </Grid>

              <Grid item md={6} xs={12}>
                <SelectValidator
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  label="Availability"
                  value={state.availability}
                  onChange={onInputChange}
                  id="availability"
                  name="availability"
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Not Available">Not Available</MenuItem>
                </SelectValidator>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.note}
                  onChange={onInputChange}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="note"
                  label="Note"
                  name="note"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Typography variant="caption">Service Charge</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                  <Typography variant="h5" component="h5">
                    {state.serviceCharge}
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

export default connect(mapStateToProps, null)(ShopsForm);
