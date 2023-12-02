const asyncHandler = require('express-async-handler');
const Project = require('../Models/projectModel');
const User = require('../Models/userModel');

const createProject = asyncHandler(async (req, res) => {
  const { createdBy,title, description, assignedMembers} = req.body;

  const user = await User.findById(req.user._id);
  if (!user.isAdmin) {
    res.status(403);
    throw new Error('Only admin users can create projects');
  }

  const project = await Project.create({
    title,
    description,
    assignedMembers,
    createdBy

  });

  if (project) {
    res.status(201).json(project);
  } else {
    res.status(400);
    throw new Error('Invalid project data');
  }
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({});
  res.status(200).json(projects);
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    res.status(200).json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});
const editProject = asyncHandler(async (req, res) => {
  const {title, description, assignedMembers} = req.body;
  //console.log('from the request',assignedMembers)
  const user = await User.findById(req.user._id);
  if (!user.isAdmin) {
    res.status(403);
    throw new Error("Unauthorized: Only admin  can edit projects");
  }

  const project = await Project.findById(req.params.id);
  if (project) {
    project.title = title || project.title;
    project.description = description || project.description;
    project.assignedMembers = assignedMembers || project.assignedMembers;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
});


const deleteProject = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.isAdmin) {
    res.status(403);
    throw new Error('Unauthorized: Only admin  can delete projects');
  }

  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne(); 
    res.status(200).json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

const addTask = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.isAdmin) {
    res.status(403);
    throw new Error(' Only admin  can add Tasks');
  }

  const { projectId,subassignedBy,priority, subtitle, subdescription, subassignedTo,epictitle,dueDate } = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const newTask = {
    priority,
    subassignedBy,
    epictitle,
    subtitle,
    subdescription,
    subassignedTo,
    dueDate
  };


  project.tasks.push(newTask);

  const updatedProject = await project.save();

  res.status(201).json(updatedProject);
});
//
const deleteSingleTask = asyncHandler(async (req, res) => {
  //console.log(req.params)
  const user = await User.findById(req.user._id);
  if (!user.isAdmin) {
    res.status(403);
    throw new Error('Unauthorized: Only admin  can delete tasks');
  }

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const taskIndex = project.tasks.findIndex((task) => task._id.toString() === req.params.taskId);

  if (taskIndex !== -1) {
    project.tasks.splice(taskIndex, 1);
    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

const editSingleTask = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.isAdmin) {
    res.status(403);
    throw new Error('Unauthorized: Only admin  can edit tasks');
  }

  const { subtitle, subdescription, subassignedTo,priority,dueDate } = req.body;
//console.log(req.params.projectId,req.params.taskId)
  const project = await Project.findById(req.params.projectId);
  //console.log(req)

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const taskIndex = project.tasks.findIndex((task) => task._id.toString() === req.params.taskId);

  if (taskIndex !== -1) {
    const task = project.tasks[taskIndex];
    task.subtitle = subtitle || task.subtitle;
    task.subdescription = subdescription || task.subdescription;
    task.subassignedTo = subassignedTo || task.subassignedTo;
    task.priority = priority ||  task.priority;
    task.dueDate = dueDate || task.dueDate;
    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } else {
    res.status(404).json({error: "Task Not Found"});
  }
});
const setTaskCompletedStatus = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;  
  const {completed} = req.body
  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const taskIndex = project.tasks.findIndex((task) => task._id.toString() === taskId);

    if (taskIndex !== -1) {
      const task = project.tasks[taskIndex];
      task.completed = completed;

      await project.save();

      return res.status(200).json({ message: 'Task completed status updated successfully' });
    } else {
      return res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const addEpicTitle = asyncHandler(async (req, res) => {
  const { epictitle } = req.body;
  const { projectId } = req.params;  
//console.log(projectId)
  const user = await User.findById(req.user._id);
  if (!user.isAdmin) {
    res.status(403);
    res.status(500).json({error: "Only Admin Can perform this Action"});
  }

  try {
    const project = await Project.findById(projectId);
    if(!epictitle){
      res.status(500).json({ error: 'Epic Name Cannot be Empty' });
    }

    if (!project) {
      res.status(500).json({ error: 'Project Not Found' });
    } else {
      project.epictitle.push({epictitle});
      const updatedProject = await project.save();
      res.status(201).json(updatedProject);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//
module.exports = {
  createProject,
  getProjects,
  getProjectById,
  editProject,
  deleteProject,
  addTask,
  deleteSingleTask,
  editSingleTask,
  setTaskCompletedStatus,
  addEpicTitle
};
