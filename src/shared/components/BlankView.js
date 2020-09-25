import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Grid, Typography, Box } from '../../materials';
import LinkButton from './LinkButton';
const BlankView = ({
  NoDataIcon,
  showAddButton,
  addButtonText,
  addButtonUrl,
  title,
  classes
}) => {
  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <Grid item>
          <Avatar src={NoDataIcon} className={classes.viewPlaceholderImg} />
        </Grid>
        <Grid item>
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
      {showAddButton && (
        <Grid item>
          <Box display="flex" justifyContent="flex-end">
            <LinkButton
              buttonUrl={addButtonUrl}
              buttonText={addButtonText}
              buttonClass={classes.submit}
            />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

BlankView.propTypes = {
  NoDataIcon: PropTypes.any,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  showAddButton: PropTypes.bool.isRequired,
  addButtonText: PropTypes.string,
  addButtonUrl: PropTypes.string
};

export default BlankView;
