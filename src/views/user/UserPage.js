import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { USER_PROFILES_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';
import { Card, Grid, List, ListItem, ListItemText } from '../../materials';
import { updatePageTitle } from '../../redux/actions/shared/sharedActions';
import { db } from '../../services/firebase';
import Page from '../../shared/components/Page';

function UserPage({ updateTitle }) {
  const { id: documentId } = useParams();
  const [state, setState] = useState({});
  useEffect(() => {
    updateTitle('User');
  }, [updateTitle]);

  useEffect(() => {
    const documentRef = db.collection(USER_PROFILES_COLLECTION).doc(documentId);
    documentRef.get().then((documentDoc) => {
      setState(documentDoc.data());
    });
  }, [documentId]);

  return (
    <Page title="Invoice App | User">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <List>
              <ListItem>
                <ListItemText primary="Firstname" secondary={state.firstName} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Lastname" secondary={state.lastName} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={state.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Telephone" secondary={state.telephone} />
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <List>
              <ListItem>
                <ListItemText primary="Staff ID" secondary={state.staffId} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Role" secondary={state.role} />
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

export default connect(null, mapDispatchToProps)(UserPage);
