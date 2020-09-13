import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  ArrowRightIcon,
  Divider
} from '../../../materialserials';

const InvoiceReceiptChart = (props) => {
  const { chartData, chartOptions } = props;
  return (
    <Card>
      <CardHeader
        title="Invoices vs Receipts"
      />
      <Divider />
      <CardContent>
        <Box  position="relative">
          <Bar data={chartData} options={chartOptions} />
        </Box>
      </CardContent>
      <Divider />
      <Box display="flex" justifyContent="flex-end" p={2}>
      <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          Activity Logs
        </Button>
      </Box>
    </Card>
  );
};

InvoiceReceiptChart.propTypes = {
  chartData: PropTypes.object,
  chartOptions: PropTypes.object
};

export default InvoiceReceiptChart;
