import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Page from '../../shared/components/Page';
import ListView from '../../shared/components/list-view';

import sharedAction from '../../redux/actions/shared';
import AlertDialog from '../../shared/components/AlertDialog';
import BlankView from '../../shared/components/BlankView';
import { CircularProgress } from '../../materials';
import useData from '../../shared/hooks/useData';
import {
  IDS_TRACKER_COLLECTION,
  INVOICES_COLLECTION,
  RECEIPTS_COLLECTION
} from '../../firebase-helpers/constants/collectionsTypes';
import { NoDataIcon } from '../../assets';
import { db } from '../../services/firebase';
import { useSnackbar } from 'notistack';
import {
  ADMIN_ROLE,
  MANAGER_ROLE,
  STATUS_PAID,
  STATUS_PENDING
} from '../../shared/constants';
import { currencyFormatter } from '../../shared/utils';

const { updatePageTitle, updateAlertDialogState } = sharedAction;

const InvoicesPage = ({
  user,
  classes,
  updateTitle,
  showDialog,
  updateAlertState
}) => {
  // Use Data Hook
  const [data, loading] = useData(INVOICES_COLLECTION, useState);
  const [documentId, setDocumentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalLoading, setApprovalLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const filterDocument = (doc) => {
    const nameSearchText = doc.customerFullName
      ? doc.customerFullName.toLowerCase()
      : doc.customerCompanyName.toLowerCase();
    const invoiceNumberSearchText = doc.invoiceNumber + '';
    const shopNumberSearchText = doc.shopNumber.toLowerCase();
    return searchQuery.length === 0
      ? true
      : invoiceNumberSearchText.includes(searchQuery.toLowerCase()) ||
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

  const formattedData = data
    .filter((doc) => !doc.status || doc.status === STATUS_PENDING)
    .map(mapDocument);

  const deleteDocument = (documentId) => {
    updateAlertState(true);
    setDocumentId(documentId);
  };

  const confirmDeleteDocument = () => {
    const documentDocRef = db.collection(INVOICES_COLLECTION).doc(documentId);
    documentDocRef.delete().then(() => {
      updateAlertState(false);
      enqueueSnackbar('Invoice deleted successfully!', { variant: 'success' });
    });
  };

  const getLastId = () => {
    return new Promise((resolve, reject) => {
      db.collection(IDS_TRACKER_COLLECTION)
        .doc('receipt')
        .get()
        .then((doc) => {
          resolve(doc.data().nextId);
        });
    });
  };

  // Invoice Approval Action
  const approveInvoice = async (invoiceIds) => {
    try {
      if (invoiceIds && invoiceIds.length) {
        setApprovalLoading(true);
        let idLength = invoiceIds.length;
        let nextId = await getLastId();
        invoiceIds.forEach((invoiceId) => {
          const documentDocRef = db
            .collection(INVOICES_COLLECTION)
            .doc(invoiceId);
          documentDocRef.get().then((document) => {
            const receiptDocument = {
              ...document.data(),
              status: STATUS_PAID,
              receiptDate: new Date(),
              receiptNumber: nextId++,
              approvedBy: {
                id: user.id,
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.email
              }
            };
            documentDocRef.update({ status: STATUS_PAID }).then(() => {
              const newDocumentRef = db.collection(RECEIPTS_COLLECTION).doc();
              receiptDocument.id = newDocumentRef.id;
              newDocumentRef.set(receiptDocument).then(() => {
                idLength--;
                if (idLength === 0) {
                  setApprovalLoading(false);
                  enqueueSnackbar(
                    `${invoiceIds.length} Invoice approved successfully!`,
                    {
                      variant: 'success'
                    }
                  );
                }
              });
            });
          });
        });
      } else {
        enqueueSnackbar('Unable to execute action!', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Unable to execute action!', { variant: 'error' });
    }
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
        disablePadding: false,
        label: 'Invoice#'
      },
      {
        id: 'customerFullName',
        numeric: false,
        disablePadding: false,
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
    showApproval: true,
    showSearchToolbar: true,
    showCheckbox: true,
    showAction: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    canView: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    canEdit: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    canDelete: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    canCreate: user.role === ADMIN_ROLE || user.role === MANAGER_ROLE,
    showFilter: false,
    showAddButton: true,
    approvalLoading: approvalLoading,
    approvalAction: approveInvoice,
    filterAction: () => {},
    deleteAction: deleteDocument,
    searchAction: setSearchQuery,
    editUrl: '/dashboard/invoice/edit',
    viewUrl: '/dashboard/invoice',
    addButtonText: 'Add Invoice',
    addButtonUrl: '/dashboard/invoice/new/document'
  };

  return (
    <Page title="Billing App | Invoices">
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

export default connect(mapStateToProps, mapDispatchToProps)(InvoicesPage);
