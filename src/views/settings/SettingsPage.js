import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Grid } from '../../materials';
import Page from '../../shared/components/Page';

import CompanyAvatar from '../../shared/components/settings-profile/CompanyAvatar';
import SettingsDetails from '../../shared/components/settings-profile/SettingsDetails';

import settingsActions from '../../redux/actions/settings';
import sharedAction from '../../redux/actions/shared';
const { updatePageTitle } = sharedAction;
const {
  updateCompanyAvatar,
  updateCompanySettings,
  clearSettingsError
} = settingsActions;

const SettingsPage = (props) => {
  const {
    classes,
    error,
    data,
    success,
    updateTitle,
    updateSettings,
    updateAvatar,
    clearError
  } = props;

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    updateTitle('Settings');
    if (error && error.message) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    if (success) {
      enqueueSnackbar('Settings saved successfully!', { variant: 'success' });
    }
    return () => {
      clearError();
    };
  }, [error, success, enqueueSnackbar, clearError, updateTitle]);

  return (
    <Page className={classes.root} title="Invoice App | Settings">
      <Grid container spacing={3}>
        <Grid item lg={12} md={12} xs={12}>
          <CompanyAvatar
            classes={classes}
            data={data}
            updateAvatar={updateAvatar}
            errorMessage={error ? error.messagge : null}
          />
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <SettingsDetails
            classes={classes}
            data={data}
            updateSettings={updateSettings}
            errorMessage={error ? error.messagge : null}
          />
        </Grid>
      </Grid>
    </Page>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.settings.settings,
    error: state.settings.settingsUpdateError,
    success: state.settings.success
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTitle: (payload) => {
      return dispatch(updatePageTitle(payload));
    },
    updateAvatar: (payload) => dispatch(updateCompanyAvatar(payload)),
    updateSettings: (payload) => dispatch(updateCompanySettings(payload)),
    clearError: () => dispatch(clearSettingsError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
