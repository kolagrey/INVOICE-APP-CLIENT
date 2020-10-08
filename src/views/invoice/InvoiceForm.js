import React, { useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';
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
  SETTINGS_COLLECTION,
  BILLING_PROFILES_COLLECTION
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
import {
  EDIT,
  INVOICE_PREFIX,
  SETTINGS_ID,
  STATUS_PENDING
} from '../../shared/constants';
import { currencyFormatter } from '../../shared/utils';
import { listSort } from '../../shared/utils/sortUtils';

const InvoiceForm = (props) => {
  const { classes, user } = props;
  const { action, id: documentId } = useParams();
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const [options, setOptions] = useState({
    customer: {},
    shopNumber: '',
    billingProfiles: [],
    nextInvoiceId: 0,
    subTotalCost: 0,
    settings: {}
  });

  const [state, setState] = useState({
    createdBy: user.id,

    customerId: '',
    customerFullName: '',
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

    billingProfileId: '',
    shopNumber: '',

    invoiceItemsList: [],

    subTotalCost: 0,
    vat: 0,
    vatValue: 0,
    grandTotal: 0,

    paymentAccount: '',
    note: ''
  });

  const getCustomerInformation = useMemo(
    () => (customerId) => {
      const documentDocRef = db
        .collection(CUSTOMERS_COLLECTION)
        .doc(customerId);
      documentDocRef.get().then((documentDoc) => {
        const documentData = documentDoc.data();
        setOptions((prevState) => ({
          ...prevState,
          customer: new InvoiceCustomer(documentData)
        }));
      });
    },
    []
  );

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
    const billingProfiles = [];
    db.collection(BILLING_PROFILES_COLLECTION)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          billingProfiles.push(doc.data());
        });
        if (billingProfiles.length) {
          setOptions((prevState) => ({
            ...prevState,
            billingProfiles: billingProfiles
          }));
        } else {
          enqueueSnackbar(
            'No billing profile found! Please create billing profile first.',
            { variant: 'error' }
          );
          history.goBack();
        }
      });
  }, [enqueueSnackbar]);

  useEffect(() => {
    db.collection(IDS_TRACKER_COLLECTION)
      .doc('invoice')
      .get()
      .then((doc) => {
        setOptions((prevState) => ({
          ...prevState,
          nextInvoiceId: doc.data().nextId + 1
        }));
        doc.ref.update({ nextId: doc.data().nextId + 1 });
      });
  }, []);

  useEffect(() => {
    db.collection(SETTINGS_COLLECTION)
      .doc(SETTINGS_ID)
      .get()
      .then((doc) => {
        const docData = doc.data();
        setOptions((prevState) => ({
          ...prevState,
          settings: docData
        }));
        setState((prevState) => ({
          ...prevState,
          bankName: docData.bankName,
          bankAccountName: docData.bankAccountName,
          bankAccountNumber: docData.bankAccountNumber,
          note: docData.invoiceNote
        }));
      });
  }, []);

  useEffect(() => {
    const _billingProfiles = [...options.billingProfiles];
    const _billingProfile = _billingProfiles.filter(
      (billingProfile) => billingProfile.id === state.billingProfileId
    );
    if (_billingProfile.length) {
      const {
        serviceCharge,
        customerId,
        invoiceItemsList,
        billingCycle,
        shopNumber
      } = _billingProfile[0];
      const totalCost = +serviceCharge;
      const vat = +options.settings.vat;
      const vatValue = (vat / 100) * totalCost;
      setOptions((prevState) => ({
        ...prevState,
        billingCycle: billingCycle,
        shopNumber: shopNumber,
        invoiceItemsList: invoiceItemsList && invoiceItemsList.length ? invoiceItemsList : [],
        vat: vat,
        vatValue: vatValue,
        subTotalCost: totalCost,
        grandTotal: totalCost + vatValue
      }));
      setState((prevState) => ({
        ...prevState,
        customerId
      }));
      getCustomerInformation(customerId);
    }
  }, [
    state.billingProfileId,
    options.billingProfiles,
    options.settings.vat,
    getCustomerInformation
  ]);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const createDocument = async (payload) => {
    if(!options.invoiceItemsList && !options.invoiceItemsList.length) {
      enqueueSnackbar(
            'The billing profile for this invoice is deprecated! Please re-create billing profile.',
            { variant: 'error' }
          );
    } else {

    const finalPayload = {
      ...payload,

      customerFullName: options.customer.customerFullName,
      customerEmail: options.customer.customerEmail,
      customerCompanyName: options.customer.customerCompanyName,
      customerAddress: options.customer.customerAddress,
      customerCity: options.customer.customerCity,
      customerState: options.customer.customerState,
      customerCountry: options.customer.customerCountry,
      customerTelephone: options.customer.customerTelephone,

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
      duration:
        options.billingCycle > 1
          ? `${options.billingCycle} months`
          : `${options.billingCycle} month`,
      invoiceItemsList: options.invoiceItemsList,

      vat: options.settings.vat,
      vatValue: options.vatValue,
      totalCost: options.subTotalCost,
      grandTotal: options.grandTotal,
      status: STATUS_PENDING,
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
      Sentry.captureException(error);
    }
    }
  };

  const updateDocument = async (payload) => {
    try {
      const finalPayload = {
        ...payload,
        duration:
          options.billingCycle > 1
            ? `${options.billingCycle} months`
            : `${options.billingCycle} month`,
        billingCycle: options.billingCycle,
        invoiceItemsList: options.invoiceItemsList,
        vat: options.settings.vat,
        vatValue: options.vatValue,
        totalCost: options.subTotalCost,
        grandTotal: options.grandTotal,
        status: STATUS_PENDING,
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
    <Page title="Billing App | Manage Invoice">
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
                      required
                      validators={['required']}
                      errorMessages={['Billing profile is required']}
                      margin="normal"
                      variant="outlined"
                      label="Billing Profile"
                      value={state.billingProfileId}
                      onChange={onInputChange}
                      id="billingProfileId"
                      name="billingProfileId"
                    >
                      {options.billingProfiles
                        .sort(listSort('shopNumber'))
                        .map((billingProfile) => {
                          return (
                            <MenuItem
                              key={billingProfile.id}
                              value={billingProfile.id}
                            >
                              {billingProfile.shopNumber}
                            </MenuItem>
                          );
                        })}
                    </SelectValidator>
                  </Grid>
                </React.Fragment>
              )}

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
              NGN{currencyFormatter(options.subTotalCost)}
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
