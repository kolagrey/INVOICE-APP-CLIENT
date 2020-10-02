import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/CheckCircle';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Button, CircularProgress } from '@material-ui/core';
import { useSnackbar } from 'notistack';

const EnhancedTableToolbar = ({
  classes,
  numSelected,
  tableTitle,
  selectedIds,
  showFilter,
  showApproval,
  approvalAction,
  approvalLoading
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const approve = () => {
    if (selectedIds && selectedIds.length) approvalAction(selectedIds);
  };

  return (
    <Toolbar className={classes.toolbarRoot}>
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {tableTitle}
        </Typography>
      )}

      {numSelected > 0 ? (
        <React.Fragment>
          <Tooltip title="Delete">
            <IconButton
              aria-label="delete"
              onClick={() =>
                enqueueSnackbar('You do not have bulk delete privilege!', {
                  variant: 'error'
                })
              }
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          {showApproval && (
            <Tooltip title="Approve">
              <Button
                variant="contained"
                disabled={approvalLoading}
                color="primary"
                size="large"
                onClick={() => approve()}
                className={classes.button}
                startIcon={<CheckIcon />}
              >
                {!approvalLoading ? 'Approve' : <CircularProgress />}
              </Button>
            </Tooltip>
          )}
        </React.Fragment>
      ) : (
        showFilter && (
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  selectedIds: PropTypes.array,
  approvalLoading: PropTypes.bool
};

export default EnhancedTableToolbar;
