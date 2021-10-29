import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactExport from 'react-export-excel';

import { Button } from '../../materials';
import Page from '../../shared/components/Page';
import useData from '../../shared/hooks/useData';
import { CUSTOMERS_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';

import sharedAction from '../../redux/actions/shared';
const { updatePageTitle } = sharedAction;

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const CustomersDownload = ({ updateTitle, classes }) => {
  // Use Data Hook
  const [data] = useData(CUSTOMERS_COLLECTION, useState);

  useEffect(() => {
    updateTitle('Customers Data Download');
  }, [updateTitle]);

  return (
    <Page title="Billing App | Customers Data Download">
      <ExcelFile
        element={
          <Button
            className={classes.download}
            variant="contained"
          >
            Download Customer Data (Excel)
          </Button>
        }
      >
        <ExcelSheet data={data} name="Customers">
          <ExcelColumn label="Customer Fullname" value="customerFullName" />
          <ExcelColumn label="Customer Company" value="customerCompanyName" />
          <ExcelColumn label="Customer Email" value="customerEmail" />
          <ExcelColumn label="Customer Telephone" value="customerTelephone" />
          <ExcelColumn label="Customer Address" value="customerAddress" />
          <ExcelColumn label="Customer City" value="customerCity" />
          <ExcelColumn label="Customer State" value="customerState" />
          <ExcelColumn label="Customer Country" value="customerCountry" />
          <ExcelColumn label="Owner Firstname" value="ownerFirstName" />
          <ExcelColumn label="Owner Lastname" value="ownerLastName" />
          <ExcelColumn label="Owner Telephone" value="ownerTelephone" />
          <ExcelColumn label="Owner Email" value="ownerEmail" />
        </ExcelSheet>
      </ExcelFile>
    </Page>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateTitle: (payload) => {
      return dispatch(updatePageTitle(payload));
    }
  };
};

export default connect(null, mapDispatchToProps)(CustomersDownload);
