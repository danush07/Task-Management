const express = require('express')
const connectDB = require('../backend/MongoDb/db');
const { errorHandler } = require('./middleware/errorMiddleware');
require('dotenv').config()

connectDB()
let app = express()
app.use(express.json())


const cors = require('cors');
app.use(cors());




//routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/projects',require('./routes/projectRoutes'))



app.use(errorHandler)

app.listen(process.env.PORT, () => console.log(`Server Running on PORT ${process.env.PORT}`))