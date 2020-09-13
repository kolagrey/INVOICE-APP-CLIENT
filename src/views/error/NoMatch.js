import React from 'react';
import Page from '../../shared/components/Page';

const NoMatch = ({classes}) => {
    return (
        <Page className={classes.root} title="Invoice App | Page not found | 404 Error">
            <h1>Error 404</h1>
            <h4>Page Not Found!</h4>
        </Page>
    )
};

export default NoMatch;