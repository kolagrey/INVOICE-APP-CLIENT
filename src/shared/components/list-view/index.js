import React, { useState } from 'react';
import { Box, Container } from '../../../materials';
import Results from './Results';
import SearchToolbar from './SearchToolbar';

const ListView = ({ data, listConfig, classes, searchPlaceholder }) => {
  const [customers] = useState(data);

  return (
    <Container maxWidth={false}>
      <SearchToolbar
        classes={classes}
        placeholder={listConfig.searchPlaceholder}
      />
      <Box mt={3}>
        <Results
          customers={customers}
          classes={classes}
          listConfig={listConfig}
        />
      </Box>
    </Container>
  );
};

export default ListView;
