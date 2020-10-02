import React from 'react';
import PropTypes from 'prop-types';

function ReportView({ classes, data }) {
  return (
    <div>
      <h1>Report View</h1>
    </div>
  );
}

ReportView.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.array.isRequired
};

export default ReportView;
