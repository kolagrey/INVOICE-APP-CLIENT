import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import sharedAction from '../../redux/actions/shared';
/* import TableCard from '../../shared/components/TableCard'; */
import Page from '../../shared/components/Page';
import {
  Grid,
  useTheme,
  colors
  /*  AccountBalanceIcon,
  Typography */
} from '../../materials';

import SummaryCard from './components/SummaryCard';
import InvoiceReceiptChart from './components/InvoiceReceiptChart';

const { updatePageTitle } = sharedAction;

const OverviewPage = (props) => {
  const { classes, summary, updateTitle } = props;
  const theme = useTheme();
  const data = {
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        data: [18, 5, 19, 27, 29, 19, 20],
        label: 'Invoices'
      },
      {
        backgroundColor: colors.grey[200],
        data: [11, 20, 12, 29, 30, 25, 13],
        label: 'Receipts'
      }
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  };

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
        <Grid container spacing={3}>
          {/* Summary */}
          <Grid item xs={12} md={3} lg={3}>
            <SummaryCard
              classes={classes}
              title={'Customers'}
              value={summary.users}
            />
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <SummaryCard
              classes={classes}
              title={'Shops'}
              value={summary.bounties}
            />
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <SummaryCard
              classes={classes}
              title={'Invoices'}
              value={summary.vault}
            />
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <SummaryCard
              classes={classes}
              title={'Receipts'}
              value={summary.vault}
            />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <InvoiceReceiptChart
              chartData={data}
              chartOption={options}
              classes={classes}
            />
          </Grid>
          {/*    <Grid item lg={12} md={12} xl={12} xs={12}>
            <Typography color="textPrimary" variant="h4">
              {'Most Recent Receipts'}
            </Typography>
            <TableCard
              data={tableData}
              classes={classes}
              defaultIcon={AccountBalanceIcon}
            />
          </Grid> */}
        </Grid>
      </Page>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.dashboard.loading,
    summary: state.dashboard.summary
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTitle: (payload) => dispatch(updatePageTitle(payload))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(OverviewPage);
