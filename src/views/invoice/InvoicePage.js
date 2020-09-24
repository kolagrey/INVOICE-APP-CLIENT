import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PrintIcon from '@material-ui/icons/PrintRounded';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '../../materials';
import TableCard from '../,,/../../shared/components/TableCard';
import { useParams } from 'react-router-dom';
import {
  INVOICES_COLLECTION,
  SETTINGS_COLLECTION
} from '../../firebase-helpers/constants/collectionsTypes';
import { db } from '../../services/firebase';
import { SETTINGS_ID } from '../../shared/constants';
import { currencyFormatter, moment } from '../../shared/utils';

const InvoicePage = ({ classes }) => {
  const { id: documentId } = useParams();
  const [invoiceDocument, setInvoiceDocument] = useState({});
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const documentDocRef = db.collection(INVOICES_COLLECTION).doc(documentId);
    documentDocRef.get().then((documentDoc) => {
      const documentData = documentDoc.data();
      setInvoiceDocument({
        ...documentData,
        invoiceDate: moment(documentData.invoiceDate.toDate()).format(
          'MMMM Do YYYY'
        ),
        invoiceDueDate: moment(documentData.invoiceDueDate.toDate()).format(
          'MMMM Do YYYY'
        )
      });
      setLoading(false);
    });
  }, [documentId]);

  useEffect(() => {
    const documentDocRef = db.collection(SETTINGS_COLLECTION).doc(SETTINGS_ID);
    documentDocRef.get().then((documentDoc) => {
      const documentData = documentDoc.data();
      setSettings(documentData);
    });
  }, []);

  const invoice = [
    {
      id: 1,
      item: invoiceDocument.invoiceItem,
      description: invoiceDocument.invoiceDescription,
      cost: `NGN ${currencyFormatter(invoiceDocument.unitCost)}`,
      duration:
        invoiceDocument.duration > 1
          ? `${invoiceDocument.duration} Months`
          : `${invoiceDocument.duration} Month`,
      total: `NGN ${currencyFormatter(invoiceDocument.totalCost)}`
    }
  ];
  return (
    <React.Fragment>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} md={10} lg={10}>
            <Grid container spacing={5}>
              <Grid item sm={12} md={12} lg={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<PrintIcon />}
                  onClick={() => window.print()}
                >
                  Print
                </Button>
              </Grid>
            </Grid>

            <Card className={classes.card} variant="outlined">
              <CardContent className="printArea">
                <Grid container spacing={3}>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={12}
                    style={{ textAlign: 'center', marginBottom: 50 }}
                  >
                    <img
                      style={{ margin: 'auto', height: 100 }}
                      alt="Logo"
                      src={settings.avatar}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} style={{ marginBottom: 50 }}>
                  <Grid item xs={6} md={6} lg={6}>
                    <div style={{ textAlign: 'left' }}>
                      <div>
                        <b>
                          {invoiceDocument.customerFirstName}{' '}
                          {invoiceDocument.customerLastName}
                        </b>
                      </div>
                      <div>{invoiceDocument.customerAddress}</div>
                      <div>
                        {invoiceDocument.customerCity},{' '}
                        {invoiceDocument.customerState}
                      </div>
                      <div>{invoiceDocument.customerTelephone}</div>
                      <div>{invoiceDocument.customerEmail}</div>
                    </div>
                  </Grid>
                  <Grid item xs={6} md={6} lg={6}>
                    <div style={{ textAlign: 'right' }}>
                      <div>
                        <b>{invoiceDocument.companyName}</b>
                      </div>
                      <div>{invoiceDocument.companyAddress}</div>
                      <div>
                        {invoiceDocument.companyCity},{' '}
                        {invoiceDocument.companyState}
                      </div>
                      <div>{invoiceDocument.companyTelephone}</div>
                      <div>{invoiceDocument.companyEmail}</div>
                    </div>
                  </Grid>
                </Grid>

                <Grid
                  container
                  style={{
                    marginBottom: 30
                  }}
                >
                  <Grid item xs={4}>
                    <div style={{ textAlign: 'left' }}>
                      <div>Invoice Date</div>
                      <div>
                        <h4>{invoiceDocument.invoiceDate}</h4>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div style={{ textAlign: 'left' }}>
                      <div>Due Date</div>
                      <div>
                        <h4>{invoiceDocument.invoiceDueDate}</h4>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div style={{ textAlign: 'right' }}>
                      <div>Invoice Number</div>
                      <div>
                        <h4>{invoiceDocument.invoiceNumber}</h4>
                      </div>
                    </div>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={12} lg={12}>
                    <TableCard classes={classes} data={invoice}></TableCard>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={7} md={7} lg={7}></Grid>
                  <Grid item xs={5} md={5} lg={5}>
                    <Grid container spacing={2}>
                      <TableContainer>
                        <Table aria-label="card table">
                          <TableBody>
                            <TableRow>
                              <TableCell align="right">
                                <h4>SubTotal</h4>
                              </TableCell>
                              <TableCell align="left">
                                <h3>
                                  NGN
                                  {currencyFormatter(invoiceDocument.totalCost)}
                                </h3>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="right">
                                <h4>VAT</h4>
                              </TableCell>
                              <TableCell align="left">
                                <h3>{invoiceDocument.vat}%</h3>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="right">
                                <h4>VAT Value</h4>
                              </TableCell>
                              <TableCell align="left">
                                <h3>
                                  NGN
                                  {currencyFormatter(invoiceDocument.vatValue)}
                                </h3>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell align="right">
                                <h4>Grand Total</h4>
                              </TableCell>
                              <TableCell align="left">
                                <h3>
                                  NGN
                                  {currencyFormatter(
                                    invoiceDocument.grandTotal
                                  )}
                                </h3>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={12} style={{ paddingTop: 40 }}>
                    <h4>Payment Instruction</h4>
                    <div>{invoiceDocument.paymentAccount}</div>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12}>
                    <i>{invoiceDocument.note}</i>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
};

InvoicePage.propTypes = {
  classes: PropTypes.object
};

export default InvoicePage;
