import React, { useState } from 'react';
import { Box, Container } from '../../../materials';
import Results from './Results';
import Toolbar from './Toolbar';

const ListView = ({ data, classes }) => {
  const [customers] = useState(data);

  return (
    <Container maxWidth={false}>
      <Toolbar classes={classes} />
      <Box mt={3}>
        <Results customers={customers} classes={classes} />
      </Box>
    </Container>
  );
};

export default ListView;
