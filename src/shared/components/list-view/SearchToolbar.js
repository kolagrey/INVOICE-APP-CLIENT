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
import { Link } from 'react-router-dom';

const SearchToolbar = ({
  classes,
  searchPlaceholder,
  addButtonText,
  addButtonUrl
}) => {
  return (
    <div>
      <Box display="flex" justifyContent="flex-end">
        <Link
          to={`${addButtonUrl}/document`}
          style={{ textDecoration: 'none' }}
        >
          <Button className={classes.submit} variant="contained">
            {addButtonText}
          </Button>
        </Link>
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
            placeholder={searchPlaceholder}
            variant="outlined"
          />
        </Box>
      </Box>
    </div>
  );
};

SearchToolbar.propTypes = {
  className: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  addButtonUrl: PropTypes.string,
  addButtonText: PropTypes.string
};

export default SearchToolbar;
