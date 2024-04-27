import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//create project
export const createProject = createAsyncThunk(
  "projects/createProject",
  async ({ projectsData, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3000/api/projects", {
        ...projectsData,
        prManager: userId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//status change
export const updateProjectStatus = createAsyncThunk(
  "project/updateProjectStatus",
  async ({ projectId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/projects/updateProjectStatus/${projectId}`,

        { newStatus }
      );
      if (response.status === 200) {
        return { projectId, newStatus };
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//update deadline
export const updateProjectDeadline = createAsyncThunk(
  "project/updateProjectDeadline",
  async ({ projectId, newDeadline }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/projects/updateProjectDeadline/${projectId}`,
        { newDeadline }
      );

      if (response.status === 200) {
        return { projectId, newDeadline };
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//delete
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/projects/${projectId}`
      );
      if (response.status === 200) {
        return projectId;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//fetch
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/projects/getallprojects"
      );
      return {
        projectsItems: response.data.data.projects,
        projectsCount: response.data.data.projects.length,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//description update
export const updateProjectDescription = createAsyncThunk(
  "projects/updateDescription",
  async ({ projectId, description }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/projects/${projectId}/description`,
        { description }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchMilestones = createAsyncThunk(
  "projects/fetchMilestones",
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/projects/${projectId}/milestones?userId=${userId}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const createMilestone = createAsyncThunk(
  "projects/createMilestone",
  async ({ projectId, milestoneData, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/projects/${projectId}/milestones`,
        { ...milestoneData, userId }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateMilestone = createAsyncThunk(
  "projects/updateMilestone",
  async ({ projectId, milestoneId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/projects/${projectId}/milestones/${milestoneId}`,
        updateData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteMilestone = createAsyncThunk(
  "projects/deleteMilestone",
  async ({ projectId, milestoneId }, { rejectWithValue }) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/projects/${projectId}/milestones/${milestoneId}`
      );
      return milestoneId;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const projectSlice = createSlice({
  name: "project",
  initialState: {
    projectsItems: [],
    isLoading: false,
    error: null,
    userList: [],
    userCount: 0,
    activeProjectId: null,
    milestones: [],
  },
  reducers: {
    setProjectsList: (state, action) => {
      state.projectsItems = action.payload;
    },
    setActiveProjectId: (state, action) => {
      state.activeProjectId = action.payload;
    },
    projectCreated(state) {
      state.projectCreated = true;
    },
  },
  extraReducers: {
    [createProject.pending]: (state) => {
      state.isLoading = true;
    },
    [createProject.fulfilled]: (state, action) => {
      state.isLoading = false;
      if (action.payload && Array.isArray(state.projectsItems)) {
        state.projectsItems.push(action.payload);
      }
    },
    [createProject.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [fetchProjects.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchProjects.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.projectsItems = action.payload.projectsItems;
      state.projectsCount = action.payload.projectsCount;
    },
    [fetchProjects.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    [deleteProject.fulfilled]: (state, action) => {
      state.projectsItems = state.projectsItems.filter(
        (project) => project._id !== action.payload
      );
    },
    [updateProjectStatus.fulfilled]: (state, action) => {
      const { projectId, newStatus } = action.payload;
      const index = state.projectsItems.findIndex(
        (project) => project._id === projectId
      );
      if (index !== -1) {
        state.projectsItems[index].status = newStatus;
      }
    },
    [updateProjectDeadline.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
      console.error("Error updating project deadline:", action.error);
    },
    [fetchMilestones.fulfilled]: (state, action) => {
      state.milestones = action.payload;
    },

    [createMilestone.fulfilled]: (state, action) => {
      state.milestones.push(action.payload);
    },

    [updateMilestone.fulfilled]: (state, action) => {
      const index = state.milestones.findIndex(
        (milestone) => milestone._id === action.payload._id
      );
      if (index !== -1) {
        state.milestones[index] = {
          ...state.milestones[index],
          ...action.payload,
        };
      }
    },

    [deleteMilestone.fulfilled]: (state, action) => {
      state.milestones = state.milestones.filter(
        (milestone) => milestone._id !== action.payload
      );
    },
  },
});

export const { setProjectsList, setActiveProjectId, projectCreated } =
  projectSlice.actions;

export default projectSlice.reducer;
