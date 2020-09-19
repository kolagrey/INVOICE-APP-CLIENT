import React from 'react';
import PropTypes from 'prop-types';
import { history } from '../../router';
import { Button } from '../../materials';

function LinkButton({ buttonUrl, buttonClass, buttonText }) {
  const navigateTo = (url) => {
    history.push(url);
  };
  return (
    <Button
      className={buttonClass}
      variant="contained"
      onClick={() => navigateTo(buttonUrl)}
    >
      {buttonText}
    </Button>
  );
}

LinkButton.propTypes = {
  buttonUrl: PropTypes.string.isRequired,
  buttonClass: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired
};

export default LinkButton;
