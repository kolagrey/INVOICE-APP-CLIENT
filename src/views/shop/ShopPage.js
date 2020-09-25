import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SHOPS_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';
import {
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText
} from '../../materials';
import { updatePageTitle } from '../../redux/actions/shared/sharedActions';
import { db } from '../../services/firebase';
import Page from '../../shared/components/Page';

function CustomerPage({ updateTitle }) {
  const { id: documentId } = useParams();
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateTitle('Shop Profile');
  }, [updateTitle]);

  useEffect(() => {
    const documentRef = db.collection(SHOPS_COLLECTION).doc(documentId);
    documentRef.get().then((documentDoc) => {
      setState(documentDoc.data());
      setLoading(false);
    });
  }, [documentId]);

  return (
    <Page title="Invoice App | Shop Profile">
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Shop Number"
                    secondary={state.shopNumber}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Status" secondary={state.shopStatus} />
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
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
