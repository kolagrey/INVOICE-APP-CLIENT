import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { BILLING_PROFILES_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';
import { Card, Grid, List, ListItem, ListItemText } from '../../materials';
import { updatePageTitle } from '../../redux/actions/shared/sharedActions';
import { db } from '../../services/firebase';
import Page from '../../shared/components/Page';

function ShopPage({ updateTitle }) {
  const { id: documentId } = useParams();
  const [state, setState] = useState({});
  useEffect(() => {
    updateTitle('Billing Profile');
  }, [updateTitle]);

  useEffect(() => {
    const documentRef = db
      .collection(BILLING_PROFILES_COLLECTION)
      .doc(documentId);
    documentRef.get().then((documentDoc) => {
      setState(documentDoc.data());
    });
  }, [documentId]);

  return (
    <Page title="Invoice App | Billing Profile">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <List>
              <ListItem>
                <ListItemText
                  primary="Shop Number"
                  secondary={state.shopNumber}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Service Charge"
                  secondary={state.serviceCharge}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Shop Units"
                  secondary={state.shopUnits}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <List>
              <ListItem>
                <ListItemText primary="Occupant" secondary={state.customer} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Shop Status"
                  secondary={state.shopStatus}
                />
              </ListItem>
            </List>
          </Card>
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

export default connect(null, mapDispatchToProps)(ShopPage);