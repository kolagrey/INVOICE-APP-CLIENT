import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/react';

import {
  Avatar,
  Button,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Card,
  CardActions,
  CardContent
} from '../../../materials';

const CompanyAvatar = (props) => {
  const {
    classes,
    data,
    updateAvatar,
    success,
    clearError,
    errorMessage,
    ...rest
  } = props;

  const fileInputRef = React.createRef();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    avatar: data.avatar
  });

  const onCameraFilesChange = ({ target }) => {
    const fileList = target.files;
    if (!fileList.length) return;
    if (fileList[0].size / 1000000 > 1) {
      enqueueSnackbar('Image file too large. Must be 1MB or less.', {
        variant: 'error'
      });
      return;
    } else {
      const fileUrl = URL.createObjectURL(fileList[0]);
      setProfile({
        avatar: fileUrl
      });
      const file = fileList[0];
      const name = fileList[0].name.split('.');
      const fileName = `${data.id}.${name[name.length - 1]}`;
      onUpdateAvatar(fileName, file);
    }
  };

  const onUpdateAvatar = async (fileName, file) => {
    setLoading(true);
    try {
      await updateAvatar({
        id: data.id,
        fileName,
        file
      });
      setLoading(false);
    } catch (error) {
      // TODO: Use error logging strategy
      setLoading(false);
      Sentry.captureException(error);
    }
  };

  return (
    <Card className={classes.card} {...rest}>
      <CardContent>
        <Box alignItems="center" display="flex" flexDirection="column">
          <Avatar
            className={classes.profileAvatar}
            src={profile.avatar}
            onClick={() => fileInputRef.current.click()}
          />
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          type="file"
          onChange={onCameraFilesChange}
        />
        <Button
          color="primary"
          fullWidth
          variant="text"
          onClick={() => fileInputRef.current.click()}
        >
          {!loading ? 'Upload Logo' : <CircularProgress />}
        </Button>
      </CardActions>
      {errorMessage && (
        <Typography color="textSecondary" variant="body1">
          {errorMessage}
        </Typography>
      )}
    </Card>
  );
};

CompanyAvatar.propTypes = {
  classes: PropTypes.object,
  success: PropTypes.bool,
  errorMessage: PropTypes.string,
  clearError: PropTypes.func,
  data: PropTypes.object,
  updateAvatar: PropTypes.func
};

export default CompanyAvatar;
