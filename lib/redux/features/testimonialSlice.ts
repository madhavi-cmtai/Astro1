import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface Testimonial {
  id: string;
  name: string;
  media?: string;
  description: string;
  mediaType?: "image" | "video" | "no-media" | "none" | null;
  status: "active" | "inactive";
  spread?: string;
  rating: number;
  createdOn: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedOn: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface TestimonialState {
  data: Testimonial[];
  loading: boolean;
  error: string | null;
  selectedTestimonial: Testimonial | null;
}

const initialState: TestimonialState = {
  data: [],
  loading: false,
  error: null,
  selectedTestimonial: null,
};

const testimonialSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {
    setTestimonials: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedTestimonial: (state, action) => {
      state.selectedTestimonial = action.payload;
    },
    clearSelectedTestimonial: (state) => {
      state.selectedTestimonial = null;
    },
    removeTestimonial: (state, action) => {
      state.data = state.data.filter(t => t.id !== action.payload);
    },
    updateTestimonialInList: (state, action) => {
      const updated = action.payload;
      const index = state.data.findIndex(t => t.id === updated.id);
      if (index !== -1) state.data[index] = updated;
    },
    addTestimonialToList: (state, action) => {
      state.data.push(action.payload);
    },
  },
});

export const {
  setTestimonials,
  setLoading,
  setError,
  setSelectedTestimonial,
  clearSelectedTestimonial,
  removeTestimonial,
  updateTestimonialInList,
  addTestimonialToList,
} = testimonialSlice.actions;

// Async Thunks

export const fetchTestimonials = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`/api/routes/testimonials?status=active&_t=${Date.now()}`);
    dispatch(setTestimonials(res.data.data));
  } catch (error: any) {
    dispatch(setError(error?.response?.data?.message || error.message || "Failed to fetch testimonials"));
  }
};

export const fetchTestimonialById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`/api/routes/testimonials/${id}`);
    dispatch(setSelectedTestimonial(res.data.data));
  } catch (error: any) {
    dispatch(setError(error?.response?.data?.message || error.message || "Failed to fetch testimonial"));
  }
};

export const addTestimonial = (formData: FormData) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.post("/api/routes/testimonials", formData);
    dispatch(addTestimonialToList(res.data.data));
    return res.data.data;
  } catch (error: any) {
    dispatch(setError(error?.response?.data?.message || error.message || "Failed to add testimonial"));
  }
};

export const updateTestimonial = (formData: FormData, id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.put(`/api/routes/testimonials/${id}`, formData);
    dispatch(updateTestimonialInList(res.data.data));
    window.location.reload();
    return res.data.data;
  } catch (error: any) {
    dispatch(setError(error?.response?.data?.message || error.message || "Failed to update testimonial"));
  }
};

export const deleteTestimonial = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.delete(`/api/routes/testimonials/${id}`);
    dispatch(removeTestimonial(id));
    return res.data.data;
  } catch (error: any) {
    dispatch(setError(error?.response?.data?.message || error.message || "Failed to delete testimonial"));
  }
};

// Selectors
export const selectTestimonials = (state: RootState) => state.testimonial.data;
export const selectTestimonialById = (state: RootState, id: string) =>
  state.testimonial.data.find(t => t.id === id);
export const selectSelectedTestimonial = (state: RootState) => state.testimonial.selectedTestimonial;
export const selectLoading = (state: RootState) => state.testimonial.loading;
export const selectError = (state: RootState) => state.testimonial.error;

export default testimonialSlice.reducer;
