import React from 'react';
import {
    AccountCircle,
    ExitToAppIcon,
    MenuItem,
    Menu
} from '../materials';

const FullMenu = (props) => {
    const { isMenuOpen, anchorEl, handleMenuClose, handleLogout, menuId } = props;

    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}><AccountCircle/> &nbsp; &nbsp; Profile</MenuItem>
        <MenuItem onClick={handleLogout}><ExitToAppIcon/> &nbsp; &nbsp; Logout</MenuItem>
      </Menu>
    );
};

export default FullMenu;