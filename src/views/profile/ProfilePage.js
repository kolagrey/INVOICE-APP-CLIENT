import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Grid } from '../../materials';
import Page from '../../shared/components/Page';

import { formatFullName } from '../../shared/utils';
import Profile from '../../shared/components/user-profile/Profile';
import ProfileDetails from '../../shared/components/user-profile/ProfileDetails';

import profileActions from '../../redux/actions/profile';
import sharedAction from '../../redux/actions/shared';
const { updatePageTitle } = sharedAction;
const {
  updateProfileAvatar,
  updateUserProfileInformation,
  clearProfileError
} = profileActions;

const ProfilePage = (props) => {
  const {
    classes,
    error,
    user,
    success,
    updateTitle,
    updateUserProfileInformation,
    updateAvatar,
    clearError
  } = props;

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    updateTitle('Account Profile');
    if (error && error.message) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    if (success) {
      enqueueSnackbar('Profile saved successfully!', { variant: 'success' });
    }
    return () => {
      clearError();
    };
  }, [error, success, enqueueSnackbar, clearError, updateTitle]);

  return (
    <Page className={classes.root} title="Invoice App | My Profile">
      <Grid container spacing={3}>
        <Grid item lg={3} md={4} xs={12}>
          <Profile
            classes={classes}
            user={user}
            formatFullName={formatFullName}
            updateAvatar={updateAvatar}
            errorMessage={error ? error.messagge : null}
          />
        </Grid>
        <Grid item lg={9} md={8} xs={12}>
          <ProfileDetails
            classes={classes}
            user={user}
            updateUserProfileInformation={updateUserProfileInformation}
            errorMessage={error ? error.messagge : null}
          />
        </Grid>
      </Grid>
    </Page>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.profile.user,
    error: state.profile.profileUpdateError,
    success: state.profile.success
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTitle: (payload) => {
      return dispatch(updatePageTitle(payload));
    },
    updateAvatar: (payload) => dispatch(updateProfileAvatar(payload)),
    updateUserProfileInformation: (payload) =>
      dispatch(updateUserProfileInformation(payload)),
    clearError: () => dispatch(clearProfileError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
