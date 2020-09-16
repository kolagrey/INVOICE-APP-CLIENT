import React from 'react';
import { connect } from 'react-redux';

import { history } from '../../router';
import authActions from '../../redux/actions/auth';

import FullMenu from './FullMenu';
import MobileMenu from './MobileMenu';
import {
  Badge,
  Avatar,
  NotificationsIcon,
  MoreIcon,
  clsx,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuIcon
} from '../../materials';
import { Logo192 } from '../../assets';

const { logOutUser } = authActions;

const MenuAppBar = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isMenuOpen = Boolean(anchorEl);
  const { classes, handleDrawerOpen, open, pageTitle } = props;

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    history.push('/dashboard/profile');
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    props.logOutUser();
  };

  return (
    <div className={classes.grow}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {pageTitle}
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={props.newNotifications} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar src={Logo192} className={classes.userAvatar} />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <MobileMenu
        mobileMenuId={mobileMenuId}
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        isMobileMenuOpen={isMobileMenuOpen}
        handleMobileMenuClose={handleMobileMenuClose}
        handleProfileMenuOpen={handleProfileMenuOpen}
      />

      <FullMenu
        menuId={menuId}
        isMenuOpen={isMenuOpen}
        anchorEl={anchorEl}
        handleMenuClose={handleMenuClose}
        handleLogout={handleLogout}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    newNotifications: 0,
    pageTitle: state.shared.pageTitle
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOutUser: () => {
      return dispatch(logOutUser());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuAppBar);
