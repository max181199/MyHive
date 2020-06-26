import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from './pages/main';

const App = () => {

  return (
	  <Switch>
      <Route
        path="/"
        component={Main}
        exact />
	  </Switch>
  );
};


export default App;
