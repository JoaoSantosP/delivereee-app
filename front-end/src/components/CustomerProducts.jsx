import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

/* Utils */
import LocalStorageMethods from '../utils/localStorage';

/* State */
import {
  setProducts,
  fetchProducts,
  updateProductQty,
} from '../redux/features/productsSlice';

import {
  setCart,
  updateTotalPrice,
} from '../redux/features/checkoutSlice';

/* Services */
import generateCart from '../utils/generateCart';
import calculateTotalPrice from '../utils/calculateTotalPrice';

export default function CustomerProducts() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { cart, totalPrice } = useSelector((state) => state.checkout);

  // set products
  useEffect(() => {
    const user = LocalStorageMethods.getParsedItem('user');
    const localProducts = LocalStorageMethods.getParsedItem('products');

    if (user) {
      if (localProducts) {
        dispatch(setProducts(localProducts));
      } else {
        dispatch(fetchProducts(user.token));
      }
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  // update cart
  useEffect(() => {
    const updatedCart = generateCart(products);

    dispatch(setCart(updatedCart));
  }, [dispatch, products]);

  // update total price
  useEffect(() => {
    const updatedTotalPrice = calculateTotalPrice(cart);

    dispatch(updateTotalPrice(updatedTotalPrice));
  }, [cart, dispatch]);

  // controls
  const increment = (quantity, id) => {
    const newQty = quantity + 1;
    dispatch(updateProductQty({ id, newQty }));
  };

  const decrement = (quantity, id) => {
    const newQty = quantity - 1 < 0 ? 0 : quantity - 1;
    dispatch(updateProductQty({ id, newQty }));
  };

  const setQuantity = (id, value) => {
    const newQty = Number(value);
    dispatch(updateProductQty({ id, newQty }));
  };

  return (
    <section>
      {
        products.map(({ id, urlImage, name, price, quantity }) => (
          <div key={ id }>
            <img
              data-testid={
                `customer_products__img-card-bg-image-${id}`
              }
              src={ urlImage }
              alt="Product"
              style={ { maxWidth: '100px' } }
            />

            <h3
              data-testid={
                `customer_products__element-card-title-${id}`
              }
            >
              { name }
            </h3>

            <span
              data-testid={
                `customer_products__element-card-price-${id}`
              }
            >
              { String(price).replace('.', ',') }
            </span>

            <button
              type="button"
              data-testid={
                `customer_products__button-card-rm-item-${id}`
              }
              onClick={ () => decrement(quantity, id) }
            >
              Decrement
            </button>

            <input
              type="number"
              data-testid={
                `customer_products__input-card-quantity-${id}`
              }
              min="0"
              value={ quantity }
              onChange={ (e) => setQuantity(id, e.target.value) }
            />

            <button
              type="button"
              data-testid={
                `customer_products__button-card-add-item-${id}`
              }
              onClick={ () => increment(quantity, id) }
            >
              Increment
            </button>
          </div>
        ))
      }

      <div>
        <span
          data-testid="customer_products__checkout-bottom-value"
        >
          { String(totalPrice.toFixed(2)).replace('.', ',') }
        </span>

        <button
          type="button"
          data-testid="customer_products__button-cart"
          disabled={ !totalPrice }
          onClick={ () => navigate('/customer/checkout') }
        >
          Checkout
        </button>
      </div>
    </section>
  );
}
