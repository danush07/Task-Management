const express = require('express')
const router = express()

const {registerUser,loginUser,profilePage,getAllUsers,changePassword} = require('../controllers/userController')

const {protect} = require('../middleware/authMiddleware')

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/me',protect,profilePage)
router.put('/changepassword',protect,changePassword)
router.get('/getall',protect,getAllUsers)


module.exports = router