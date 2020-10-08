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
  Button,
  Grid
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
      <Table aria-label="card table" size="small" style={{ minWidth: '100%' }}>
        <TableHead>
          <TableRow className="tableCardHeaderRowPrint">
            {fields.map((field) => (
              <TableCell
                key={field}
                align="left"
                style={{
                  backgroundColor: '#D8D8D8'
                }}
              >
                <h5>{field === 'id' ? 'S/N' : field.toUpperCase()}</h5>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <Grid xs={12} style={{ marginBottom: 10 }}></Grid>
        <TableBody style={{ border: '1px solid #000' }}>
          {data.map((row, index) => {
            return (
              <TableRow key={row.id}>
                {fields.map((field) => (
                  <TableCell
                    style={{
                      border: 2,
                      borderColor: 'black',
                      borderStyle: 'solid'
                    }}
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
