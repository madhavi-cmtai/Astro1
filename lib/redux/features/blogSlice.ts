import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface Blog {
  id?: string;
  title: string;
  summary: string;
  image: string;
  createdOn?: string;
  updatedOn?: string;
  file?: File;
}

export interface BlogState {
  data: Blog[];
  selectedBlog: Blog | null; 
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  data: [],
  selectedBlog: null,
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedBlog: (state, action) => {
      state.selectedBlog = action.payload;
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
  },
});

export const {
  setBlogs,
  setLoading,
  setError,
  setSelectedBlog,
} = blogSlice.actions;



export const fetchBlogs = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get("/api/routes/blogs");
    dispatch(setBlogs(res.data.data));
  } catch (err: any) {
    dispatch(setError(err?.message || "Unknown error"));
  }
};

export const fetchBlogById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`/api/routes/blogs/${id}`);
    dispatch(setSelectedBlog(res.data.data));
  } catch (err: any) {
    dispatch(setError(err?.message || "Failed to fetch blog"));
  }
};

export const addBlog = (formData: FormData) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.post("/api/routes/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await dispatch<any>(fetchBlogs());
  } catch (err: any) {
    dispatch(setError(err?.message || "Unknown error"));
  }
};

export const updateBlog = (blog: Blog, id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("summary", blog.summary);
    if (blog.file) formData.append("image", blog.file);

    await axios.put(`/api/routes/blogs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await dispatch<any>(fetchBlogs());
  } catch (err: any) {
    dispatch(setError(err?.message || "Unknown error"));
  }
};

export const deleteBlog = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(`/api/routes/blogs/${id}`);
    await dispatch<any>(fetchBlogs());
  } catch (err: any) {
    dispatch(setError(err?.message || "Unknown error"));
  }
};


export const selectBlogs = (state: RootState) => state.blog.data;
export const selectBlog = (state: RootState) => state.blog.selectedBlog;
export const selectLoading = (state: RootState) => state.blog.loading;
export const selectError = (state: RootState) => state.blog.error;

export default blogSlice.reducer;
