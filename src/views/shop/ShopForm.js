import React, { useEffect, useState } from 'react';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
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

function ShopsForm(props) {
  const { classes, user } = props;
  const { action, id: documentId } = useParams();
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    createdBy: user.id,
    shopNumber: '',
    rentValue: 0,
    availability: 'Not Available',
    note: ''
  });

  useEffect(() => {
    if (action === EDIT) {
      const customerDocRef = db.collection(SHOPS_COLLECTION).doc(documentId);
      customerDocRef.get().then((customerDoc) => {
        setState((prevState) => ({
          ...prevState,
          ...customerDoc.data()
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
      const newDocumentRef = db.collection(SHOPS_COLLECTION).doc();
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
      const customoreRef = db.collection(SHOPS_COLLECTION).doc(documentId);
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
                <TextValidator
                  value={state.rentValue}
                  onChange={onInputChange}
                  validators={[
                    'required',
                    'minNumber:100000',
                    'maxNumber:10000000',
                    'matchRegexp:^([1-8][0-9]{5}|9[0-8][0-9]{4}|99[0-8][0-9]{3}|999[0-8][0-9]{2}|9999[0-8][0-9]|99999[0-9]|[1-8][0-9]{6}|9[0-8][0-9]{5}|99[0-8][0-9]{4}|999[0-8][0-9]{3}|9999[0-8][0-9]{2}|99999[0-8][0-9]|999999[0-9]|10000000)$'
                  ]}
                  errorMessages={[
                    'Rent value is required',
                    'Rent value must be greater than Hundred Thousand',
                    'Rent value must be less than Ten Million',
                    'Rent value can only be a positive number'
                  ]}
                  type="tel"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="rentValue"
                  label="Rent Value"
                  name="rentValue"
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

export default connect(mapStateToProps, null)(ShopsForm);
