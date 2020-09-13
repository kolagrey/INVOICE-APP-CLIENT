import React from 'react';
import { connect } from 'react-redux';
import {
    Badge,
    MenuItem,
    Menu,
    AccountCircle,
    NotificationsIcon,
    IconButton
} from '../../materials';

const MobileMenu = (props) => {
    const { mobileMoreAnchorEl, isMobileMenuOpen, handleMobileMenuClose, handleProfileMenuOpen, mobileMenuId } = props;

    return (
        <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton aria-label="show new notifications" color="inherit">
            <Badge badgeContent={props.newNotifications} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );
};

const mapStateToProps = state => {
  return {
      newNotifications: 0
  }
}

export default connect(mapStateToProps)(MobileMenu);