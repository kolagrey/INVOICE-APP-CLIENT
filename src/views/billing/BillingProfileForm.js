import React, { useCallback, useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import {
  ValidatorForm,
  SelectValidator
} from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  CUSTOMERS_COLLECTION,
  SETTINGS_COLLECTION,
  BILLING_PROFILES_COLLECTION,
  SHOPS_COLLECTION
} from '../../firebase-helpers/constants/collectionsTypes';
import { useSnackbar } from 'notistack';

import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import { FormControl, InputLabel } from '@material-ui/core';

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
import { ACTIVE, EDIT, SETTINGS_ID, MAIN, EXTRA } from '../../shared/constants';
import { currencyFormatter, titleCase } from '../../shared/utils';
import { listSort } from '../../shared/utils/sortUtils';

const BillingProfileForm = (props) => {
  const { classes, user } = props;
  const { action, id: documentId } = useParams();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [customers, setCustomers] = useState([]);
  const [shops, setShops] = useState([]);

  const [state, setState] = useState({
    createdBy: user.id,
    customer: '',
    customerId: '',
    shopNumber: '',
    shopUnits: 1,
    shopList: [],
    invoiceItemsList: [],
    billingCycle: 1,
    nextBillingDate: '',
    shopStatus: 'Active',
    baseServiceCharge: 0,
    baseServiceFee: 0,
    serviceCharge: 0,
    activeDiscount: 0,
    inActiveDiscount: 0
  });

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const handleChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      shopList: event.target.value,
      shopUnits: event.target.value.length
    }));
  };

  const getInvoiceItems = useCallback(
    ({
      baseServiceFee,
      shopUnits,
      billingCycle,
      shopStatus,
      shopList,
      activeDiscount,
      inActiveDiscount
    }) => {
      const invoiceItems = [];
      if (!shopList || !shopList.length) return invoiceItems;
      const mainServiceCharge = calculateServiceCharge({
        shopPosition: MAIN,
        baseServiceFee,
        billingCycle,
        shopUnits,
        shopStatus,
        activeDiscount,
        inActiveDiscount
      });
      if (shopList.length === 1) {
        const subTotalCost = mainServiceCharge * 1;
        const totalAmount = subTotalCost * billingCycle;
        invoiceItems.push({
          shopNumber: shopList[0],
          invoiceItem: `Main shop`,
          invoiceDescription: `1 (${shopStatus})`,
          duration: 1,
          unitCost: mainServiceCharge,
          subTotalCost,
          totalAmount
        });
      } else {
        const extraServiceCharge = calculateServiceCharge({
          shopPosition: EXTRA,
          baseServiceFee,
          billingCycle,
          shopUnits,
          shopStatus,
          activeDiscount,
          inActiveDiscount
        });
        const firstSubTotalCost = mainServiceCharge * 1;
        const firstTotalAmount = firstSubTotalCost * billingCycle;
        const secondSubTotalCost = extraServiceCharge * (shopUnits - 1);
        const secondTotalAmount = secondSubTotalCost * billingCycle;
        invoiceItems.push(
          {
            shopNumber: shopList[0],
            invoiceItem: `Main shop`,
            invoiceDescription: `1 x ${shopStatus}`,
            duration: billingCycle,
            unitCost: mainServiceCharge,
            subTotalCost: firstSubTotalCost,
            totalAmount: firstTotalAmount
          },
          {
            shopNumber: shopList.slice(1).toString(),
            invoiceItem: `Extra shop(s)`,
            invoiceDescription: `${shopUnits - 1} x ${shopStatus}`,
            duration: billingCycle,
            unitCost: extraServiceCharge,
            subTotalCost: secondSubTotalCost,
            totalAmount: secondTotalAmount
          }
        );
      }
      return invoiceItems;
    },
    []
  );

  const calculateServiceCharge = ({
    shopPosition,
    baseServiceFee,
    shopStatus,
    activeDiscount,
    inActiveDiscount
  }) => {
    const baseFee = +baseServiceFee;
    const activeDiscountValue = +activeDiscount;
    const inActiveDiscountValue = +inActiveDiscount;

    if (shopStatus === ACTIVE) {
      const activeDiscountPercentage = (100 - activeDiscountValue) / 100;
      if (shopPosition === MAIN) {
        return baseFee;
      } else {
        return baseFee * activeDiscountPercentage;
      }
    } else {
      const inActiveDiscountPercentage = (100 - inActiveDiscountValue) / 100;
      return baseFee * inActiveDiscountPercentage;
    }
  };

  const getShopDocument = useCallback(async (shopId) => {
    const documentRef = db.collection(BILLING_PROFILES_COLLECTION).doc(shopId);
    return documentRef.get().then((doc) => {
      return doc.data();
    });
  }, []);

  useEffect(() => {
    const invoiceItemsList = getInvoiceItems({
      baseServiceFee: state.baseServiceFee,
      shopUnits: state.shopUnits,
      billingCycle: state.billingCycle,
      shopStatus: state.shopStatus,
      shopList: state.shopList,
      activeDiscount: state.activeDiscount,
      inActiveDiscount: state.inActiveDiscount
    });
    const serviceCharge = invoiceItemsList.reduce(
      (prev, curr) => prev + curr.totalAmount,
      0
    );

    setState((prevState) => {
      return {
        ...prevState,
        shopNumber: state.shopList.toString(),
        serviceCharge,
        invoiceItemsList
      };
    });
  }, [
    state.baseServiceFee,
    state.shopUnits,
    state.billingCycle,
    state.shopStatus,
    state.shopList,
    state.activeDiscount,
    state.inActiveDiscount,
    getInvoiceItems
  ]);

  useEffect(() => {
    db.collection(SETTINGS_COLLECTION)
      .doc(SETTINGS_ID)
      .get()
      .then((doc) => {
        const settings = doc.data();
        setState((prevState) => ({
          ...prevState,
          baseServiceCharge: settings.baseServiceCharge,
          baseServiceFee: settings.baseServiceCharge,
          activeDiscount: settings.serviceChargeActiveDiscount,
          inActiveDiscount: settings.serviceChargeInActiveDiscount
        }));
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

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const createDocument = async (payload) => {
    try {
      if (payload.shopList.length) {
        const newDocumentRef = db.collection(BILLING_PROFILES_COLLECTION).doc();
        const newDocumentData = payload;
        newDocumentData.id = newDocumentRef.id;
        await newDocumentRef.set(newDocumentData);
        enqueueSnackbar('Billing profile created successfully!', {
          variant: 'success'
        });
        history.goBack();
      } else {
        enqueueSnackbar('Please add shop list!', { variant: 'error' });
      }
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
          setCustomers(_customers.sort(listSort('customerCompanyName')));
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
    const _shops = [];
    db.collection(SHOPS_COLLECTION)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          _shops.push(doc.data());
        });
        if (_shops.length) {
          setShops(_shops.sort(listSort('shopNumber')));
        } else {
          enqueueSnackbar('No shop found! Please create a shop first.', {
            variant: 'error'
          });
          history.goBack();
        }
      });
  }, [enqueueSnackbar]);

  useEffect(() => {
    const customer = customers.filter((doc) => doc.id === state.customerId)[0];
    setState((prevState) => ({
      ...prevState,
      customer: customer ? titleCase(customer.customerFullName) : ''
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
              <Grid item xs={12}>
                {shops.length ? (
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel htmlFor="shopList">Shop List</InputLabel>
                    <Select
                      required
                      fullWidth
                      multiple
                      disabled={action === EDIT}
                      variant="outlined"
                      label="Shop(s)"
                      labelId="shopList"
                      id="shopList"
                      value={state.shopList}
                      onChange={handleChange}
                      input={<Input />}
                      renderValue={(selected) => (
                        <div className={classes.chips}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              className={classes.chip}
                            />
                          ))}
                        </div>
                      )}
                      MenuProps={MenuProps}
                      inputProps={{
                        name: 'shopList',
                        id: 'shopList'
                      }}
                    >
                      {shops.map((shop) => (
                        <MenuItem key={shop.id} value={shop.shopNumber}>
                          <Checkbox
                            checked={
                              state.shopList.indexOf(shop.shopNumber) > -1
                            }
                          />
                          <ListItemText primary={shop.shopNumber} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <CircularProgress />
                )}
              </Grid>

              <Grid item md={6} xs={12}>
                {customers.length ? (
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
                ) : (
                  <CircularProgress />
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
                  <MenuItem value="Functional">Functional</MenuItem>
                  <MenuItem value="Non Functional">Non Functional</MenuItem>
                </SelectValidator>
              </Grid>

              <Grid item md={6} xs={12}>
                <SelectValidator
                  fullWidth
                  validators={['required']}
                  errorMessages={['Billing cycle is required']}
                  margin="normal"
                  variant="outlined"
                  label="Billing Cycle"
                  value={state.billingCycle}
                  onChange={onInputChange}
                  id="billingCycle"
                  name="billingCycle"
                >
                  <MenuItem value={1}>Monthly (1 Month)</MenuItem>
                  <MenuItem value={3}>Quarterly (3 Months)</MenuItem>
                  <MenuItem value={6}>Bi-Annually (6 Months)</MenuItem>
                  <MenuItem value={12}>Annually (12 Months)</MenuItem>
                </SelectValidator>
              </Grid>
              <Grid item md={6} xs={12}>
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
