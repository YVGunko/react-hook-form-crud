import React from 'react';
import { Route, Switch } from 'react-router-dom';

function Analytics({ match }) {
  const { path } = match;

  return (
    <Switch>
      <Route exact path={path} component={Analytics} />
    </Switch>
  );
}

export { Analytics };
