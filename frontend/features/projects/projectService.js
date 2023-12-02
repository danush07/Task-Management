import axios from 'axios';

const PROJECT_API = "http://localhost:5000/api/projects/createproject"

const createProject = async(details,token) =>{
    try{
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        const response = await axios.post(PROJECT_API, details, config);
        return response.data;
    }catch(error){
        throw error;
    }
}
const GET_PROJECTS = "http://localhost:5000/api/projects/getprojects"
const getAllProjects = async(token) =>{
    try{
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        const response = await axios.get(GET_PROJECTS, config);
        return response.data;
    }catch(e){
        throw e;
    }

}



const GET_SINGLE_PROJECT = "http://localhost:5000/api/projects/"

const getSingleProject = async(id,token) =>{
  try{
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    const response = await axios.get(`${GET_SINGLE_PROJECT}${id}`, config);
    return response.data;
}catch(e){
    throw e;
}
}
const editProject = async (id, details, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${GET_SINGLE_PROJECT}${id}`, details, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteProject = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`${GET_SINGLE_PROJECT}${id}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const ADD_TASK = "http://localhost:5000/api/projects/addtask"
const createTask = async(data,token) =>{
  try{
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    const response = await axios.post(ADD_TASK, data, config);
    return response.data;
}catch(error){
    throw error;
}
}

const projectService = {
  createProject,
  getAllProjects,
  getSingleProject,
  editProject,
  deleteProject,
  createTask
};

export default projectService;

