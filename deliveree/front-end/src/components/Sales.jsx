import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* State */
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import { fetchOrders } from '../redux/features/ordersSlice';

/* Utils */
import LocalStorageMethods from '../utils/localStorage';
import formatDate from '../utils/formatDate';

export default function Sales() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orders } = useSelector((state) => state.orders);

  // fetch orders
  useEffect(() => {
    const user = LocalStorageMethods.getParsedItem('user');

    if (user) {
      dispatch(fetchOrders({
        token: user.token,
        role: user.role,
      }));
    }
  }, [dispatch]);

  return (
    <main>
      {
        orders
          && orders.map(({
            id,
            status,
            saleDate,
            totalPrice,
            deliveryAddress,
            deliveryNumber,
          }) => (
            <button
              key={ id }
              type="button"
              onClick={ () => navigate(`/seller/orders/${id}`) }
              style={ { display: 'flex', gap: '1rem' } }
            >
              <span
                data-testid={
                  `seller_orders__element-order-id-${id}`
                }
              >
                { id }
              </span>
              <span
                data-testid={
                  `seller_orders__element-delivery-status-${id}`
                }
              >
                { status }
              </span>
              <span
                data-testid={
                  `seller_orders__element-order-date-${id}`
                }
              >
                { formatDate(saleDate) }
              </span>
              <span
                data-testid={
                  `seller_orders__element-card-price-${id}`
                }
              >
                { String(Number(totalPrice).toFixed(2)).replace('.', ',') }
              </span>
              <span
                data-testid={
                  `seller_orders__element-card-address-${id}`
                }
              >
                {`${deliveryAddress}, ${deliveryNumber}`}
              </span>
            </button>
          ))
      }
    </main>
  );
}
