import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import * as Sentry from '@sentry/react';

import {
  Button,
  Box,
  Divider,
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent
} from '../../../materials';

const SettingsDetails = (props) => {
  const { classes, data, errorMessage, updateSettings } = props;
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState({
    id: data.id,
    companyName: data.companyName,
    vat: data.vat,
    telephone: data.telephone ? data.telephone : '',
    email: data.email ? data.email : '',
    address: data.address,
    city: data.city,
    state: data.state,
    country: data.country,
    bankName: data.bankName ? data.bankName : '',
    bankAccountName: data.bankAccountName ? data.bankAccountName : '',
    bankAccountNumber: data.bankAccountNumber ? data.bankAccountNumber : '',
    serviceChargeActiveDiscount: data.serviceChargeActiveDiscount
      ? data.serviceChargeActiveDiscount
      : 0,
    serviceChargeInActiveDiscount: data.serviceChargeInActiveDiscount
      ? data.serviceChargeInActiveDiscount
      : 0,
    receiptNote: data.receiptNote ? data.receiptNote : '',
    invoiceNote: data.invoiceNote ? data.invoiceNote : '',
    baseServiceCharge: data.baseServiceCharge ? data.baseServiceCharge : 0
  });

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setRecord((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSettings(record);
      setLoading(false);
    } catch (error) {
      // TODO: Use error logging strategy
      setLoading(false);
      Sentry.captureException(error);
    }
  };
  return (
    <ValidatorForm
      autoComplete="off"
      noValidate
      onSubmit={(e) => saveSettings(e)}
      className={classes.loginRoot}
    >
      <Card>
        <CardHeader title="Settings" />
        <Divider />
        <CardContent>
          {errorMessage && (
            <Typography color="textSecondary" variant="body1">
              {errorMessage}
            </Typography>
          )}
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.companyName}
                onChange={onInputChange}
                validators={['required']}
                errorMessages={['companyName is required']}
                type="text"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="companyName"
                label="Company Name"
                name="companyName"
                autoFocus
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.address}
                onChange={onInputChange}
                validators={['required']}
                errorMessages={['address is required']}
                type="text"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                fullWidth
                label="Email Address"
                name="email"
                margin="normal"
                value={record.email}
                validators={['required']}
                errorMessages={['Email is required']}
                onChange={onInputChange}
                variant="outlined"
                id="email"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.telephone}
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
                required
                onChange={onInputChange}
                validators={['required']}
                errorMessages={['city is required']}
                fullWidth
                type="text"
                label="City"
                name="city"
                margin="normal"
                value={record.city}
                variant="outlined"
                id="city"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.state}
                onChange={onInputChange}
                validators={['required']}
                errorMessages={['state is required']}
                type="text"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="state"
                label="State"
                name="state"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.country}
                onChange={onInputChange}
                validators={['required']}
                errorMessages={['country is required']}
                type="text"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="country"
                label="Country"
                name="country"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.bankName}
                onChange={onInputChange}
                validators={['required']}
                errorMessages={['Bank name details is required']}
                type="text"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="bankName"
                label="Bank Name"
                name="bankName"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.bankAccountName}
                onChange={onInputChange}
                validators={['required']}
                errorMessages={['Bank account name details is required']}
                type="text"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="bankAccountName"
                label="Bank Account Name"
                name="bankAccountName"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.bankAccountNumber}
                onChange={onInputChange}
                validators={['required']}
                errorMessages={['Bank account number details is required']}
                type="number"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="bankAccountNumber"
                label="Bank Account Number"
                name="bankAccountNumber"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.invoiceNote}
                onChange={onInputChange}
                type="text"
                variant="outlined"
                margin="normal"
                fullWidth
                id="invoiceNote"
                label="Invoice Note"
                name="invoiceNote"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.receiptNote}
                onChange={onInputChange}
                type="text"
                variant="outlined"
                margin="normal"
                fullWidth
                id="receiptNote"
                label="Receipt Note"
                name="receiptNote"
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.baseServiceCharge}
                onChange={onInputChange}
                validators={['required', 'minNumber:1000', 'maxNumber:1000000']}
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
              <TextValidator
                value={record.vat}
                onChange={onInputChange}
                type="number"
                variant="outlined"
                margin="normal"
                validators={['required']}
                errorMessages={['VAT is required']}
                required
                fullWidth
                id="vat"
                label="V.A.T (%)"
                name="vat"
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.serviceChargeActiveDiscount}
                onChange={onInputChange}
                type="number"
                variant="outlined"
                margin="normal"
                validators={['required']}
                errorMessages={['Active discount is required']}
                required
                fullWidth
                id="serviceChargeActiveDiscount"
                label="Functional Discount (%)"
                name="serviceChargeActiveDiscount"
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextValidator
                value={record.serviceChargeInActiveDiscount}
                onChange={onInputChange}
                type="number"
                variant="outlined"
                margin="normal"
                validators={['required']}
                errorMessages={['In Active discount is required']}
                required
                fullWidth
                id="serviceChargeInActiveDiscount"
                label="Non-Function Discount (%)"
                name="serviceChargeInActiveDiscount"
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
  );
};

SettingsDetails.propTypes = {
  classes: PropTypes.object,
  errorMessage: PropTypes.string,
  data: PropTypes.object,
  updateSettings: PropTypes.func
};

export default SettingsDetails;
