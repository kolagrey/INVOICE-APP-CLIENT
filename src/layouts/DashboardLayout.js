import React from 'react';

const DashboardLayout = (props) => {
    const { classes } = props;
    return (
        <div className={classes.root}>
            { props.children }
        </div>
    )
}

export default DashboardLayout;