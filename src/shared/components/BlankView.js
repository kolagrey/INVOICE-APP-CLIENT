import React from 'react';
import PropTypes from 'prop-types';
import { NoDataIcon } from '../../assets';
import { Avatar, Box, Button, Grid, Link, Typography } from '../../materials';
function BlankView({
  showAddButton,
  addButtonText,
  addButtonUrl,
  title,
  classes
}) {
  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item alignItems="center">
        <Grid item alignItems="center">
          <Avatar src={NoDataIcon} className={classes.viewPlaceholderImg} />
        </Grid>
        <Grid item alignItems="center">
          <Typography
            gutterBottom
            variant="h6"
            component="h6"
            align="center"
            style={{ marginTop: 30 }}
          >
            {title} Not Found!
          </Typography>
        </Grid>
      </Grid>
      <Grid item alignItems="center">
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
      </Grid>
    </Grid>
  );
}

BlankView.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  showAddButton: PropTypes.bool.isRequired,
  addButtonText: PropTypes.string,
  addButtonUrl: PropTypes.string
};

export default BlankView;
