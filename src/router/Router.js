import React, { lazy } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useStyles } from '../shared/utils';
import RouteGaurd from './RouteGaurd';
import history from './history';
// Pages
const OverviewPage = lazy(() => import('../views/overview/OverviewPage'));

const CustomersPage = lazy(() => import('../views/customer/CustomersPage'));
const CustomerPage = lazy(() => import('../views/customer/CustomerPage'));
const CustomerForm = lazy(() => import('../views/customer/CustomerForm'));
const CustomersDownload = lazy(() => import('../views/customer/CustomersDownload'));

const BillingProfilesPage = lazy(() =>
  import('../views/billing/BillingProfilesPage')
);
const BillingProfilePage = lazy(() =>
  import('../views/billing/BillingProfilePage')
);
const BillingProfileForm = lazy(() =>
  import('../views/billing/BillingProfileForm')
);

const ShopsPage = lazy(() => import('../views/shop/ShopsPage'));
const ShopPage = lazy(() => import('../views/shop/ShopPage'));
const ShopForm = lazy(() => import('../views/shop/ShopForm'));

const UsersPage = lazy(() => import('../views/user/UsersPage'));
const UserPage = lazy(() => import('../views/user/UserPage'));
const UserForm = lazy(() => import('../views/user/UserForm'));

const InvoicesPage = lazy(() => import('../views/invoice/InvoicesPage'));
const InvoicePage = lazy(() => import('../views/invoice/InvoicePage'));
const InvoiceForm = lazy(() => import('../views/invoice/InvoiceForm'));

const ReceiptsPage = lazy(() => import('../views/receipt/ReceiptsPage'));
const ReceiptPage = lazy(() => import('../views/receipt/ReceiptPage'));

const SettingsPage = lazy(() => import('../views/settings/SettingsPage'));
const ProfilePage = lazy(() => import('../views/profile/ProfilePage'));
const ReportPage = lazy(() => import('../views/report/ReportPage'));
const DashboardPage = lazy(() => import('../views/DashboardPage'));
const LoginPage = lazy(() => import('../views/auth/LoginPage'));
// const RegistrationPage = lazy(() => import('../views/auth/RegistrationPage'));
const NoMatch = lazy(() => import('../views/error/NoMatch'));

const AppRouter = (props) => {
  const { isAuthenticated } = props;
  const theme = useTheme();
  const classes = useStyles(makeStyles)();
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/">
          <LoginPage classes={classes} />
        </Route>
        <Route exact path="/login">
          <LoginPage classes={classes} />
        </Route>
        <Route exact path="/register">
          <LoginPage classes={classes} />
        </Route>
        <Route path="/dashboard">
          <DashboardPage classes={classes} theme={theme}>
            <Switch>
              <RouteGaurd
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                exact
                path="/dashboard"
              >
                <OverviewPage classes={classes} />
              </RouteGaurd>

              {/* CUSTOMER ROUTES STARTS*/}
              <RouteGaurd
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/customers"
              >
                <CustomersPage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/data/download"
              >
                <CustomersDownload classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                exact
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/customer/:id"
              >
                <CustomerPage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                exact
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/customer/:action/:id"
              >
                <CustomerForm classes={classes} />
              </RouteGaurd>
              {/* CUSTOMER ROUTES ENDS */}

              {/* BILLING PROFILE ROUTES STARTS*/}
              <RouteGaurd
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/billings"
              >
                <BillingProfilesPage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                exact
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/billing/:id"
              >
                <BillingProfilePage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                exact
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/billing/:action/:id"
              >
                <BillingProfileForm classes={classes} />
              </RouteGaurd>
              {/* BILLING PROFILE ROUTES ENDS */}

              {/* SHOP PROFILE ROUTES STARTS*/}
              <RouteGaurd
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/shops"
              >
                <ShopsPage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                exact
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/shop/:id"
              >
                <ShopPage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                exact
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/shop/:action/:id"
              >
                <ShopForm classes={classes} />
              </RouteGaurd>
              {/* SHOP PROFILE ROUTES ENDS */}

              {/* USER ROUTES STARTS*/}
              <RouteGaurd
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/users"
              >
                <UsersPage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                exact
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/user/:id"
              >
                <UserPage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                exact
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/user/:action/:id"
              >
                <UserForm classes={classes} />
              </RouteGaurd>
              {/* USER ROUTES ENDS*/}

              {/* INVOICE ROUTE STARTS */}
              <RouteGaurd
                exact
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/invoices"
              >
                <InvoicesPage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                exact
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/invoice/:id"
              >
                <InvoicePage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                exact
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/invoice/:action/:id"
              >
                <InvoiceForm classes={classes} />
              </RouteGaurd>
              {/* INVOICE ROUTES ENDS*/}

              {/* RECEIPT ROUTE STARTS */}
              <RouteGaurd
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/receipts"
              >
                <ReceiptsPage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/receipt/:id"
              >
                <ReceiptPage classes={classes} />
              </RouteGaurd>
              {/* RECEIPT ROUTE ENDS */}

              <RouteGaurd
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/profile"
              >
                <ProfilePage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/settings"
              >
                <SettingsPage classes={classes} />
              </RouteGaurd>
              <RouteGaurd
                Route={Route}
                Redirect={Redirect}
                isAuthenticated={isAuthenticated}
                classes={classes}
                path="/dashboard/report"
              >
                <ReportPage classes={classes} />
              </RouteGaurd>
              <Route path="*">
                <NoMatch classes={classes} />
              </Route>
            </Switch>
          </DashboardPage>
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
};

export default connect(mapStateToProps)(AppRouter);
