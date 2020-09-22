import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Page from '../../shared/components/Page';
import ListView from '../../shared/components/list-view';

import sharedAction from '../../redux/actions/shared';
import AlertDialog from '../../shared/components/AlertDialog';
import BlankView from '../../shared/components/BlankView';
import { CircularProgress } from '../../materials';
import useData from '../../shared/hooks/useData';
import { INVOICES_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';
import { NoDataIcon } from '../../assets';
import { db } from '../../services/firebase';

const { updatePageTitle, updateAlertDialogState } = sharedAction;

const InvoicesPage = ({
  classes,
  updateTitle,
  showDialog,
  updateAlertState
}) => {
  // Use Data Hook
  const [data, loading] = useData(INVOICES_COLLECTION, useState);
  const [documentId, setDocumentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filterDocument = (doc) => {
    const nameSearchText = `${doc.firstName} ${doc.lastName}`.toLowerCase();
    const invoiceNumberSearchText = doc.invoiceNumber.toLowerCase();
    const shopNumberSearchText = doc.shopNumber.toLowerCase();
    const accountPaymentSearchText = doc.paymentAccount.toLowerCase();
    return searchQuery.length === 0
      ? true
      : invoiceNumberSearchText.includes(searchQuery.toLowerCase()) ||
          nameSearchText.includes(searchQuery.toLowerCase()) ||
          shopNumberSearchText.includes(searchQuery.toLowerCase()) ||
          accountPaymentSearchText.includes(searchQuery.toLowerCase());
  };

  const deleteDocument = (documentId) => {
    updateAlertState(true);
    setDocumentId(documentId);
  };

  const confirmDeleteDocument = () => {
    const documentDocRef = db.collection(INVOICES_COLLECTION).doc(documentId);
    documentDocRef.delete().then(() => updateAlertState(false));
  };

  useEffect(() => {
    updateTitle('Invoices');
  }, [updateTitle]);

  const listConfig = {
    title: 'Invoices',
    searchPlaceholder: 'Search Invoice',
    headCells: [
      {
        id: 'invoiceNumber',
        numeric: false,
        disablePadding: true,
        label: 'Invoice'
      },
      {
        id: 'customerFirstName',
        numeric: false,
        disablePadding: true,
        label: 'Firstname'
      },
      {
        id: 'customerLastName',
        numeric: false,
        disablePadding: true,
        label: 'Lastname'
      },
      {
        id: 'invoiceItem',
        numeric: false,
        disablePadding: false,
        label: 'Item'
      },
      {
        id: 'unitCost',
        numeric: false,
        disablePadding: false,
        label: 'Unit Cost'
      },
      {
        id: 'duration',
        numeric: false,
        disablePadding: false,
        label: 'Duration (YR)'
      },
      {
        id: 'totalCost',
        numeric: false,
        disablePadding: false,
        label: 'Total Cost'
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
    editUrl: '/dashboard/invoice/edit',
    viewUrl: '/dashboard/invoice',
    addButtonText: 'Add Invoice',
    addButtonUrl: '/dashboard/invoice/new/document'
  };

  return (
    <Page title="Invoice App | Invoices">
      <AlertDialog
        NoDataIcon={NoDataIcon}
        showDialog={showDialog}
        title={'Delete Invoice?'}
        body={'Are you sure you wany to delete this invoice?'}
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

export default connect(mapStateToProps, mapDispatchToProps)(InvoicesPage);
