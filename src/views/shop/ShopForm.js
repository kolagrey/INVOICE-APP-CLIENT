import React, { useEffect, useState, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { SHOPS_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';

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

const CustomerForm = (props) => {
  const { classes, user } = props;
  const { action, id: documentId } = useParams();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useState({
    createdBy: user.id,
    shopNumber: '',
    shopStatus: ''
  });

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
    if (action === EDIT) {
      const documentDocRef = db.collection(SHOPS_COLLECTION).doc(documentId);
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
        enqueueSnackbar('Shop saved successfully!', { variant: 'success' });
        history.goBack();
      }
    } catch (error) {
      // TODO: Handle error properly
      enqueueSnackbar(error.message, { variant: 'error' });
      Sentry.captureException(error);
    }
  };

  const updateDocument = async (payload) => {
    try {
      const docRef = db.collection(SHOPS_COLLECTION).doc(documentId);
      const docData = { ...payload };
      await docRef.set(docData);
      enqueueSnackbar('Shop saved successfully!', { variant: 'success' });
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
    <Page title="Billing App | Manage Shop">
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
                  disabled={action === EDIT}
                  value={state.shopNumber}
                  onChange={onInputChange}
                  validators={['required']}
                  errorMessages={['Shop number is required']}
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
                  errorMessages={['Status is required']}
                  required
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
