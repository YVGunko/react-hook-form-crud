import React from 'react';
import { NavLink } from 'react-router-dom';
import TokenContext from '../Token/Token';

function Nav() {
    const token = useContext(TokenContext);
    //TODO 
    const isOrder = token?.roles.toLowerCase().indexOf(orderLink.toLowerCase()) !== -1 ;
    const isPrice = token?.roles.toLowerCase().indexOf(priceLink.toLowerCase()) !== -1 ;
    const isOrderMaker = token?.roles.toLowerCase().indexOf("order_maker".toLowerCase()) !== -1 ;
    const isPriceMaker = token?.roles.toLowerCase().indexOf("price_maker".toLowerCase()) !== -1 ;
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <NavLink exact to="/" className="nav-item nav-link">Стиль-Пласт портал</NavLink>
                {isPrice && (<NavLink to="/users" className="nav-item nav-link">Users</NavLink>)}
                {isOrder && (<NavLink to="/customers" className="nav-item nav-link">Клиенты</NavLink>)}
                {isOrder && (<NavLink to="/orders" className="nav-item nav-link">Заказы</NavLink>)}
            </div>
        </nav>
    );
}

export { Nav };