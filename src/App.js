import React from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { deepPurple, grey } from '@material-ui/core/colors';
import { SnackbarProvider } from 'notistack';

import { Router, history } from './router';
import { auth } from './services/firebase';
import authActions from './redux/actions/auth';
import profileActions from './redux/actions/profile';

const { logOutUser } = authActions;
const { getUserProfile } = profileActions;

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: deepPurple[700]
    },
    primary: {
      main: grey[900]
    }
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: ['"Lato"', 'sans-serif'].join(',')
  }
});

export const ConfigContext = React.createContext();
const configValue = {
  showDialog: false
};

class App extends React.Component {
  componentDidMount() {
    auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await this.props.logOut();
      } else {
        await this.props.getUserProfile(user.uid);
        history.push('/dashboard');
      }
    });
  }

  componentWillUnmount() {
    this.props.logOut();
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <ConfigContext.Provider value={configValue}>
          <SnackbarProvider maxSnack={3}>
            <Router />
          </SnackbarProvider>
        </ConfigContext.Provider>
      </ThemeProvider>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(logOutUser()),
    getUserProfile: (id) => dispatch(getUserProfile(id))
  };
};

export default connect(null, mapDispatchToProps)(App);
