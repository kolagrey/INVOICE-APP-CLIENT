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

function CustomerPage({ classes, updateTitle }) {
  const { id: documentId } = useParams();
  const [state, setState] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateTitle('Customer');
  }, [updateTitle]);

  useEffect(() => {
    const documentRef = db.collection(CUSTOMERS_COLLECTION).doc(documentId);
    documentRef.get().then((documentDoc) => {
      setState(documentDoc.data());
      setLoading(false);
    });
  }, [documentId]);

  useEffect(() => {
    const documentRef = db
      .collection(INVOICES_COLLECTION)
      .where('customerId', '==', documentId);
    documentRef.get().then((querySnapshot) => {
      const dataList = querySnapshot.docs.map((doc) => doc.data());
      setInvoices(dataList);
    });
  }, [documentId]);

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
        <Grid item xs={12} md={4} lg={4}>
          <Card>
            <List>
              <ListItem>
                <ListItemText
                  primary="Company"
                  secondary={state.customerCompanyName}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={state.customerEmail} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Telephone"
                  secondary={state.customerTelephone}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Shop Count" secondary="0" />
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Card>
            {' '}
            <List>
              <ListItem>
                <ListItemText
                  primary="Address"
                  secondary={state.customerAddress}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="City" secondary={state.customerCity} />
              </ListItem>
              <ListItem>
                <ListItemText primary="State" secondary={state.customerState} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Country"
                  secondary={state.customerCountry}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Card>
            {' '}
            <List>
              <ListItem>
                <ListItemText
                  primary="Owner Firstname"
                  secondary={state.customerFirstName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Owner Lastname"
                  secondary={state.customerLastName}
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
          ) : invoices.length ? (
            <ListView
              data={invoices}
              classes={classes}
              listConfig={listConfig}
            />
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
