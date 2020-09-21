import React, { useEffect, useState } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { INVOICES_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';

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

function InvoiceForm(props) {
  const { classes, user } = props;
  const { action, id: documentId } = useParams();
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    createdBy: user.id,
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    companyName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    telephone: '',
    invoiceNumber: '',
    invoiceData: new Date(),
    invoiceDueDate: new Date(),
    shopNumber: '',
    invoiceItem: '',
    invoiceDescription: '',
    unitCost: 0,
    totalCost: 0,
    vat: 0,
    grandTotal: 0,
    duration: 0,
    paymentAccount: '',
    note: ''
  });

  useEffect(() => {
    if (action === EDIT) {
      const documentDocRef = db.collection(INVOICES_COLLECTION).doc(documentId);
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
      const newDocumentRef = db.collection(INVOICES_COLLECTION).doc();
      const newDocumentData = payload;
      newDocumentData.id = newDocumentRef.id;
      await newDocumentRef.set(newDocumentData);
      history.goBack();
    } catch (error) {
      // TODO: Handle error properly
      console.log(error);
    }
  };

  const updateDocument = async (payload) => {
    try {
      const customoreRef = db.collection(INVOICES_COLLECTION).doc(documentId);
      const customerData = { ...payload };
      await customoreRef.set(customerData);
      history.goBack();
    } catch (error) {
      // TODO: Handle error properly
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
              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.invoiceNumber}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Invoice number is required']}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="invoiceNumber"
                  label="Invoice Number"
                  name="invoiceNumber"
                  autoFocus
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextValidator
                  value={state.invoiceDueDate}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Due date is required']}
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

export default connect(mapStateToProps, null)(InvoiceForm);
