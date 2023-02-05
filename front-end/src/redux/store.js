import { configureStore } from '@reduxjs/toolkit';

// reducers
import productsReducer from './features/productsSlice';
import checkoutReducer from './features/checkoutSlice';
import ordersReducer from './features/ordersSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    checkout: checkoutReducer,
    orders: ordersReducer,
  },
});

export default store;
