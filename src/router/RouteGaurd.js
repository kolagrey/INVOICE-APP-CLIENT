import React, { Suspense } from 'react';
import { CircularProgress } from '../materials';

const RouteGaurd = ({ Route, Redirect, isAuthenticated, classes, children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ?
          <Suspense fallback={<CircularProgress className={classes.loading} />}>
            { children }
            </Suspense> : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
};

export default RouteGaurd;