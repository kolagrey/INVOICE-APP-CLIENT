import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../../../materials';
import Results from './Results';
import SearchToolbar from './SearchToolbar';

const ListView = React.memo(
  ({ data, listConfig, classes, updateAlertDialogState, download }) => {
    return (
      <React.Fragment>
        {listConfig.showSearchToolbar && (
          <SearchToolbar
            download={download}
            classes={classes}
            searchPlaceholder={listConfig.searchPlaceholder}
            addButtonUrl={listConfig.addButtonUrl}
            downloadButtonUrl={listConfig.downloadButtonUrl}
            downloadButtonText={listConfig.downloadButtonText}
            addButtonText={listConfig.addButtonText}
            searchAction={listConfig.searchAction}
          />
        )}
        <Box mt={3}>
          <Results
            data={data}
            classes={classes}
            listConfig={listConfig}
            updateAlertDialogState={updateAlertDialogState}
          />
        </Box>
      </React.Fragment>
    );
  }
);

ListView.propTypes = {
  updateAlertDialogState: PropTypes.func,
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  listConfig: PropTypes.object.isRequired,
  searchPlaceholder: PropTypes.string
};

export default ListView;
