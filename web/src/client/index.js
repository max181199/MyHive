import '@babel/polyfill';
import 'whatwg-fetch';
import 'sanitize.css/sanitize.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/app';
import { MuiThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

import { StylesProvider } from '@material-ui/core/styles';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1976d2'
    }
  }
});

theme = responsiveFontSizes(theme);

import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <StylesProvider injectFirst>
        <MuiThemeProvider theme = { theme }>
          <App />
        </MuiThemeProvider>
      </StylesProvider>
    </Router>
  </Provider>,
  document.getElementById('app')
);
