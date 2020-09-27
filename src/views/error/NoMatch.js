import React, { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import Page from '../../shared/components/Page';

const NoMatch = ({ classes }) => {
  useEffect(() => {
    Sentry.captureException('User navigated to a non-existent route');
  }, []);
  return (
    <Page
      className={classes.root}
      title="Billing App | Page not found | 404 Error"
    >
      <h1>Error 404</h1>
      <h4>Page Not Found!</h4>
    </Page>
  );
};

export default NoMatch;
