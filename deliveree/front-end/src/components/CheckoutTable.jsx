import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/* State */
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, updateTotalPrice } from '../redux/features/checkoutSlice';
import { updateProductQty } from '../redux/features/productsSlice';

/* Utils */
import calculateTotalPrice from '../utils/calculateTotalPrice';

export default function CheckoutTable({ data }) {
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.checkout);

  const handleRemoveItem = (productId) => {
    // reset product quantity
    dispatch(updateProductQty({ id: productId, newQty: 0 }));

    // remove product from cart
    dispatch(removeItem(productId));
  };

  // update total price
  useEffect(() => {
    const updatedTotalPrice = calculateTotalPrice(cart);

    dispatch(updateTotalPrice(updatedTotalPrice));
  }, [dispatch, cart]);

  return (
    <table>
      <thead>
        <tr>
          {
            data.header.map((heading) => (
              <td key={ heading }>
                <span>{ heading }</span>
              </td>
            ))
          }
        </tr>
      </thead>

      <tbody>
        {
          data.body.map(({ id, name, quantity, price, subTotal }, index) => (
            <tr key={ id }>
              <td
                data-testid={
                  `customer_checkout__element-order-table-item-number-${index}`
                }
              >
                { index + 1 }
              </td>
              <td
                data-testid={
                  `customer_checkout__element-order-table-name-${index}`
                }
              >
                { name }
              </td>
              <td
                data-testid={
                  `customer_checkout__element-order-table-quantity-${index}`
                }
              >
                { quantity }
              </td>
              <td
                data-testid={
                  `customer_checkout__element-order-table-unit-price-${index}`
                }
              >
                { String(Number(price).toFixed(2)).replace('.', ',') }
              </td>
              <td
                data-testid={
                  `customer_checkout__element-order-table-sub-total-${index}`
                }
              >
                { String(Number(subTotal).toFixed(2)).replace('.', ',') }
              </td>
              <td>
                <button
                  data-testid={
                    `customer_checkout__element-order-table-remove-${index}`
                  }
                  type="button"
                  onClick={ () => handleRemoveItem(id) }
                >
                  Remove Item
                </button>
              </td>
            </tr>
          ))
        }
      </tbody>

      <tfoot>
        <tr>
          {
            data.footer.map((value, index) => {
              if (index === 0) {
                return (
                  <td key={ value }>
                    <span>{ value }</span>
                    :
                    {' '}
                  </td>
                );
              }

              return (
                <td
                  data-testid="customer_checkout__element-order-total-price"
                  key={ value }
                >
                  { value }
                </td>
              );
            })
          }
        </tr>
      </tfoot>
    </table>
  );
}

CheckoutTable.propTypes = {
  data: PropTypes.shape({
    header: PropTypes.arrayOf(PropTypes.string),
    body: PropTypes.arrayOf(PropTypes.string),
    footer: PropTypes.arrayOf(PropTypes.string),
  }),
}.isRequired;
