import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Page from '../../shared/components/Page';
import ListView from '../../shared/components/list-view';
import data from '../../assets/data';

import sharedAction from '../../redux/actions/shared';
const { updatePageTitle } = sharedAction;

const CustomersPage = ({ classes, updateTitle }) => {
  const [customers] = useState(data);
  const listConfig = {
    title: 'Customers',
    searchPlaceholder: 'Search Customer',
    headers: ['Fullname', 'Email', 'Location', 'Phone', 'Registration Date'],
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
      {
        id: 'location',
        numeric: true,
        disablePadding: false,
        label: 'Location'
      },
      { id: 'phone', numeric: true, disablePadding: false, label: 'Phone' },
      {
        id: 'createdAt',
        numeric: true,
        disablePadding: false,
        label: 'Registration Date'
      }
    ],
    hasActions: true,
    canEdit: true,
    canDelete: true,
    canCreate: true,
    showFilter: true,
    filterFunction: () => {},
    deleteFunction: () => {},
    searchFunction: () => {},
    editUrl: '',
    createUrl: ''
  };

  useEffect(() => {
    updateTitle('Customers');
  }, [updateTitle]);

  return (
    <Page className={classes.root} title="Invoice App | Ciustomers">
      <ListView
        data={customers}
        classes={classes}
        listConfig={listConfig}
      ></ListView>
    </Page>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTitle: (payload) => {
      return dispatch(updatePageTitle(payload));
    }
  };
};

export default connect(null, mapDispatchToProps)(CustomersPage);
