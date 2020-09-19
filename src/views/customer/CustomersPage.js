import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Page from '../../shared/components/Page';
import ListView from '../../shared/components/list-view';

import sharedAction from '../../redux/actions/shared';
import AlertDialog from '../../shared/components/AlertDialog';
import BlankView from '../../shared/components/BlankView';
import { CircularProgress } from '../../materials';
import useData from '../../shared/hooks/useData';
import { CUSTOMERS_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';
import { NoDataIcon } from '../../assets';
import { db } from '../../services/firebase';

const { updatePageTitle, updateAlertDialogState } = sharedAction;

const CustomersPage = ({
  classes,
  updateTitle,
  showDialog,
  updateAlertState
}) => {
  // Use Data Hook
  const [data, loading] = useData(CUSTOMERS_COLLECTION, useState);
  const [documentId, setDocumentId] = useState('');
  const deleteDocument = (documentId) => {
    updateAlertState(true);
    setDocumentId(documentId);
  };

  const confirmDeleteDocument = () => {
    const documentDocRef = db.collection(CUSTOMERS_COLLECTION).doc(documentId);
    documentDocRef.delete().then(() => updateAlertState(false));
  };

  useEffect(() => {
    updateTitle('Customers');
  }, [updateTitle]);

  const listConfig = {
    title: 'Customers',
    searchPlaceholder: 'Search Customer',
    headCells: [
      {
        id: 'avatar',
        numeric: false,
        disablePadding: true,
        label: 'Avatar'
      },
      {
        id: 'firstName',
        numeric: false,
        disablePadding: true,
        label: 'Firstname'
      },
      {
        id: 'lastName',
        numeric: false,
        disablePadding: true,
        label: 'Lastname'
      },
      {
        id: 'email',
        numeric: true,
        disablePadding: false,
        label: 'Email'
      },
      { id: 'telephone', numeric: false, disablePadding: false, label: 'Phone' }
    ],
    showSearchToolbar: true,
    showCheckbox: true,
    showAction: true,
    canEdit: true,
    canDelete: true,
    canCreate: true,
    showFilter: false,
    showAddButton: true,
    filterAction: () => {},
    deleteAction: deleteDocument,
    searchAction: () => {},
    editUrl: '/dashboard/customer/edit',
    viewUrl: '/dashboard/customer',
    addButtonText: 'Add Customer',
    addButtonUrl: '/dashboard/customer/new/document'
  };

  return (
    <Page title="Invoice App | Customers">
      <AlertDialog
        NoDataIcon={NoDataIcon}
        showDialog={showDialog}
        title={'Delete Customer?'}
        body={'Are you sure you wany to delete this customer?'}
        okAction={confirmDeleteDocument}
        okText={'Yes, Delete'}
        cancelText={'Discard'}
        updateAlertState={updateAlertState}
      />
      {data.length ? (
        <ListView
          updateAlertDialogState={updateAlertState}
          data={data}
          classes={classes}
          listConfig={listConfig}
        />
      ) : loading ? (
        <CircularProgress />
      ) : (
        <BlankView
          classes={classes}
          NoDataIcon={NoDataIcon}
          showAddButton={listConfig.showAddButton}
          addButtonText={listConfig.addButtonText}
          addButtonUrl={listConfig.addButtonUrl}
          title={listConfig.title}
        />
      )}
    </Page>
  );
};

const mapStateToProps = (state) => {
  return {
    showDialog: state.shared.dialogState
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTitle: (payload) => {
      return dispatch(updatePageTitle(payload));
    },
    updateAlertState: (payload) => dispatch(updateAlertDialogState(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomersPage);
