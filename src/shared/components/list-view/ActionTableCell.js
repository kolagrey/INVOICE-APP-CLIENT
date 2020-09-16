import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import ViewIcon from '@material-ui/icons/MoreHoriz';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';

const ActionTableCell = ({
  canEdit,
  canDelete,
  editId,
  editUrl,
  viewAction,
  updateAlertDialogState
}) => {
  return (
    <TableCell align="right">
      <Box display="flex" justifyContent="flex-end">
        <IconButton aria-label="view" onClick={() => viewAction}>
          <ViewIcon color="primary" />
        </IconButton>
        {canEdit && (
          <Link to={`${editUrl}/${editId}`}>
            <IconButton aria-label="edit">
              <EditIcon color="secondary" />
            </IconButton>
          </Link>
        )}
        {canDelete && (
          <IconButton
            aria-label="delete"
            onClick={() => updateAlertDialogState(true)}
          >
            <DeleteIcon color="error" />
          </IconButton>
        )}
      </Box>
    </TableCell>
  );
};

ActionTableCell.propTypes = {
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  editId: PropTypes.string,
  editUrl: PropTypes.string,
  viewAction: PropTypes.func,
  updateAlertDialogState: PropTypes.func
};

export default ActionTableCell;
