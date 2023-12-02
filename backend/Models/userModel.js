const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    bname:{
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    empId:{
        type: String,
        unique: true,
    },
    password: {
      type: String,
    },
    isAdmin:{
      type:Boolean,
      default:false,
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)