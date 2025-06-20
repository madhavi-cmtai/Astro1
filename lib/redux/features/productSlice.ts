import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../store";

// Product type definition
export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  size: string;
  benefits: string;
  category: string;
  createdOn: string;
  updatedOn: string;
}

// Slice state
export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
  selectedCategory: string | null;
}

// Initial state
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
  selectedCategory: null,
};

// Slice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

// Actions
export const {
  setProducts,
  setLoading,
  setError,
  setSelectedProduct,
  clearSelectedProduct,
  setSelectedCategory,
} = productSlice.actions;

// Thunks
export const fetchProducts = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/routes/products");
    if (response.status === 200) {
      dispatch(setProducts(response.data.data.products));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: any) {
    dispatch(setError(error?.message || "Unknown error"));
  }
};

export const fetchProductById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/products/${id}`);
    if (response.status === 200) {
      dispatch(setSelectedProduct(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: any) {
    dispatch(setError(error?.message || "Unknown error"));
  }
};

export const addProduct = (product: FormData) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post("/api/routes/products", product, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.status === 200) {
      await dispatch(fetchProducts() as any);
      return response.data;
    } else {
      dispatch(setError(response.data.message));
      return null;
    }
  } catch (error: any) {
    dispatch(setError(error?.message || "Unknown error"));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateProduct = ({ id, product }: { id: string; product: FormData }) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`/api/routes/products/${id}`, product, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.status === 200) {
      await dispatch(fetchProducts() as any);
      window.location.reload();
      return response.data;
    } else {
      dispatch(setError(response.data.message));
      return null;
    }
  } catch (error: any) {
    dispatch(setError(error?.message || "Unknown error"));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteProduct = ({ id }: { id: string }) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(`/api/routes/products/${id}`);
    if (response.status === 200) {
      await dispatch(fetchProducts() as any);
      return response.data;
    } else {
      dispatch(setError(response.data.message));
      return null;
    }
  } catch (error: any) {
    dispatch(setError(error?.message || "Unknown error"));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

// Selectors
export const selectProducts = (state: RootState) => {
  const products = state.product?.products;
  return Array.isArray(products) ? products : [];
};

export const selectProductById = (state: RootState, id: string) =>
  state.product.products.find((product) => product.id === id);

export const selectFilteredProducts = (state: RootState) => {
  const { products, selectedCategory } = state.product;
  if (!selectedCategory) return products;
  return products.filter((product) => product.category === selectedCategory);
};

export const selectCategories = (state: RootState) => {
  const categories = new Set(state.product.products.map((p) => p.category));
  return Array.from(categories);
};

export const selectSelectedCategory = (state: RootState) => state.product.selectedCategory;
export const selectLoading = (state: RootState) => state.product.loading;
export const selectError = (state: RootState) => state.product.error;

// Reducer
export default productSlice.reducer;
