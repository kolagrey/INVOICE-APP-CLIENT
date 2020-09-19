import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NoDataIcon } from '../../assets';
import {
  CUSTOMERS_COLLECTION,
  INVOICES_COLLECTION
} from '../../firebase-helpers/constants/collectionsTypes';
import {
  Card,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText
} from '../../materials';
import { updatePageTitle } from '../../redux/actions/shared/sharedActions';
import { db } from '../../services/firebase';
import BlankView from '../../shared/components/BlankView';
import ListView from '../../shared/components/list-view';
import Page from '../../shared/components/Page';
import useData from '../../shared/hooks/useData';

function CustomerPage({ classes, updateTitle }) {
  const { id: customerId } = useParams();
  const [state, setState] = useState({});
  useEffect(() => {
    updateTitle('Customer');
  }, [updateTitle]);

  useEffect(() => {
    const customerDocRef = db.collection(CUSTOMERS_COLLECTION).doc(customerId);
    customerDocRef.get().then((customerDoc) => {
      setState(customerDoc.data());
    });
  }, [customerId]);

  // Use Data Hook
  const [data, loading] = useData(INVOICES_COLLECTION, useState);

  const listConfig = {
    title: 'Invoices',
    headCells: [
      {
        id: 'invoiceNumber',
        numeric: false,
        disablePadding: false,
        label: 'Invoice Number'
      },
      {
        id: 'totalCost',
        numeric: true,
        disablePadding: false,
        label: 'Total Cost'
      },
      {
        id: 'vat',
        numeric: true,
        disablePadding: false,
        label: 'VAT'
      },
      {
        id: 'grandTotal',
        numeric: true,
        disablePadding: false,
        label: 'Grand Total'
      }
    ],
    disablePadding: false,
    showSearchToolbar: false,
    showCheckbox: false,
    showAction: false
  };

  return (
    <Page title="Invoice App | Customer">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <List>
              <ListItem>
                <ListItemText primary="Company" secondary={state.companyName} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={state.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Telephone" secondary={state.telephone} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Shop Count" secondary="2" />
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            {' '}
            <List>
              <ListItem>
                <ListItemText
                  primary="Owner Firstname"
                  secondary={state.firstName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Owner Lastname"
                  secondary={state.lastName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Operator"
                  secondary={state.operatorName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Operator Number"
                  secondary={state.operatorTelephone}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          {loading ? (
            <LinearProgress />
          ) : data.length ? (
            <ListView data={data} classes={classes} listConfig={listConfig} />
          ) : (
            <BlankView
              NoDataIcon={NoDataIcon}
              title="Invoice"
              showAddButton={false}
              classes={classes}
            />
          )}
        </Grid>
      </Grid>
    </Page>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateTitle: (payload) => {
      return dispatch(updatePageTitle(payload));
    }
  };
};

export default connect(null, mapDispatchToProps)(CustomerPage);
