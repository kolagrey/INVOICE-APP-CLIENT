import React from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, InputAdornment, SvgIcon } from '../../../materials';
import { Search as SearchIcon } from 'react-feather';
import LinkButton from '../LinkButton';

const SearchToolbar = ({
  classes,
  searchAction,
  searchPlaceholder,
  addButtonText,
  addButtonUrl
}) => {
  return (
    <React.Fragment>
      <Box display="flex" justifyContent="flex-end">
        <LinkButton
          buttonUrl={addButtonUrl}
          buttonText={addButtonText}
          buttonClass={classes.submit}
        />
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
            onChange={(e) => searchAction(e.target.value)}
            placeholder={searchPlaceholder}
            variant="outlined"
          />
        </Box>
      </Box>
    </React.Fragment>
  );
};

SearchToolbar.propTypes = {
  className: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  searchAction: PropTypes.func,
  addButtonUrl: PropTypes.string,
  addButtonText: PropTypes.string
};

export default SearchToolbar;
