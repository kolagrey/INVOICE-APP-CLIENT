import React from 'react';
import { connect } from 'react-redux';

import MenuAppBar from './MenuAppBar';
import ComponentLink from './ComponentLink';
import {
    clsx,
    Avatar,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    CssBaseline,
    Typography,
    Divider,
    Badge,
    IconButton,
    ChevronLeftIcon,
    ChevronRightIcon,
    ExitToAppIcon,
} from '../materials';
import { dashboardMenu } from '../config';
import { Logo192 } from '../assets';


import authActions from '../redux/actions/auth';
const { logOutUser } = authActions;

const SideDrawer = (props) => {
    const [open, setOpen] = React.useState(false);
    const { classes, theme } = props;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <MenuAppBar classes={classes} open={open} handleDrawerOpen={handleDrawerOpen} />
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbarMenu}>
                    <Avatar className={classes.logoIcon} src={Logo192} alt="THD" />
                    <Typography variant="h6" noWrap>
                        Billings Dashboard
                    </Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {dashboardMenu({
                        notifications: props.newNotifications
                    }).map((menu, index) => (
                        <ListItem button key={index} component={ComponentLink} to={menu.url}>
                            <ListItemIcon>
                                <Badge badgeContent={menu.badge} color="secondary">
                                    <menu.icon />
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary={menu.text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={() => props.logOutUser()}>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    return {
        newNotifications:  0
    }
}
const mapDispatchToProps = dispatch => {
    return {
        logOutUser: () => {
            return dispatch(logOutUser());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
