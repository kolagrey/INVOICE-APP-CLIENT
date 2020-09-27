import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Page from '../../shared/components/Page';
import ListView from '../../shared/components/list-view';

import sharedAction from '../../redux/actions/shared';
import AlertDialog from '../../shared/components/AlertDialog';
import BlankView from '../../shared/components/BlankView';
import { CircularProgress } from '../../materials';
import useData from '../../shared/hooks/useData';
import { BILLING_PROFILES_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';
import { NoDataIcon } from '../../assets';
import { db } from '../../services/firebase';
import { useSnackbar } from 'notistack';
import { ADMIN_ROLE, MANAGER_ROLE } from '../../shared/constants';
import { currencyFormatter } from '../../shared/utils';

const { updatePageTitle, updateAlertDialogState } = sharedAction;

const BillingProfilesPage = ({
  classes,
  updateTitle,
  showDialog,
  updateAlertState,
  user
}) => {
  // Use Data Hook
  const [data, loading] = useData(BILLING_PROFILES_COLLECTION, useState);
  const [documentId, setDocumentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const filterDocument = (doc) => {
    const shopSearchText = doc.shopNumber.toLowerCase();
    return searchQuery.length === 0
      ? true
      : shopSearchText.includes(searchQuery.toLowerCase());
  };

  const mapDocument = (doc) => {
    // doc.serviceCharge = currencyFormatter(doc.serviceCharge);
    const formattedServiceCharge = currencyFormatter(doc.serviceCharge);
    doc.formattedServiceCharge = `NGN${formattedServiceCharge}`;
    return doc;
  };

  const formattedData = data.map(mapDocument);

  const deleteDocument = (documentId) => {
    updateAlertState(true);
    setDocumentId(documentId);
  };

  const confirmDeleteDocument = () => {
    const customerDocRef = db
      .collection(BILLING_PROFILES_COLLECTION)
      .doc(documentId);
    customerDocRef.delete().then(() => {
      updateAlertState(false);
      enqueueSnackbar('Shop deleted successfully!', { variant: 'success' });
    });
  };

  useEffect(() => {
    updateTitle('Billing Profiles');
  }, [updateTitle]);

  const listConfig = {
    title: 'Billing Profiles',
    searchPlaceholder: 'Search Billing Profile',
    headCells: [
      {
        id: 'shopNumber',
        numeric: false,
        disablePadding: true,
        label: 'Shop Number'
      },
      {
        id: 'formattedServiceCharge',
        numeric: false,
        disablePadding: true,
        label: 'Service Charge'
      },
      {
        id: 'shopUnits',
        numeric: false,
        disablePadding: false,
        label: 'Shop Units'
      },
      {
        id: 'shopStatus',
        numeric: false,
        disablePadding: false,
        label: 'Shop Status'
      }
    ],
    showSearchToolbar: true,
    showCheckbox: true,
    showAction: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    canView: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    canEdit: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    canDelete: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    canCreate: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    showFilter: false,
    showAddButton: true,
    filterAction: () => {},
    deleteAction: deleteDocument,
    searchAction: setSearchQuery,
    editUrl: '/dashboard/billing/edit',
    viewUrl: '/dashboard/billing',
    addButtonText: 'Add Billing Profile',
    addButtonUrl: '/dashboard/billing/new/document'
  };

  return (
    <Page title="Billing App | Billing Profiles">
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
          data={formattedData.filter(filterDocument)}
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
    showDialog: state.shared.dialogState,
    user: state.profile.user
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BillingProfilesPage);
