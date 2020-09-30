import React from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar
} from '../../../materials';
import { k_formatter } from '../../../shared/utils';

const SummaryCard = (props) => {
  const { classes, title, value, Icon } = props;
  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Grid container justify="space-between" spacing={3}>
            <Grid item>
              <Typography color="textSecondary" gutterBottom variant="h6">
                {title}
              </Typography>
              <Typography color="textPrimary" variant="h5">
                {k_formatter(value)}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar}>
                <Icon />
              </Avatar>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default SummaryCard;
