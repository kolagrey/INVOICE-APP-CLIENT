import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TableContainer,
  Paper
} from '../../../materials';

import { getComparator, stableSort } from '../../../shared/utils';

import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableCell from './EnhancedTableCell';
import ActionTableCell from './ActionTableCell';

const Results = ({
  classes,
  customers,
  listConfig,
  updateAlertDialogState
}) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const randomKey = () => {
    const random = Math.random();
    return random * 66666666666666;
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = customers.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, customers.length - page * rowsPerPage);

  return (
    <Paper>
      <EnhancedTableToolbar
        numSelected={selected.length}
        classes={classes}
        tableTitle={listConfig.title}
        showFilter={listConfig.showFilter}
      />
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          size={'medium'}
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            headCells={listConfig.headCells}
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={customers.length}
          />
          <TableBody>
            {stableSort(customers, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                  >
                    <TableCell
                      padding="checkbox"
                      onClick={(event) => handleClick(event, row.name)}
                    >
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    {listConfig.headCells.map((cell) => {
                      return (
                        <EnhancedTableCell
                          key={`${row.id}-${randomKey()}`}
                          className={classes.avatar}
                          fieldValue={
                            cell.label === 'Location'
                              ? `${row.address.city}, ${row.address.state}, ${row.address.country}`
                              : row[cell.id]
                          }
                          fieldName={cell.label}
                          fieldInitials={
                            cell.label === 'Avatar'
                              ? row.name
                              : 'Not Applicable'
                          }
                        />
                      );
                    })}
                    <ActionTableCell
                      canEdit={listConfig.canEdit}
                      canDelete={listConfig.canDelete}
                      editId={row.id}
                      editUrl={listConfig.editUrl}
                      viewAction={listConfig.canView}
                      deleteAction={listConfig.deleteAction}
                      updateAlertDialogState={updateAlertDialogState}
                    ></ActionTableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={customers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

Results.propTypes = {
  classes: PropTypes.object.isRequired,
  customers: PropTypes.array.isRequired,
  listConfig: PropTypes.object.isRequired,
  updateAlertDialogState: PropTypes.func
};

export default Results;
