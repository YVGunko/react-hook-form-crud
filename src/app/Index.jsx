import React from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import { Nav, Alert } from '@/_components';
import { Home } from '@/home';
import { Users } from '@/users';
import { Customers } from '@/customers';
import { Orders } from '@/orders';

import { TokenContext,  } from '@/_helpers';
import useToken from '../_helpers/Token/useToken';
import Login from '../_helpers/Login/Login';

function App() {
    const { pathname } = useLocation();  

    const { token, setToken } = useToken();
    if(!token) {
        console.log(`index loginUser, !token`);  
      return <Login setToken={setToken} />
    }
    return (
        <TokenContext.Provider value={token}>
        <div className="app-container bg-light">
            <Nav />
            <Alert />
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
        </div>
        </TokenContext.Provider>
    );
}

export { App }; 