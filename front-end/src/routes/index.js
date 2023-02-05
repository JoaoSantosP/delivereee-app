import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* Children */
import Base from '../components/Base';
import Checkout from '../components/Checkout';
import CustomerProducts from '../components/CustomerProducts';
import Login from '../components/Login';
import NavBar from '../components/NavBar';
import OrderDetails from '../components/OrderDetails';
import Orders from '../components/Orders';
import Register from '../components/Register';
import SaleDetails from '../components/SaleDetails';
import Sales from '../components/Sales';

function AppRoutes() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/seller/orders/:id" element={ <SaleDetails /> } />
        <Route path="/seller/orders" element={ <Sales /> } />
        <Route path="/customer/orders/:id" element={ <OrderDetails /> } />
        <Route path="/customer/orders" element={ <Orders /> } />
        <Route path="/customer/checkout" element={ <Checkout /> } />
        <Route path="/customer/products" element={ <CustomerProducts /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/" element={ <Base /> } />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
