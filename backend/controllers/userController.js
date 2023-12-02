const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../Models/userModel')


const registerUser = asyncHandler(async (req, res) => {
  const {name, email, location, empId, password, isAdmin} = req.body;

  if (!name || !email || !empId || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }


  if (isAdmin) {
  
    if (password !== "Span@123") {
      res.status(400);
      throw new Error("Invalid Admin Password");
    }

    if (!email.includes("sts@admin.com")) {
      res.status(400);
      throw new Error("Invalid Admin Email Address");
    }
  }

  const userExists = await User.findOne({email});

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const userExists1 = await User.findOne({empId});
  if (userExists1) {
    res.status(400);
    throw new Error("User with Same Employee ID Already Exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = await User.create({
    name,
    empId,
    email,
    location,
    isAdmin,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      empId: user.empId,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const allusers = await User.find();
  res.status(200).json(allusers);
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { empId, email, password } = req.body;

  if (!email || !password || !empId) {
    res.status(401);
    throw new Error('Please enter valid credentials');
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    res.status(401);
    throw new Error('Invalid Email or Employee ID');
  }

  if (empId !== existingUser.empId) {
    res.status(401);
    throw new Error('Invalid Employee ID');
  }

  if (await bcrypt.compare(password, existingUser.password)) {
    res.status(200).json({
      _id: existingUser._id,
      name: existingUser.name,
      empId: existingUser.empId,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
      token: generateToken(existingUser._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid password');
  }
});

// 
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});


const profilePage = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    name:req.user.name,
    email: req.user.email,
    empId: req.user.empId,
  }
  res.status(200).json(user)
})

// Generate token
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  profilePage,
  getAllUsers,
  changePassword
}

