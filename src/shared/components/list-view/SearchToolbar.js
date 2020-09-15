import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  SvgIcon
} from '../../../materials';
import { Search as SearchIcon } from 'react-feather';

const SearchToolbar = ({ classes, placeholder }) => {
  return (
    <div>
      <Box display="flex" justifyContent="flex-end">
        <Button className={classes.submit} variant="contained">
          Add Customer
        </Button>
      </Box>
      <Box mt={3}>
        <Box maxWidth={500}>
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon fontSize="small" color="action">
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            placeholder={placeholder}
            variant="outlined"
          />
        </Box>
      </Box>
    </div>
  );
};

SearchToolbar.propTypes = {
  className: PropTypes.string
};

export default SearchToolbar;
