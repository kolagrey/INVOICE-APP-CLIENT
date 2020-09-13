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
const UsersPage = lazy(() => import('../views/user/UsersPage'));
const InvoicesPage = lazy(() => import('../views/invoice/InvoicesPage'));
const ReceiptsPage = lazy(() => import('../views/receipt/ReceiptsPage'));
const SettingsPage = lazy(() => import('../views/settings/SettingsPage'));
const ProfilePage = lazy(() => import('../views/profile/ProfilePage'));
const ReportPage = lazy(() => import('../views/report/ReportPage'));
const DashboardPage = lazy(() => import('../views/DashboardPage'));
const LoginPage = lazy(() => import('../views/auth/LoginPage'));
const RegistrationPage = lazy(() => import('../views/auth/RegistrationPage'));
const NoMatch = lazy(() => import('../views/error/NoMatch'));

const AppRouter = (props) => {
    const { isAuthenticated } = props;
        const theme = useTheme();
        const classes = useStyles(makeStyles)();
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path='/'>
                        <LoginPage classes={classes} />
                    </Route>
                    <Route exact path='/login'>
                        <LoginPage classes={classes} />
                    </Route>
                    <Route exact path='/register'>
                        <RegistrationPage classes={classes} />
                    </Route>
                    <Route path='/dashboard'>
                        <DashboardPage classes={classes} theme={theme}>
                            <Switch>
                                <RouteGaurd Route={Route} Redirect={Redirect} isAuthenticated={isAuthenticated} classes={classes} exact path='/dashboard'>
                                    <OverviewPage classes={classes} />
                                </RouteGaurd>
                                <RouteGaurd Route={Route} Redirect={Redirect} isAuthenticated={isAuthenticated} classes={classes} path='/dashboard/customers'>
                                    <CustomersPage classes={classes} />
                                </RouteGaurd>
                                <RouteGaurd Route={Route} Redirect={Redirect} isAuthenticated={isAuthenticated} classes={classes} path='/dashboard/users'>
                                    <UsersPage classes={classes} />
                                </RouteGaurd>
                                <RouteGaurd Route={Route} Redirect={Redirect} isAuthenticated={isAuthenticated} classes={classes} path='/dashboard/invoices'>
                                    <InvoicesPage classes={classes} />
                                </RouteGaurd>
                                <RouteGaurd Route={Route} Redirect={Redirect} isAuthenticated={isAuthenticated} classes={classes} path='/dashboard/receipts'>
                                    <ReceiptsPage classes={classes} />
                                </RouteGaurd>
                                <RouteGaurd Route={Route} Redirect={Redirect} isAuthenticated={isAuthenticated} classes={classes} path='/dashboard/profile'>
                                    <ProfilePage classes={classes} />
                                </RouteGaurd>
                                <RouteGaurd Route={Route} Redirect={Redirect} isAuthenticated={isAuthenticated} classes={classes} path='/dashboard/settings'>
                                    <SettingsPage classes={classes} />
                                </RouteGaurd>
                                <RouteGaurd Route={Route} Redirect={Redirect} isAuthenticated={isAuthenticated} classes={classes} path='/dashboard/report'>
                                    <ReportPage classes={classes} />
                                </RouteGaurd>
                                <Route path='*'>
                                    <NoMatch classes={classes} />
                                </Route>
                            </Switch>
                        </DashboardPage>
                    </Route>
                    <Route path='*'>
                        <NoMatch />
                    </Route>
                </Switch>
            </Router>
        );
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
};

export default connect(mapStateToProps)(AppRouter);