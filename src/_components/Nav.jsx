import React from 'react';
import { NavLink } from 'react-router-dom';

function Nav() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <NavLink exact to="/" className="nav-item nav-link">Home</NavLink>
                <NavLink to="/users" className="nav-item nav-link">Users</NavLink>
                <NavLink to="/customers" className="nav-item nav-link">Клиенты</NavLink>
                <NavLink to="/orders" className="nav-item nav-link">Заказы</NavLink>
            </div>
        </nav>
    );
}

export { Nav };