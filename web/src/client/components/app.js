import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from './pages/main';
import HelpPage from './pages/helpPage';

const App = () => {

  return (
	  <Switch>
      <Route
        path="/"
        component={Main}
        exact />
      <Route
        path="/help"
        component={HelpPage}
        exact />
	  </Switch>
    
  );
};


export default App;
