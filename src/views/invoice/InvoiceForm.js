import React, { useEffect, useState } from 'react';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import {
  IDS_TRACKER_COLLECTION,
  CUSTOMERS_COLLECTION,
  INVOICES_COLLECTION,
  SHOPS_COLLECTION,
  SETTINGS_COLLECTION
} from '../../firebase-helpers/constants/collectionsTypes';

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
import { InvoiceCustomer } from '../../models/User';
import { history } from '../../router';
import { db, fb } from '../../services/firebase';
import Page from '../../shared/components/Page';
import { EDIT, INVOICE_PREFIX } from '../../shared/constants';

const InvoiceForm = (props) => {
  const { classes, user } = props;
  const { action, id: documentId } = useParams();
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const [options, setOptions] = useState({
    customers: [],
    shops: [],
    nextInvoiceId: 0,
    unitCost: 0,
    totalCost: 0,
    settings: {}
  });

  const [state, setState] = useState({
    createdBy: user.id,

    customerId: '',
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    customerCompanyName: '',
    customerAddress: '',
    customerCity: '',
    customerState: '',
    customerCountry: '',
    customerTelephone: '',

    companyEmail: '',
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyCountry: '',
    companyTelephone: '',

    invoiceNumber: '',
    invoiceDate: '',
    invoiceDueDate: '',

    shopId: '',
    shopNumber: '',

    invoiceItem: '',
    invoiceDescription: '',

    unitCost: 0,
    totalCost: 0,
    vat: 0,
    vatValue: 0,
    grandTotal: 0,
    duration: 1,

    paymentAccount: '',
    note: ''
  });

  useEffect(() => {
    if (action === EDIT) {
      const documentDocRef = db.collection(INVOICES_COLLECTION).doc(documentId);
      documentDocRef.get().then((documentDoc) => {
        const documentData = documentDoc.data();
        setState((prevState) => ({
          ...prevState,
          ...documentData
        }));
      });
    }
  }, [action, documentId]);

  useEffect(() => {
    const _customers = [];
    db.collection(CUSTOMERS_COLLECTION)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          _customers.push(doc.data());
        });
        setOptions((prevState) => ({
          ...prevState,
          customers: _customers
        }));
      });
  }, []);

  useEffect(() => {
    const _shops = [];
    db.collection(SHOPS_COLLECTION)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          _shops.push(doc.data());
        });
        setOptions((prevState) => ({
          ...prevState,
          shops: _shops
        }));
      });
  }, []);

  useEffect(() => {
    db.collection(IDS_TRACKER_COLLECTION)
      .doc('invoice')
      .get()
      .then((doc) => {
        setOptions((prevState) => ({
          ...prevState,
          nextInvoiceId: doc.data().nextId
        }));
      });
  }, []);

  useEffect(() => {
    db.collection(SETTINGS_COLLECTION)
      .doc('WFwkJiAaJWrAQ4kbYrTv')
      .get()
      .then((doc) => {
        setOptions((prevState) => ({
          ...prevState,
          settings: doc.data()
        }));
        setState((prevState) => ({
          ...prevState,
          note: doc.data().invoiceNote
        }));
      });
  }, []);

  useEffect(() => {
    const _shops = [...options.shops];
    const _shop = _shops.filter((shop) => shop.id === state.shopId);
    if (_shop.length) {
      const { rentValue, shopNumber } = _shop[0];
      const totalCost = +rentValue * state.duration;
      const vat = +options.settings.vat;
      const vatValue = (vat / 100) * totalCost;
      setOptions((prevState) => ({
        ...prevState,
        shopNumber: shopNumber,
        unitCost: +rentValue,
        vat: vat,
        vatValue: vatValue,
        totalCost: totalCost,
        grandTotal: totalCost + vatValue
      }));
    }
  }, [state.duration, state.shopId, options.shops, options.settings.vat]);

  useEffect(() => {
    const _customer = options.customers.filter((doc) => {
      return doc.id === state.customerId;
    });
    if (_customer.length) {
      const invoiceCustomer = new InvoiceCustomer(_customer[0]);
      setState((prevState) => ({
        ...prevState,
        ...invoiceCustomer.credentials
      }));
    }
  }, [options.customers, state.customerId]);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const createDocument = async (payload) => {
    const finalPayload = {
      ...payload,
      companyAddress: options.settings.address,
      companyCity: options.settings.city,
      companyCountry: options.settings.country,
      companyEmail: options.settings.email || '',
      companyName: options.settings.companyName,
      companyState: options.settings.state,
      companyTelephone: options.settings.telephone || '',
      invoiceDate: new Date(),
      invoiceDueDate: new Date(state.invoiceDueDate),
      invoiceNumber: `${INVOICE_PREFIX}${options.nextInvoiceId}`,
      shopNumber: options.shopNumber,
      unitCost: options.unitCost,
      vat: options.settings.vat,
      vatValue: options.vatValue,
      totalCost: options.totalCost,
      grandTotal: options.grandTotal,
      created: fb.FieldValue.serverTimestamp()
    };

    try {
      const newDocumentRef = db.collection(INVOICES_COLLECTION).doc();
      const newDocumentData = finalPayload;
      newDocumentData.id = newDocumentRef.id;
      await newDocumentRef.set(newDocumentData);
      enqueueSnackbar('Invoice created successfully!', { variant: 'success' });
      history.goBack();
    } catch (error) {
      // TODO: Handle error properly
      enqueueSnackbar(error.message, { variant: 'error' });
      console.log(error);
    }
  };

  const updateDocument = async (payload) => {
    try {
      const finalPayload = {
        ...payload,
        unitCost: options.unitCost,
        vat: options.settings.vat,
        vatValue: options.vatValue,
        totalCost: options.totalCost,
        grandTotal: options.grandTotal,
        updated: fb.FieldValue.serverTimestamp()
      };
      const customoreRef = db.collection(INVOICES_COLLECTION).doc(documentId);
      const customerData = { ...finalPayload };
      await customoreRef.set(customerData);
      enqueueSnackbar('Invoice saved successfully!', { variant: 'success' });
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
      setLoading(false);
      enqueueSnackbar(error.message, { variant: 'error' });
      console.log(error);
    }
  };

  return (
    <Page title="Invoice App | Manage Invoice">
      <ValidatorForm
        autoComplete="off"
        noValidate
        onSubmit={(e) => saveDocument(e)}
        className={classes.loginRoot}
      >
        <Card>
          <CardHeader title="Billing Invoice" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              {action !== EDIT && (
                <React.Fragment>
                  <Grid item md={6} xs={12}>
                    <SelectValidator
                      fullWidth
                      validators={['required']}
                      errorMessages={['Customer is required']}
                      required
                      margin="normal"
                      variant="outlined"
                      label="Customer"
                      value={state.customerId}
                      onChange={onInputChange}
                      id="customerId"
                      name="customerId"
                    >
                      {options.customers.map((customer) => {
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
                      required
                      validators={['required']}
                      errorMessages={['Shop Number is required']}
                      margin="normal"
                      variant="outlined"
                      label="Shop Number"
                      value={state.shopId}
                      onChange={onInputChange}
                      id="shopId"
                      name="shopId"
                    >
                      {options.shops.map((shop) => {
                        return (
                          <MenuItem key={shop.id} value={shop.id}>
                            {shop.shopNumber}
                          </MenuItem>
                        );
                      })}
                    </SelectValidator>
                  </Grid>
                </React.Fragment>
              )}
              <Grid item md={6} xs={12}>
                <TextValidator
                  fullWidth
                  type="number"
                  label="Duration (Years)"
                  name="duration"
                  margin="normal"
                  value={state.duration}
                  validators={['required', 'minNumber:1', 'maxNumber:5']}
                  errorMessages={[
                    'Duration is required',
                    'Minimum duration is 1year',
                    'Maximum duration is 5years'
                  ]}
                  onChange={onInputChange}
                  variant="outlined"
                  id="duration"
                />
              </Grid>

              {action !== EDIT && (
                <Grid item md={6} xs={12}>
                  <TextValidator
                    value={state.invoiceDueDate}
                    onChange={onInputChange}
                    validators={['required']}
                    errorMessages={['Due date is required']}
                    InputLabelProps={{
                      shrink: true
                    }}
                    type="date"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="invoiceDueDate"
                    label="Due Date"
                    name="invoiceDueDate"
                  />
                </Grid>
              )}
              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.invoiceItem}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Invoice item title is required']}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="invoiceItem"
                  label="Invoice Item"
                  name="invoiceItem"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextValidator
                  required
                  value={state.invoiceDescription}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Invoice item description is required']}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="invoiceDescription"
                  label="Invoice Description"
                  name="invoiceDescription"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.paymentAccount}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Payment account is required']}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="paymentAccount"
                  label="Payment Account"
                  name="paymentAccount"
                />
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
            </Grid>
          </CardContent>
          <Divider />

          <Box display="flex" justifyContent="flex-end" p={2}>
            <Typography variant="h5" component="h5">
              NGN{options.totalCost}.00
            </Typography>
          </Box>
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

export default connect(mapStateToProps, null)(InvoiceForm);
