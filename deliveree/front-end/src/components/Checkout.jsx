import React, { useEffect, useState } from 'react';

/* State */
import { useSelector } from 'react-redux';
import CheckoutForm from './CheckoutForm';

/* Children */
import CheckoutTable from './CheckoutTable';

export default function Checkout() {
  const { cart, totalPrice } = useSelector((state) => state.checkout);

  const initialState = {
    header: [
      'Item',
      'Name',
      'Quantity',
      'Unit Value',
      'Sub-total',
      'Remove Item',
    ],
    body: cart,
    footer: ['Total', totalPrice],
  };

  const [tableData, setTableData] = useState(initialState);

  useEffect(() => {
    setTableData((prev) => ({
      ...prev,
      body: cart,
      footer: [
        prev.footer[0],
        String(totalPrice.toFixed(2)).replace('.', ','),
      ],
    }));
  }, [cart, totalPrice]);

  return (
    <main>
      <CheckoutTable data={ tableData } />

      <CheckoutForm />
    </main>
  );
}
