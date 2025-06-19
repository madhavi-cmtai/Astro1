import { configureStore } from '@reduxjs/toolkit'
import leadReducer from "./features/leadSlice";
import productReducer from "./features/productSlice";
import testimonialReducer from "./features/testimonialSlice";
import blogReducer from "./features/blogSlice";
import authReducer from "./features/authSlice";
import countReducer from "./features/countSlice";
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    lead: leadReducer,
    testimonial: testimonialReducer,
    blog: blogReducer,
    auth: authReducer,
    count: countReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;