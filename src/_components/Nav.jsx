/* eslint-disable linebreak-style */
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { TokenContext, orderLink, priceLink } from '@/_helpers';

function Nav() {
  const token = useContext(TokenContext);
  // TODO
  const isOrder = token?.roles.toLowerCase().indexOf(orderLink.toLowerCase()) !== -1;
  const isPrice = token?.roles.toLowerCase().indexOf(priceLink.toLowerCase()) !== -1;
  const isOrderMaker = token?.roles.toLowerCase().indexOf('order_maker'.toLowerCase()) !== -1;
  const isPriceMaker = token?.roles.toLowerCase().indexOf('price_maker'.toLowerCase()) !== -1;
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="navbar-nav">
        <NavLink exact to="/" className="nav-item nav-link">Стиль-Пласт портал</NavLink>
        {isOrder && (<NavLink to="/orders" className="nav-item nav-link">Заказы</NavLink>)}
      </div>
    </nav>
  );
}

export { Nav };
