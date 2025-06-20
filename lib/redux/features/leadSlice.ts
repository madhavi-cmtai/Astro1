import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { sanitize, RootState } from "../store";



export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "New" | "Contacted" | "Converted" ; 
  createdOn: string;
  updatedOn: string;
}

export interface LeadWithId extends Lead {
  id: string;
}

interface LeadState {
  data: LeadWithId[];
  loading: boolean;
  error: string | null;
  selectedLead: LeadWithId | null;
}

const initialState: LeadState = {
  data: [],
  loading: false,
  error: null,
  selectedLead: null,
};



export const fetchLeads = createAsyncThunk<LeadWithId[], void, { rejectValue: string }>(
  'lead/fetchLeads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/routes/contact", {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.data?.success) {
        return rejectWithValue('Failed to fetch leads: Server returned an unsuccessful response');
      }
      
      if (!Array.isArray(response.data?.data)) {
        console.error('Invalid leads data received:', response.data);
        return rejectWithValue('Invalid leads data received from server');
      }    
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      const message = error.response?.data?.message || error.message || "Failed to fetch leads";
      return rejectWithValue(message);
    }
  }
);

export const fetchLeadById = createAsyncThunk<LeadWithId, string, { rejectValue: string }>(
  'lead/fetchLeadById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/routes/contact/${id}`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || `Failed to fetch lead with ID: ${id}`;
      return rejectWithValue(message);
    }
  }
);

export const addLead = createAsyncThunk<
  LeadWithId,
  Omit<Lead, 'createdOn' | 'updatedOn'>,
  { rejectValue: string }
>(
  'lead/addLead',
  async (newLeadData, { rejectWithValue }) => {
    try {
      const timestamp = new Date().toISOString();
      const leadToCreate: Lead = {
        ...newLeadData,
        createdOn: timestamp,
        updatedOn: timestamp,
      };
      const response = await axios.post("/api/routes/contact", leadToCreate);
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to add lead";
      return rejectWithValue(message);
    }
  }
);

export const updateLead = createAsyncThunk<LeadWithId, { id: string; updatedLeadData: Lead }, { rejectValue: string }>(
  'lead/updateLead',
  async ({ id, updatedLeadData }, { rejectWithValue, dispatch }) => {
    try {
      const sanitizedData = sanitize(updatedLeadData);
      const response = await axios.put(`/api/routes/contact/${id}`, sanitizedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload();
      dispatch(fetchLeads());
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || `Failed to update lead with ID: ${id}`;
      return rejectWithValue(message);
    }
  }
);

export const deleteLead = createAsyncThunk<string, string, { rejectValue: string }>(
  'lead/deleteLead',
  async (leadId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/routes/contact/${leadId}`);
      return leadId;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || `Failed to delete lead with ID: ${leadId}`;
      return rejectWithValue(message);
    }
  }
);



const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedLead: (state, action: PayloadAction<LeadWithId | null>) => {
      state.selectedLead = action.payload;
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
  },
  extraReducers: (builder) => {
    builder

     
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch leads";
      })

      // --- Fetch Lead by ID ---
      .addCase(fetchLeadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch lead by ID";
      })

      // --- Add Lead ---
      .addCase(addLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLead.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add lead";
      })

      // --- Update Lead ---
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;

        const updatedLead = action.payload;
        if (!updatedLead || !updatedLead.id) {
          state.error = "Invalid update payload";
          return;
        }

        const index = state.data.findIndex((lead) => lead.id === updatedLead.id);
        if (index !== -1) {
          state.data[index] = updatedLead;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update lead";
      })

      // --- Delete Lead ---
      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(lead => lead.id !== action.payload);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete lead";
      });
  },
});


export const {
  setLoading,
  setError,
  setSelectedLead,
  clearSelectedLead
} = leadSlice.actions;

export const selectLeads = (state: RootState) => state.lead.data;
export const selectLoading = (state: RootState) => state.lead.loading;
export const selectError = (state: RootState) => state.lead.error;
export const selectSelectedLead = (state: RootState) => state.lead.selectedLead;

export default leadSlice.reducer;
