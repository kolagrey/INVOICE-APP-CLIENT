import React from 'react';
import moment from 'moment';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button
} from '../../materials';

export default function TableCard(props) {
  const { classes, data, defaultIcon, useDefaultIcon = false } = props;
  let fields = Object.keys(data && data.length ? data[0] : []);
  fields = fields
    .filter((field) => field !== '__v')
    .filter((field) => field !== '_id');

  const showDetails = (data) => {
    console.log(data);
  };

  const formatRow = (data, field = null) => {
    if (typeof data === 'object') {
      return (
        <Button className={classes.button} onClick={() => showDetails(data)}>
          View
        </Button>
      );
    } else {
      return data;
    }
  };

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="card table">
        <TableHead style={{ backgroundColor: '#D8D8D8' }}>
          <TableRow>
            {fields.map((field) => (
              <TableCell key={field} align="left">
                <h5>{field.toUpperCase()}</h5>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => {
            return (
              <TableRow key={row.id}>
                {fields.map((field) => (
                  <TableCell
                    style={{ borderBottom: '1px solid #000' }}
                    key={`field-${(
                      Math.random() * new Date().getTime()
                    ).toFixed(0)}-${index}`}
                    align="left"
                  >
                    {field === 'createdAt' || field === 'updatedAt' ? (
                      moment(row[field]).fromNow()
                    ) : field === 'avatar' ? (
                      <Avatar
                        src={
                          row[field] && !useDefaultIcon
                            ? row[field]
                            : defaultIcon
                        }
                        className={classes.avatar}
                      />
                    ) : (
                      formatRow(row[field])
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
