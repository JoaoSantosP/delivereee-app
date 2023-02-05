import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* State */
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  fetchOrders,
  markAsPreparing,
  markAsDispatched,
} from '../redux/features/ordersSlice';

/* Utils */
import LocalStorageMethods from '../utils/localStorage';
import formatDate from '../utils/formatDate';

/* Children */
import SaleTable from './SaleTable';

export default function SaleDetails() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const orderId = pathname.substring(pathname.lastIndexOf('/') + 1);

  // order details
  const order = useSelector(
    (state) => state.orders.orders.find((o) => o.id === Number(orderId)),
  );

  // mark as preparing
  const handleMarkAsPreparing = () => {
    const user = LocalStorageMethods.getParsedItem('user');
    if (user) {
      dispatch(markAsPreparing({
        token: user.token,
        role: user.role,
        orderId,
      }));
    }
  };

  // mark as out for delivery
  const handleMarkAsDispatched = () => {
    const user = LocalStorageMethods.getParsedItem('user');
    if (user) {
      dispatch(markAsDispatched({
        token: user.token,
        role: user.role,
        orderId,
      }));
    }
  };

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

  // data-testid
  const labelTestIdPrefix = 'seller_order_details__element-order-details-label-';

  return (
    <main>
      <div>
        {
          order
            && (
              <>
                <span
                  data-testid={ `${labelTestIdPrefix}order-id` }
                >
                  { Number(orderId) }
                </span>
                <span
                  data-testid={ `${labelTestIdPrefix}order-date` }
                >
                  { formatDate(order.saleDate) }
                </span>
                <span
                  data-testid={ `${labelTestIdPrefix}delivery-status` }
                >
                  { order.status }
                </span>
              </>
            )
        }

        <button
          data-testid="seller_order_details__button-preparing-check"
          type="button"
          disabled={ order && order.status !== 'Pendente' }
          onClick={ handleMarkAsPreparing }
        >
          Start Preparing
        </button>

        <button
          data-testid="seller_order_details__button-dispatch-check"
          type="button"
          disabled={ order && order.status !== 'Preparando' }
          onClick={ handleMarkAsDispatched }
        >
          Mark as Out For Delivery
        </button>
      </div>

      {
        order && (
          <SaleTable
            data={ {
              header: ['Item', 'Name', 'Quantity', 'Unit Value', 'Sub-total'],
              body: order.products,
              footer: ['Total', order.totalPrice],
            } }
          />
        )
      }
    </main>
  );
}
