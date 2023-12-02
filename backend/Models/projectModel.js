const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  epictitle:{
    type: Array,
  },
  subassignedBy:{
    type: String,
  },
  subtitle: {
    type: String,
  },
  subdescription: {
    type: String,
  },
  subassignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'], 
  },
  dueDate:{
    type:Date,
  }
  
},
{
  timestamps: true,
});

const projectSchema = new mongoose.Schema({
  createdBy: {
    type: String,
  },
  title: {
    type: String,
   
  },
  description: {
    type: String,
  },
  assignedMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  epictitle:{
    type: Array,
  },
  tasks: [taskSchema], 
  
},
{
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

