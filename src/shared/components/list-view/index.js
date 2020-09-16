import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Container } from '../../../materials';
import Results from './Results';
import SearchToolbar from './SearchToolbar';

const ListView = ({ data, listConfig, classes, updateAlertDialogState }) => {
  const [customers] = useState(data);

  return (
    <Container maxWidth={false}>
      <SearchToolbar
        classes={classes}
        searchPlaceholder={listConfig.searchPlaceholder}
        addButtonUrl={listConfig.addButtonUrl}
        addButtonText={listConfig.addButtonText}
      />
      <Box mt={3}>
        <Results
          customers={customers}
          classes={classes}
          listConfig={listConfig}
          updateAlertDialogState={updateAlertDialogState}
        />
      </Box>
    </Container>
  );
};

ListView.propTypes = {
  updateAlertDialogState: PropTypes.func,
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  listConfig: PropTypes.object.isRequired,
  searchPlaceholder: PropTypes.string
};

export default ListView;
