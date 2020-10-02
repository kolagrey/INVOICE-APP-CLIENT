import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Page from '../../shared/components/Page';
import ListView from '../../shared/components/list-view';

import sharedAction from '../../redux/actions/shared';
import AlertDialog from '../../shared/components/AlertDialog';
import BlankView from '../../shared/components/BlankView';
import { CircularProgress } from '../../materials';
import useData from '../../shared/hooks/useData';
import { RECEIPTS_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';
import { NoDataIcon } from '../../assets';
import { db } from '../../services/firebase';
import { useSnackbar } from 'notistack';
import { ADMIN_ROLE, MANAGER_ROLE } from '../../shared/constants';
import { currencyFormatter } from '../../shared/utils';

const { updatePageTitle, updateAlertDialogState } = sharedAction;

const ReceiptsPage = ({
  user,
  classes,
  updateTitle,
  showDialog,
  updateAlertState
}) => {
  // Use Data Hook
  const [data, loading] = useData(RECEIPTS_COLLECTION, useState);
  const [documentId, setDocumentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const filterDocument = (doc) => {
    const nameSearchText = doc.customerFullName
      ? doc.customerFullName.toLowerCase()
      : doc.customerCompanyName.toLowerCase();
    const invoiceNumberSearchText = doc.invoiceNumber + '';
    const receiptNumberSearchText = doc.receiptNumber + '';
    const shopNumberSearchText = doc.shopNumber.toLowerCase();
    return searchQuery.length === 0
      ? true
      : invoiceNumberSearchText.includes(searchQuery.toLowerCase()) ||
          receiptNumberSearchText.includes(searchQuery.toLowerCase()) ||
          nameSearchText.includes(searchQuery.toLowerCase()) ||
          shopNumberSearchText.includes(searchQuery.toLowerCase());
  };

  const mapDocument = (doc) => {
    const formattedTotalCost = currencyFormatter(doc.totalCost);
    const formattedUnitCost = currencyFormatter(doc.unitCost);
    doc.formattedTotalCost = `NGN${formattedTotalCost}`;
    doc.formattedUnitCost = `NGN${formattedUnitCost}`;
    return doc;
  };

  const formattedData = data.map(mapDocument);

  const deleteDocument = (documentId) => {
    updateAlertState(true);
    setDocumentId(documentId);
  };

  const confirmDeleteDocument = () => {
    const documentDocRef = db.collection(RECEIPTS_COLLECTION).doc(documentId);
    documentDocRef.delete().then(() => {
      updateAlertState(false);
      enqueueSnackbar('Receipt deleted successfully!', { variant: 'success' });
    });
  };

  useEffect(() => {
    updateTitle('Receipts');
  }, [updateTitle]);

  const listConfig = {
    title: 'Receipts',
    searchPlaceholder: 'Search Receipts',
    headCells: [
      {
        id: 'receiptNumber',
        numeric: false,
        disablePadding: true,
        label: 'Receipt No.'
      },
      {
        id: 'invoiceNumber',
        numeric: false,
        disablePadding: true,
        label: 'Invoice No.'
      },
      {
        id: 'customerFullName',
        numeric: false,
        disablePadding: true,
        label: 'Customer'
      },
      {
        id: 'shopNumber',
        numeric: false,
        disablePadding: false,
        label: 'Shop(s)'
      },
      {
        id: 'duration',
        numeric: false,
        disablePadding: false,
        label: 'Duration'
      },
      {
        id: 'formattedTotalCost',
        numeric: false,
        disablePadding: false,
        label: 'Total'
      }
    ],
    showSearchToolbar: true,
    showCheckbox: false,
    showAction: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    canView: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    canEdit: false,
    canDelete: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    canCreate: false,
    showFilter: false,
    showAddButton: false,
    filterAction: () => {},
    deleteAction: deleteDocument,
    searchAction: setSearchQuery,
    editUrl: '/dashboard/receipt/edit',
    viewUrl: '/dashboard/receipt',
    addButtonText: 'Add Receipt',
    addButtonUrl: '/dashboard/receipt/new/document'
  };

  return (
    <Page title="Billing App | Receipts">
      <AlertDialog
        NoDataIcon={NoDataIcon}
        showDialog={showDialog}
        title={'Delete Receipt?'}
        body={'Are you sure you wany to delete this Receipt?'}
        okAction={confirmDeleteDocument}
        okText={'Yes, Delete'}
        cancelText={'Discard'}
        updateAlertState={updateAlertState}
      />
      {formattedData.length ? (
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
    user: state.profile.user,
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

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptsPage);
