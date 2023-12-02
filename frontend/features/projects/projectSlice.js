import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from './projectService';

const initialState = {
  NewProject: [],
  getAllProjects: [],
  SingleProject: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const createProject = createAsyncThunk(
  'NewProject/createProject',
  async (details, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await projectService.createProject(details, token);
      return response;
    } catch (e) {
      const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllProjects = createAsyncThunk(
  'getAllProjects/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await projectService.getAllProjects(token);
      return response;
    } catch (e) {
      const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSingleProject = createAsyncThunk(
  'getSingleProject/getProject',
  async (project, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await projectService.getSingleProject(project,token);
      return response;
    } catch (e) {
      const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const editSingleProject = createAsyncThunk(
  'SingleProject/editSingleProject',
  async ( details , thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await projectService.editProject(details._id, details, token);
      return response;
    } catch (e) {
      const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteSingleProject = createAsyncThunk(
  'SingleProject/deleteSingleProject',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await projectService.deleteProject(id, token);
      return response;
    } catch (e) {
      const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addNewTask = createAsyncThunk(
  'NewTask/addTask',
  async(data,thunkAPI) =>{
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await projectService.createTask(data, token);
      return response;
    } catch (e) {
      const message = (e.response && e.response.data && e.response.data.message) || e.message || e.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
)
const projectSlice = createSlice({
  name: 'Projects',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.NewProject = action.payload;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getAllProjects.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.getAllProjects = action.payload;
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getSingleProject.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getSingleProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.SingleProject = action.payload;
      })
      .addCase(getSingleProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      }) .addCase(editSingleProject.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(editSingleProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.SingleProject = action.payload;
      })
      .addCase(editSingleProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(deleteSingleProject.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteSingleProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(deleteSingleProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      }) .addCase(addNewTask.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.addNewTask = action.payload;
      })
      .addCase(addNewTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});

export const { reset } = projectSlice.actions;
export default projectSlice.reducer;
