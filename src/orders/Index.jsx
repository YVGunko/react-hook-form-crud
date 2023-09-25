import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { AddEdit } from './AddEdit';
import { Content } from './Content';

function Orders({ match }) {
  const { path } = match;

  return (
    <Switch>
      <Route exact path={path} component={List} />
      <Route path={`${path}/add`} component={AddEdit} />
      <Route path={`${path}/edit/:id`} component={AddEdit} />
      <Route path={`${path}/view/:id`} component={Content} />
    </Switch>
  );
}

export { Orders };
