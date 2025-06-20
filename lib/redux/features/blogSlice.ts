import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { sanitize, RootState } from "../store";
import { AppDispatch } from "../store";

export interface Blog {
  id?: string;
  title: string;
  summary: string;
  image: string;
  slug?: string;
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
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedBlog: (state, action: PayloadAction<Blog>) => {
      state.selectedBlog = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateBlogInState: (state, action: PayloadAction<{ id: string; blog: Partial<Blog> }>) => {
      const index = state.data.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...action.payload.blog,
        };
      }
    },
  },
});

export const {
  setBlogs,
  setLoading,
  setError,
  setSelectedBlog,
  updateBlogInState,
} = blogSlice.actions;

// Fetch all blogs
export const fetchBlogs = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get("/api/routes/blogs");
    dispatch(setBlogs(res.data.data));
  } catch (err: any) {
    dispatch(setError(err?.message || "Unknown error"));
  }
};

export const titleToSlug = (title: string) =>
  encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"));

// Fetch blog by title
export const fetchBlogByTitle = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`/api/routes/blogs/${id}`);
    dispatch(setSelectedBlog(res.data.data));
  } catch (err: any) {
    dispatch(setError(err?.message || "Failed to fetch blog"));
  }
};

export const addBlog = (formData: FormData) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.post("/api/routes/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await dispatch(fetchBlogs());
    // no reload needed
  } catch (err: any) {
    dispatch(setError(err?.message || "Unknown error"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateBlog = (blog: Blog, id: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const sanitized = sanitize({
        title: blog.title,
        summary: blog.summary,
      });

      const formData = new FormData();
      formData.append("title", sanitized.title);
      formData.append("summary", sanitized.summary);
      if (blog.file) {
        formData.append("image", blog.file);
      }

      const res = await axios.put(`/api/routes/blogs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Directly update Redux state
      dispatch(updateBlogInState({ id, blog: res.data.data }));

      // Optional: fetchBlogs() if server may have other changes
      // await dispatch(fetchBlogs());
    } catch (err: any) {
      dispatch(setError(err?.message || "Unknown error"));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const deleteBlog = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(`/api/routes/blogs/${id}`);
    await dispatch(fetchBlogs());
    // no reload needed
  } catch (err: any) {
    dispatch(setError(err?.message || "Unknown error"));
  } finally {
    dispatch(setLoading(false));
  }
};

// Selectors
export const selectBlogs = (state: RootState) => state.blog.data;
export const selectBlog = (state: RootState) => state.blog.selectedBlog;
export const selectLoading = (state: RootState) => state.blog.loading;
export const selectError = (state: RootState) => state.blog.error;

export default blogSlice.reducer;
