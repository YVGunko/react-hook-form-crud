import React from 'react';
import {
  Route, Switch, Redirect, useLocation,
} from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ConfirmProvider } from "material-ui-confirm";

import { Nav, Alert } from '@/_components';
import { Home } from '@/home';
import { Users } from '@/users';
import { Customers } from '@/customers';
import { Orders } from '@/orders';

import { TokenContext } from '@/_helpers';
import useToken from '../_helpers/Token/useToken';
import Login from '../_helpers/Login/Login';

function App() {
  const { pathname } = useLocation();

  const { token, setToken } = useToken();
  if (!token) {
    return <Login setToken={setToken} />;
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ConfirmProvider
      defaultOptions={{ title: "Вы уверены ?",
        confirmationButtonProps: { autoFocus: true },
      }} >
      <TokenContext.Provider value={token}>
        <>
          <CssBaseline />
          <Nav />
          <div className="container pt-4 pb-4">
            <Switch>
              <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
              <Route exact path="/" component={Home} />
              <Route path="/users" component={Users} />
              <Route path="/customers" component={Customers} />
              <Route path="/orders" component={Orders} />
              <Redirect from="*" to="/" />
            </Switch>
          </div>
          <Alert />
        </>
      </TokenContext.Provider>
      </ConfirmProvider>
    </LocalizationProvider>
  );
}

export { App };
