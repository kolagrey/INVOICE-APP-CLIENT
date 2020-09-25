import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import ViewIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';

const ActionTableCell = ({
  canView,
  canEdit,
  canDelete,
  documentId,
  editUrl,
  viewUrl,
  deleteAction
}) => {
  return (
    <TableCell align="right">
      <Box display="flex" justifyContent="flex-end">
        {canView && (
          <Link to={`${viewUrl}/${documentId}`}>
            <IconButton aria-label="view">
              <ViewIcon color="primary" />
            </IconButton>
          </Link>
        )}
        {canEdit && (
          <Link to={`${editUrl}/${documentId}`}>
            <IconButton aria-label="edit">
              <EditIcon color="secondary" />
            </IconButton>
          </Link>
        )}
        {canDelete && (
          <IconButton
            aria-label="delete"
            onClick={() => deleteAction(documentId)}
          >
            <DeleteIcon color="error" />
          </IconButton>
        )}
      </Box>
    </TableCell>
  );
};

ActionTableCell.propTypes = {
  canView: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  documentId: PropTypes.string,
  editUrl: PropTypes.string,
  viewUrl: PropTypes.string,
  deleteAction: PropTypes.func
};

export default ActionTableCell;
