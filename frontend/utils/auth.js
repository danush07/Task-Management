import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (data, User) => {
  const { name, email, empId, password, isAdmin } = data;

  if (!name || !email || !empId || !password) {
    throw { status: 400, message: "Please include all fields" };
  }

  if (isAdmin) {
    if (password !== "Span@123") {
      throw { status: 400, message: "Invalid Admin Password" };
    }

    if (!email.includes("sts@admin.com")) {
      throw { status: 400, message: "Invalid Admin Email Address" };
    }
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw { status: 400, message: "User already exists" };
  }

  const userExists1 = await User.findOne({ empId });
  if (userExists1) {
    throw { status: 400, message: "User with Same Employee ID Already Exists" };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    empId,
    email,
    location,
    isAdmin,
    password: hashedPassword,
  });

  if (user) {
    return {
      _id: user._id,
      name: user.name,
      empId: user.empId,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    };
  } else {
    throw { status: 400, message: "Invalid user data" };
  }
};

const loginUser = async (data, User) => {
  const { empId, email, password } = data;

  if (!email || !password || !empId) {
    throw { status: 401, message: "Please enter valid credentials" };
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw { status: 401, message: "Invalid Email or Employee ID" };
  }

  if (empId !== existingUser.empId) {
    throw { status: 401, message: "Invalid Employee ID" };
  }

  if (await bcrypt.compare(password, existingUser.password)) {
    return {
      _id: existingUser._id,
      name: existingUser.name,
      empId: existingUser.empId,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
      token: generateToken(existingUser._id),
    };
  } else {
    throw { status: 401, message: "Invalid password" };
  }
};

const profilePage = async (req, User) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    empId: user.empId,
  };
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export { registerUser, loginUser, profilePage, generateToken };
