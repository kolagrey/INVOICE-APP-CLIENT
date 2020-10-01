import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import sharedAction from '../../redux/actions/shared';
import Page from '../../shared/components/Page';
import {
  Grid,
  useTheme,
  colors,
  CircularProgress,
  AccountBalanceWalletIcon,
  MoneyIcon,
  StoreIcon,
  PeopleIcon
} from '../../materials';

import SummaryCard from './components/SummaryCard';
import InvoiceReceiptChart from './components/InvoiceReceiptChart';
import {
  DASHBOARD_CHART_COLLECTION,
  DASHBOARD_SUMMARY_COLLECTION
} from '../../firebase-helpers/constants/collectionsTypes';
import { DASHBOARD_SUMMARY_ID } from '../../shared/constants';
import { db } from '../../services/firebase';
import useData from '../../shared/hooks/useData';
import { getTotalMonthValue } from '../../shared/utils/sortUtils';

const { updatePageTitle } = sharedAction;

const OverviewPage = (props) => {
  const { classes, updateTitle } = props;
  const theme = useTheme();
  const [data, loading] = useData(DASHBOARD_CHART_COLLECTION, useState);

  const [summary, setSummary] = useState({
    customers: 0,
    shops: 0,
    invoices: 0,
    receipts: 0
  });

  const [chart, setChart] = useState({
    datasets: [],
    labels: []
  });

  const deriveChartData = (dashboardChartData) => {
    const invoiceData = [];
    const receiptData = [];
    const year = new Date().getFullYear();
    const dataSet = [...dashboardChartData];
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((month) => {
      const entity = 'invoice';
      invoiceData.push(getTotalMonthValue({ month, year, entity, dataSet }));
    });

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((month) => {
      const entity = 'receipt';
      receiptData.push(getTotalMonthValue({ month, year, entity, dataSet }));
    });
    return [invoiceData, receiptData];
  };

  useEffect(() => {
    const documentDocRef = db
      .collection(DASHBOARD_SUMMARY_COLLECTION)
      .doc(DASHBOARD_SUMMARY_ID);
    documentDocRef.get().then((documentDoc) => {
      const documentData = documentDoc.data();
      setSummary((prevState) => ({
        ...prevState,
        ...documentData
      }));
    });
  }, []);

  useEffect(() => {
    const [invoiceData, receiptData] = deriveChartData(data);
    setChart({
      data: deriveChartData(data),
      datasets: [
        {
          backgroundColor: colors.indigo[500],
          data: invoiceData,
          label: 'Invoices'
        },
        {
          backgroundColor: colors.grey[200],
          data: receiptData,
          label: 'Receipts'
        }
      ],
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    });
  }, [data]);

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider
          }
        }
      ]
    },
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  useEffect(() => {
    updateTitle('Overview');
    window.scrollTo(0, 0);
  }, [updateTitle]);

  return (
    <React.Fragment>
      <Page className={classes.root} title="Billing App | Overview">
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {/* Summary */}
            <Grid item xs={12} md={3} lg={3}>
              <SummaryCard
                Icon={PeopleIcon}
                classes={classes}
                title={'Customers'}
                value={summary.customers}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <SummaryCard
                Icon={StoreIcon}
                classes={classes}
                title={'Shops'}
                value={summary.shops}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <SummaryCard
                Icon={MoneyIcon}
                classes={classes}
                title={'Invoices'}
                value={summary.invoices}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <SummaryCard
                Icon={AccountBalanceWalletIcon}
                classes={classes}
                title={'Receipts'}
                value={summary.receipts}
              />
            </Grid>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <InvoiceReceiptChart
                chartData={chart}
                chartOption={options}
                classes={classes}
              />
            </Grid>
          </Grid>
        )}
      </Page>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTitle: (payload) => dispatch(updatePageTitle(payload))
  };
};
export default connect(null, mapDispatchToProps)(OverviewPage);
