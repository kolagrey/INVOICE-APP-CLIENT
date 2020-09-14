import React, { useState } from 'react';
import Page from '../../shared/components/Page';
import ListView from '../../shared/components/list-view';
import data from '../../assets/data';

const CustomersPage = ({classes}) => {
    const [customers] = useState(data);
    return (
        <Page className={classes.root} title="Invoice App | Ciustomers">
            <ListView data={customers} classes={classes}></ListView>
        </Page>
    );
};

export default CustomersPage;