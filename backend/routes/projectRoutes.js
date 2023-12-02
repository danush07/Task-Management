const express = require('express')
const router = express()

const {
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
  } = require('../controllers/projectController');
const {protect} = require('../middleware/authMiddleware')

router.post('/createproject',protect,createProject)
router.get('/getprojects',protect,getProjects)
router.get('/:id',protect,getProjectById)
router.put('/:id',protect,editProject)
router.delete('/:id',protect,deleteProject)
router.post('/addtask',protect,addTask)
router.delete('/:projectId/task/:taskId',protect,deleteSingleTask)
router.put('/:projectId/task/:taskId',protect,editSingleTask)
router.put('/:projectId/task/:taskId/complete',protect,setTaskCompletedStatus)
router.post('/:projectId/addepicname',protect,addEpicTitle)

module.exports = router