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
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const invoiceHeadersStyle = {
    textAlign: 'left',
    fontSize: 10,
    color: 'grey'
  };

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

      setInvoiceItems(
        documentData.invoiceItemsList.map((item, index) => {
          return {
            id: index + 1,
            item: item.invoiceItem,
            Description: item.invoiceDescription,
            'Unit Cost (NGN)': currencyFormatter(item.unitCost),
            'Sub Total (NGN)': currencyFormatter(item.subTotalCost),
            'Duration (Months)': item.duration,
            'Amount (NGN)': currencyFormatter(item.totalAmount)
          };
        })
      );
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

  return (
    <React.Fragment>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} md={11} lg={11}>
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
                <Grid container spacing={3} style={{ marginBottom: 10 }}>
                  <Grid item xs={6} md={6} lg={6}>
                    <Grid container spacing={1} style={{ marginBottom: 10 }}>
                      <Grid item xs={12}>
                        <h1>INVOICE</h1>
                      </Grid>
                      <Grid item xs={4} style={invoiceHeadersStyle}>
                        INVOICE NUMBER
                      </Grid>

                      <Grid item xs={8} style={invoiceHeadersStyle}>
                        {invoiceDocument.invoiceNumber}
                      </Grid>
                      <Grid item xs={4} style={invoiceHeadersStyle}>
                        INVOICE DATE
                      </Grid>
                      <Grid item xs={8} style={invoiceHeadersStyle}>
                        {invoiceDocument.invoiceDate}
                      </Grid>
                      <Grid item xs={4} style={invoiceHeadersStyle}>
                        DUE DATE
                      </Grid>
                      <Grid item xs={8} style={invoiceHeadersStyle}>
                        {invoiceDocument.invoiceDueDate}
                      </Grid>
                      <Grid item xs={4} style={invoiceHeadersStyle}>
                        SHOP NUMBER(S)
                      </Grid>
                      <Grid item xs={8} style={invoiceHeadersStyle}>
                        {invoiceDocument.shopNumber}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} md={6} lg={6}>
                    <Grid container spacing={3} style={{ marginBottom: 10 }}>
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        style={{ textAlign: 'right', marginBottom: 10 }}
                      >
                        <img
                          style={{ height: 100 }}
                          alt="Logo"
                          src={settings.avatar}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container spacing={3} style={{ marginBottom: 10 }}>
                  <Grid item xs={6} md={6} lg={6} style={{ textAlign: 'left' }}>
                    <div style={invoiceHeadersStyle}>
                      <div>FROM</div>
                    </div>
                    <div>
                      <h3>{invoiceDocument.companyName}</h3>
                    </div>
                    <div>{invoiceDocument.companyAddress}</div>
                    <div>
                      {invoiceDocument.companyCity},{' '}
                      {invoiceDocument.companyState}
                    </div>
                    <div>{invoiceDocument.companyTelephone}</div>
                    <div>{invoiceDocument.companyEmail}</div>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={6}
                    lg={6}
                    style={{ textAlign: 'left', marginBottom: 50 }}
                  >
                    <div style={invoiceHeadersStyle}>
                      <div>TO</div>
                    </div>
                    <div>
                      <h4>
                        {invoiceDocument.customerCompanyName
                          ? invoiceDocument.customerCompanyName
                          : invoiceDocument.customerFullName}
                      </h4>
                    </div>
                    <div>{invoiceDocument.customerAddress}</div>
                    <div>
                      {invoiceDocument.customerCity},{' '}
                      {invoiceDocument.customerState}
                    </div>
                    <div>{invoiceDocument.customerTelephone}</div>
                    <div>{invoiceDocument.customerEmail}</div>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={12} lg={12}>
                    <TableCard
                      classes={classes}
                      data={invoiceItems}
                    ></TableCard>
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
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={12}
                    style={{ marginTop: 40, marginBottom: 30 }}
                  >
                    <div style={invoiceHeadersStyle}>PAYMENT INSTRUCTION</div>
                    <div>{invoiceDocument.bankAccountName}</div>
                    <div>{invoiceDocument.bankAccountNumber}</div>
                    <div>{invoiceDocument.bankName}</div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={12}
                    style={{ textAlign: 'center', marginBottom: 30 }}
                  >
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
