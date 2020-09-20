import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Page from '../../shared/components/Page';
import ListView from '../../shared/components/list-view';

import sharedAction from '../../redux/actions/shared';
import AlertDialog from '../../shared/components/AlertDialog';
import BlankView from '../../shared/components/BlankView';
import { CircularProgress } from '../../materials';
import useData from '../../shared/hooks/useData';
import { SHOPS_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';
import { NoDataIcon } from '../../assets';
import { db } from '../../services/firebase';

const { updatePageTitle, updateAlertDialogState } = sharedAction;

const ShopsPage = ({ classes, updateTitle, showDialog, updateAlertState }) => {
  // Use Data Hook
  const [data, loading] = useData(SHOPS_COLLECTION, useState);
  const [documentId, setDocumentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filterDocument = (doc) => {
    const shopSearchText = doc.shopNumber.toLowerCase();
    const rentValueSearchText = doc.rentValue.toLowerCase();
    const noteSearchText = doc.note.toLowerCase();
    const availabilitySearchText = doc.availability.toLowerCase();
    return searchQuery.length === 0
      ? true
      : shopSearchText.includes(searchQuery.toLowerCase()) ||
          rentValueSearchText.includes(searchQuery.toLowerCase()) ||
          noteSearchText.includes(searchQuery.toLowerCase()) ||
          availabilitySearchText.includes(searchQuery.toLowerCase());
  };

  const deleteDocument = (documentId) => {
    updateAlertState(true);
    setDocumentId(documentId);
  };

  const confirmDeleteDocument = () => {
    const customerDocRef = db.collection(SHOPS_COLLECTION).doc(documentId);
    customerDocRef.delete().then(() => updateAlertState(false));
  };

  useEffect(() => {
    updateTitle('Shops');
  }, [updateTitle]);

  const listConfig = {
    title: 'Shops',
    searchPlaceholder: 'Search Shop',
    headCells: [
      {
        id: 'shopNumber',
        numeric: false,
        disablePadding: true,
        label: 'Shop Number'
      },
      {
        id: 'rentValue',
        numeric: false,
        disablePadding: true,
        label: 'Rent Value'
      },
      {
        id: 'note',
        numeric: false,
        disablePadding: false,
        label: 'Note'
      },
      {
        id: 'availability',
        numeric: false,
        disablePadding: false,
        label: 'Availability'
      }
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
    searchAction: setSearchQuery,
    editUrl: '/dashboard/shop/edit',
    viewUrl: '/dashboard/shop',
    addButtonText: 'Add Shop',
    addButtonUrl: '/dashboard/shop/new/document'
  };

  return (
    <Page title="Invoice App | Shops">
      <AlertDialog
        NoDataIcon={NoDataIcon}
        showDialog={showDialog}
        title={'Delete Shop?'}
        body={'Are you sure you wany to delete this shop?'}
        okAction={confirmDeleteDocument}
        okText={'Yes, Delete'}
        cancelText={'Discard'}
        updateAlertState={updateAlertState}
      />
      {data.length ? (
        <ListView
          updateAlertDialogState={updateAlertState}
          data={data.filter(filterDocument)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopsPage);
