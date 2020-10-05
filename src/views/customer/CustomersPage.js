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
import { useSnackbar } from 'notistack';
import { ADMIN_ROLE, MANAGER_ROLE } from '../../shared/constants';
import { listSort } from '../../shared/utils/sortUtils';

const { updatePageTitle, updateAlertDialogState } = sharedAction;

const CustomersPage = ({
  classes,
  updateTitle,
  showDialog,
  updateAlertState,
  user
}) => {
  // Use Data Hook
  const [data, loading] = useData(CUSTOMERS_COLLECTION, useState);
  const [documentId, setDocumentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const formattedData = data.sort(listSort('customerFullName'));

  const filterDocument = (doc) => {
    const nameSearchText = doc.customerFullName
      ? doc.customerFullName.toLowerCase()
      : '';
    const addressSearchText = doc.customerAddress.toLowerCase();
    const companyNameSearchText = doc.customerCompanyName.toLowerCase();
    const emailSearchText = doc.customerEmail.toLowerCase();
    const telephoneSearchText = doc.customerTelephone.toLowerCase();
    return searchQuery.length === 0
      ? true
      : emailSearchText.includes(searchQuery.toLowerCase()) ||
          telephoneSearchText.includes(searchQuery.toLowerCase()) ||
          nameSearchText.includes(searchQuery.toLowerCase()) ||
          addressSearchText.includes(searchQuery.toLowerCase()) ||
          companyNameSearchText.includes(searchQuery.toLowerCase());
  };

  const deleteDocument = (documentId) => {
    updateAlertState(true);
    setDocumentId(documentId);
  };

  const confirmDeleteDocument = () => {
    const documentDocRef = db.collection(CUSTOMERS_COLLECTION).doc(documentId);
    documentDocRef.delete().then(() => {
      updateAlertState(false);
      enqueueSnackbar('Customer deleted successfully!', { variant: 'success' });
    });
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
        disablePadding: false,
        label: 'Avatar'
      },
      {
        id: 'customerFullName',
        numeric: false,
        disablePadding: false,
        label: 'Customer'
      },
      {
        id: 'customerEmail',
        numeric: true,
        disablePadding: false,
        label: 'Email'
      },
      {
        id: 'customerTelephone',
        numeric: false,
        disablePadding: false,
        label: 'Phone'
      },
      {
        id: 'customerCity',
        numeric: false,
        disablePadding: false,
        label: 'Location'
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
    showAddButton: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    filterAction: () => {},
    deleteAction: deleteDocument,
    searchAction: setSearchQuery,
    editUrl: '/dashboard/customer/edit',
    viewUrl: '/dashboard/customer',
    addButtonText: 'Add Customer',
    addButtonUrl: '/dashboard/customer/new/document'
  };

  return (
    <Page title="Billing App | Customers">
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomersPage);
