import React from 'react';

import DashboardLayout from '../../layouts/DashboardLayout';
import SideDrawer from '../components/SideDrawer';


const DashboardPage = (props) => {
    const { classes, theme } = props;
    return (
        // Set the directory path if you are deploying in sub-folder
            <DashboardLayout classes={classes}>
                <SideDrawer classes={classes} theme={theme} />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    { props.children }
                </main>
            </DashboardLayout>
    );
};

export default DashboardPage;