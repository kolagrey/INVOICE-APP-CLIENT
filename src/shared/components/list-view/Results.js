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

const Results = ({ classes, data, listConfig }) => {
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
      const newSelecteds = data.map((n) => n.name);
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
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

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
            showAction={listConfig.showAction}
            showCheckbox={listConfig.showCheckbox}
            headCells={listConfig.headCells}
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />
          <TableBody>
            {stableSort(data, getComparator(order, orderBy))
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
                    key={row.id}
                    selected={isItemSelected}
                  >
                    {listConfig.showCheckbox && (
                      <TableCell
                        padding="checkbox"
                        onClick={(event) => handleClick(event, row.name)}
                      >
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                    )}
                    {listConfig.headCells.map((cell) => {
                      const fieldValue = row[cell.id] ? row[cell.id] : '';
                      const key = `${row.id}-${randomKey()}`;
                      return (
                        <EnhancedTableCell
                          key={key}
                          className={classes.avatar}
                          fieldValue={fieldValue}
                          fieldName={cell.label}
                          fieldInitials={
                            row.firstName && row.lastName
                              ? `${row.firstName} ${row.lastName}`
                              : 'Not Applicable'
                          }
                        />
                      );
                    })}
                    {listConfig.showAction && (
                      <ActionTableCell
                        canEdit={listConfig.canEdit}
                        canDelete={listConfig.canDelete}
                        documentId={row.id}
                        editUrl={listConfig.editUrl}
                        viewUrl={listConfig.viewUrl}
                        deleteAction={listConfig.deleteAction}
                      ></ActionTableCell>
                    )}
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
        count={data.length}
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
  data: PropTypes.array.isRequired,
  listConfig: PropTypes.object.isRequired
};

export default Results;
