import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';

import Page from '../../shared/components/Page';
import ListView from '../../shared/components/list-view';

import sharedAction from '../../redux/actions/shared';
import AlertDialog from '../../shared/components/AlertDialog';
import BlankView from '../../shared/components/BlankView';
import { CircularProgress } from '../../materials';
import useData from '../../shared/hooks/useData';
import { USER_PROFILES_COLLECTION } from '../../firebase-helpers/constants/collectionsTypes';
import { NoDataIcon } from '../../assets';
import { db } from '../../services/firebase';
import { ADMIN_ROLE } from '../../shared/constants';

const { updatePageTitle, updateAlertDialogState } = sharedAction;

const UsersPage = ({
  classes,
  updateTitle,
  showDialog,
  updateAlertState,
  user
}) => {
  // Use Data Hook
  const [data, loading] = useData(USER_PROFILES_COLLECTION, useState);
  const [documentId, setDocumentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const filterDocument = (doc) => {
    const nameSearchText = `${doc.firstName} ${doc.lastName}`.toLowerCase();
    const emailSearchText = doc.email.toLowerCase();
    const telephoneSearchText = doc.telephone.toLowerCase();
    const roleSearchText = doc.role.toLowerCase();
    return searchQuery.length === 0
      ? true
      : emailSearchText.includes(searchQuery.toLowerCase()) ||
          telephoneSearchText.includes(searchQuery.toLowerCase()) ||
          roleSearchText.includes(searchQuery.toLowerCase()) ||
          nameSearchText.includes(searchQuery.toLowerCase());
  };

  const deleteDocument = (documentId) => {
    updateAlertState(true);
    setDocumentId(documentId);
  };

  const confirmDeleteDocument = () => {
    const documentDocRef = db
      .collection(USER_PROFILES_COLLECTION)
      .doc(documentId);
    documentDocRef.delete().then(() => {
      updateAlertState(false);
      enqueueSnackbar('Shop deleted successfully!', { variant: 'success' });
    });
  };

  useEffect(() => {
    updateTitle('Users');
  }, [updateTitle]);

  const listConfig = {
    title: 'Users',
    searchPlaceholder: 'Search User',
    headCells: [
      {
        id: 'avatar',
        numeric: false,
        disablePadding: false,
        label: 'Avatar'
      },
      {
        id: 'firstName',
        numeric: false,
        disablePadding: false,
        label: 'Firstname'
      },
      {
        id: 'lastName',
        numeric: false,
        disablePadding: false,
        label: 'Lastname'
      },
      {
        id: 'email',
        numeric: true,
        disablePadding: false,
        label: 'Email'
      },
      {
        id: 'telephone',
        numeric: false,
        disablePadding: false,
        label: 'Phone'
      },
      { id: 'role', numeric: false, disablePadding: false, label: 'Role' }
    ],
    showSearchToolbar: true,
    showCheckbox: true,
    showAction: user.role === ADMIN_ROLE,
    canView: user.role === ADMIN_ROLE,
    canEdit: user.role === ADMIN_ROLE,
    canDelete: user.role === ADMIN_ROLE,
    canCreate: user.role === ADMIN_ROLE,
    showFilter: false,
    showAddButton: user.role === ADMIN_ROLE,
    filterAction: () => {},
    deleteAction: deleteDocument,
    searchAction: setSearchQuery,
    editUrl: '/dashboard/user/edit',
    viewUrl: '/dashboard/user',
    addButtonText: 'Add User',
    addButtonUrl: '/dashboard/user/new/document'
  };

  return (
    <Page title="Billing App | Users">
      <AlertDialog
        NoDataIcon={NoDataIcon}
        showDialog={showDialog}
        title={'Delete User?'}
        body={'Are you sure you wany to delete this user?'}
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

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
