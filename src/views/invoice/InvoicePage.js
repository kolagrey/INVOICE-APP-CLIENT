import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import { updatePageTitle } from '../../redux/actions/shared/sharedActions';
import Page from '../../shared/components/Page';

const InvoicePage = ({ classes, updateTitle }) => {
  const { id: documentId } = useParams();
  const [invoiceDocument, setInvoiceDocument] = useState({});
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const invoiceHeadersStyle = {
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
      const invoiceList = documentData.invoiceItemsList || [];
      setInvoiceItems(
        invoiceList.map((item, index) => {
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

  useEffect(() => {
    updateTitle(
      `Invoice ${
        invoiceDocument.invoiceNumber ? invoiceDocument.invoiceNumber : ''
      }`
    );
  }, [updateTitle, invoiceDocument.invoiceNumber]);

  return (
    <Page
      title={`Billing App | Invoice ${
        invoiceDocument.invoiceNumber ? invoiceDocument.invoiceNumber : ''
      }`}
    >
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
                    style={{ textAlign: 'right', marginBottom: 50 }}
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
                    <Grid container spacing={1}>
                      <TableContainer style={{ marginRight: 15 }}>
                        <Table aria-label="card table">
                          <TableBody>
                            <TableRow>
                              <TableCell
                                align="right"
                                style={{ borderBottom: '1px solid #000' }}
                              >
                                <h4>SubTotal</h4>
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{ borderBottom: '1px solid #000' }}
                              >
                                <h3>
                                  NGN
                                  {currencyFormatter(invoiceDocument.totalCost)}
                                </h3>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="right"
                                style={{ borderBottom: '1px solid #000' }}
                              >
                                <h4>VAT</h4>
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{ borderBottom: '1px solid #000' }}
                              >
                                <h3>{invoiceDocument.vat}%</h3>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="right"
                                style={{ borderBottom: '1px solid #000' }}
                              >
                                <h4>VAT Value</h4>
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{ borderBottom: '1px solid #000' }}
                              >
                                <h3>
                                  NGN
                                  {currencyFormatter(invoiceDocument.vatValue)}
                                </h3>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="right"
                                style={{ borderBottom: '1px solid #000' }}
                              >
                                <h4>Grand Total</h4>
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{ borderBottom: '1px solid #000' }}
                              >
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
                    xs={6}
                    md={6}
                    lg={6}
                    style={{
                      marginTop: 40,
                      marginBottom: 30,
                      textAlign: 'left'
                    }}
                  >
                    <div style={invoiceHeadersStyle}>PAYMENT INSTRUCTION</div>
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                      {invoiceDocument.bankAccountName}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                      {invoiceDocument.bankAccountNumber}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                      {invoiceDocument.bankName}
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={6}
                    lg={6}
                    style={{
                      marginTop: 40,
                      marginBottom: 30,
                      textAlign: 'right'
                    }}
                  >
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                      &nbsp;
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                      &nbsp;
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                      &nbsp;
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                      Authorized Signature
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={12}
                    style={{
                      textAlign: 'center',
                      marginBottom: 30,
                      border: '1px solid #000',
                      padding: 10
                    }}
                  >
                    <i>{invoiceDocument.note}</i>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Page>
  );
};

InvoicePage.propTypes = {
  classes: PropTypes.object
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTitle: (payload) => {
      return dispatch(updatePageTitle(payload));
    }
  };
};

export default connect(null, mapDispatchToProps)(InvoicePage);
