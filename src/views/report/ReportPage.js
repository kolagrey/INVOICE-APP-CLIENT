import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Page from '../../shared/components/Page';
import { updatePageTitle } from '../../redux/actions/shared/sharedActions';
import { MenuItem, Typography } from '../../materials';
import {
  SelectValidator,
  ValidatorForm
} from 'react-material-ui-form-validator';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0, 3)
  },
  paper: {
    maxWidth: 400,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2)
  }
}));

const ReportPage = ({ updateTitle }) => {
  const classes = useStyles();
  const [report, setReport] = React.useState({
    status: 'Paid',
    period: 2020
  });
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setReport((prev) => ({
      ...prev,
      [name]: value
    }));
    setHelperText(' ');
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ report });
    if (report.status === 'Paid') {
      setHelperText('Report feature is still pending...');
      setError(false);
    } else if (report.status === 'Pending') {
      setHelperText('Report feature is still pending...');
      setError(true);
    } else {
      setHelperText('Please select an option.');
      setError(true);
    }
  };

  useEffect(() => {
    updateTitle('Reporting');
  }, [updateTitle]);

  return (
    <Page className={classes.root} title="Billing App | Reporting Tool">
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item xs>
              <ValidatorForm
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
                className={classes.loginRoot}
              >
                <FormControl
                  component="fieldset"
                  error={error}
                  className={classes.formControl}
                >
                  <Typography variant="h6">
                    I would like to generate report for
                  </Typography>
                  <RadioGroup
                    aria-label="status"
                    name="status"
                    value={report.status}
                    onChange={onInputChange}
                  >
                    <FormControlLabel
                      value="Paid"
                      control={<Radio />}
                      label="Paid Customers"
                    />
                    <FormControlLabel
                      value="Pending"
                      control={<Radio />}
                      label="Owing Customers"
                    />
                  </RadioGroup>
                  <SelectValidator
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={report.period}
                    onChange={onInputChange}
                    validators={['required']}
                    errorMessages={['Period is required']}
                    id="period"
                    label="Period"
                    name="period"
                  >
                    <MenuItem value={2019}>2019</MenuItem>
                    <MenuItem value={2020}>2020</MenuItem>
                    <MenuItem value={2021}>2021</MenuItem>
                    <MenuItem value={2022}>2022</MenuItem>
                  </SelectValidator>
                  <FormHelperText>{helperText}</FormHelperText>
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                  >
                    Generate Report
                  </Button>
                </FormControl>
              </ValidatorForm>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </Page>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTitle: (payload) => {
      return dispatch(updatePageTitle(payload));
    }
  };
};

export default connect(null, mapDispatchToProps)(ReportPage);
