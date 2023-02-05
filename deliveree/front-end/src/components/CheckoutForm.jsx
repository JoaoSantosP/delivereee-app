import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* State */
import { useDispatch, useSelector } from 'react-redux';

/* Services */
import { getAllSellers, createSale } from '../services/request';
import { clearProducts } from '../redux/features/productsSlice';
import { clearCart } from '../redux/features/checkoutSlice';

function CheckoutForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sellers, setSellers] = useState([]);
  const [seller, setSeller] = useState('');
  const [address, setAddress] = useState('');
  const [addressNum, setAddressNum] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const { cart, totalPrice } = useSelector((state) => state.checkout);

  // get sellers
  useEffect(() => {
    const user = localStorage.getItem('user');
    const { token } = JSON.parse(user);

    async function getData() {
      try {
        const sellersData = await getAllSellers(token);
        setSeller(sellersData[0].id); // default select value
        setSellers(sellersData);
      } catch (err) {
        console.log(err);
      }
    }

    getData();
  }, []);

  // redirect to order details page
  useEffect(() => {
    if (seller && address && addressNum && totalPrice) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [seller, address, addressNum, totalPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = localStorage.getItem('user');
      const { token, id } = JSON.parse(user);

      const sale = {
        userId: id,
        sellerId: seller,
        totalPrice,
        deliveryAddress: address,
        deliveryNumber: addressNum,
      };

      const products = cart.map(({ id: productId, quantity }) => ({
        productId: Number(productId),
        quantity,
      }));

      const order = await createSale(token, { sale, products });

      dispatch(clearCart());
      dispatch(clearProducts());

      navigate(`/customer/orders/${order.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form id="checkout-form" action="">
      <fieldset>
        <select
          name="select-seller"
          id="customer_checkout__select-seller"
          data-testid="customer_checkout__select-seller"
          value={ seller }
          onChange={ (e) => setSeller(e.target.value) }
        >
          {
            sellers.map(({ id, name }) => (
              <option
                key={ id }
                value={ id }
              >
                { name }
              </option>
            ))
          }
        </select>

        <input
          id="customer_checkout__input-address"
          type="text"
          data-testid="customer_checkout__input-address"
          placeholder="Address"
          value={ address }
          onChange={ (e) => setAddress(e.target.value) }
        />

        <input
          id="customer_checkout__input-address_number"
          type="text"
          data-testid="customer_checkout__input-addressNumber"
          placeholder="Address Number"
          value={ addressNum }
          onChange={ (e) => setAddressNum(e.target.value) }
        />

        <button
          type="button"
          data-testid="customer_checkout__button-submit-order"
          disabled={ submitDisabled }
          onClick={ (e) => handleSubmit(e) }
        >
          Confirm Order
        </button>
      </fieldset>
    </form>
  );
}

export default CheckoutForm;
