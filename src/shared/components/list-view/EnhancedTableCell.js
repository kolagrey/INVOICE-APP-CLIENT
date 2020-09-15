import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Box, Avatar, Typography, TableCell } from '../../../materials';
import { getInitials } from '../../../shared/utils';

const EnhancedTableCell = ({
  fieldName,
  fieldValue,
  fieldInitials,
  className
}) => {
  return fieldName === 'Avatar' ? (
    <TableCell>
      <Box alignItems="center" display="flex">
        <Avatar className={className} src={fieldValue}>
          {getInitials(fieldInitials)}
        </Avatar>
        <Typography color="textPrimary" variant="body1">
          {fieldInitials}
        </Typography>
      </Box>
    </TableCell>
  ) : fieldName === 'Created' ? (
    <TableCell align="left">
      {moment(fieldValue).format('DD/MM/YYYY')}
    </TableCell>
  ) : (
    <TableCell align="left">{fieldValue}</TableCell>
  );
};

EnhancedTableCell.propTypes = {
  className: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  fieldValue: PropTypes.string.isRequired,
  fieldInitials: PropTypes.string.isRequired
};

export default EnhancedTableCell;
