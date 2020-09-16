import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Page from '../../shared/components/Page';
import ListView from '../../shared/components/list-view';
import data from '../../assets/data';

import sharedAction from '../../redux/actions/shared';
import AlertDialog from '../../shared/components/AlertDialog';
const { updatePageTitle, updateAlertDialogState } = sharedAction;

const CustomersPage = ({
  classes,
  updateTitle,
  showDialog,
  updateAlertState
}) => {
  const [customers] = useState(data);
  const listConfig = {
    title: 'Customers',
    searchPlaceholder: 'Search Customer',
    headCells: [
      {
        id: 'avatarUrl',
        numeric: false,
        disablePadding: true,
        label: 'Avatar'
      },
      {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Fullname'
      },
      {
        id: 'email',
        numeric: true,
        disablePadding: false,
        label: 'Email'
      },
      { id: 'phone', numeric: true, disablePadding: false, label: 'Phone' },
      {
        id: 'createdAt',
        numeric: true,
        disablePadding: false,
        label: 'Created'
      }
    ],
    hasActions: true,
    canEdit: true,
    canDelete: true,
    canCreate: true,
    showFilter: false,
    filterAction: () => {},
    deleteAction: () => {},
    searchAction: () => {},
    editUrl: '/dashboard/customer/edit',
    addButtonText: 'Add Customer',
    addButtonUrl: '/dashboard/customer/new'
  };

  useEffect(() => {
    updateTitle('Customers');
    updateAlertState(false);
  }, [updateTitle, updateAlertState]);

  return (
    <Page title="Invoice App | Ciustomers">
      <AlertDialog
        showDialog={showDialog}
        updateAlertState={updateAlertState}
        title={'Delete Customer?'}
        body={'Are you sure you wany to delete this customer?'}
        okAction={updateAlertState}
        okText={'Yes, Delete'}
        cancelText={'Discard'}
      ></AlertDialog>
      <ListView
        updateAlertDialogState={updateAlertState}
        data={customers}
        classes={classes}
        listConfig={listConfig}
      ></ListView>
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
