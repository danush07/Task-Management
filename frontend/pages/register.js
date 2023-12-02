import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import React from "react";
import Link from "next/link";
import {toast} from "react-toastify";
import {useSelector, useDispatch} from "react-redux";
import {register, reset} from "@/features/auth/authSlice";
import {Icon} from "react-icons-kit";
import {eyeOff} from "react-icons-kit/feather/eyeOff";
import {eye} from "react-icons-kit/feather/eye";

function UserRegister() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [empId, setEmpId] = useState("");
  const [empIdErr, setEmpIdErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const dispatch = useDispatch();
  const {user, isError, isSuccess, message} = useSelector(
    (state) => state.auth
  );

  //

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      router.push("/");
    }
    dispatch(reset());
  }, [isError, isSuccess, user, message, dispatch]);

  const validatePassword = (password) => {
    const errors = [];

    if (!password) {
      errors.push("Password is Required...");
    }
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/(?=.*[!@#$%^&-_=+{}()?*])/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return errors;
  };

  const [confirmType, setConfirmType] = useState("password");
  const [confirmIcon, setConfirmIcon] = useState(eyeOff);

  const handleToggle = (field) => {
    if (field === "password") {
      setType(type === "password" ? "text" : "password");
      setIcon(type === "password" ? eye : eyeOff);
    } else if (field === "confirmPassword") {
      setConfirmType(confirmType === "password" ? "text" : "password");
      setConfirmIcon(confirmType === "password" ? eye : eyeOff);
    }
  };

  const validateInput = (field, value) => {
    if (field === "name" && value.trim() === "") {
      setNameError("Name field cannot be empty");
    } else if (field === "name") {
      const nameregex = /^[a-zA-Z#_ ]{5,20}$/;
      setNameError(
        !nameregex.test(value.trim())
          ? "Name must be 5 - 20 Characters and can contain #_ "
          : ""
      );
    } else if (field === "email") {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      setEmailError(
        emailRegex.test(value.trim()) &&
          value.trim().toLowerCase().includes("@spantechnologyservices.com")
          ? ""
          : "Please enter a valid email address"
      );
    } else if (field === "empid") {
      const empregex = /^STS-\d{3}$/;
      setEmpIdErr(
        !empregex.test(value.trim())
          ? "ID Must begin with STS- followed by 3 digit numbers"
          : ""
      );
    } else if (field === "password") {
      const errors = validatePassword(value);
      setPasswordError(errors);
    } else if (field === "confirm password") {
      setConfirmPasswordError(
        value === password ? "" : "Passwords do not match"
      );
    }
  };

  //

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateInput("name", name);
    validateInput("email", email);
    validateInput("empid", empId);
    validateInput("password", password);
    validateInput("confirm password", confirmPassword);

    const Errors =
      nameError ||
      emailError ||
      empIdErr ||
      (passwordError && passwordError.length > 0) ||
      confirmPasswordError ||
      isError;

    if (!Errors) {
      const userData = {
        name,
        email,
        empId,
        password,
      };

      dispatch(register(userData));
    }
  };

  return (
    <>
      {!user && (
        <div className='bg-blue-200 h-screen flex items-center  justify-center'>
          <div className='max-w-md w-full px-6 mb-24 py-4 mt-20 bg-white rounded shadow'>
            <h2 className='text-xl font-bold mb-2'>User Register</h2>
            <form onSubmit={handleSubmit}>
              <div className='mb-2'>
                <div
                  htmlFor='username'
                  className='block text-gray-700 font-bold mb-1'
                >
                  Username <span className='text-red-600'>*</span>
                </div>
                <input
                  autoComplete='off'
                  maxLength={25}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => validateInput("name", name)}
                  onFocus={() => setNameError("")}
                  value={name}
                  type='text'
                  id='name'
                  className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                />
                <span className='text-red-500'>{nameError}</span>
              </div>
              <div className='mb-2'>
                <div
                  htmlFor='email'
                  className='block text-gray-700 font-bold mb-2'
                >
                  E-mail <span className='text-red-600'>*</span>
                </div>
                <input
                  maxLength={100}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validateInput("email", email)}
                  onFocus={() => setEmailError("")}
                  type='email'
                  id='email'
                  className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                />
                <span className='text-red-500'>{emailError}</span>
              </div>
              <div className='mb-2'>
                <div
                  htmlFor='empid'
                  className='block text-gray-700 font-bold mb-2'
                >
                  Employee ID <span className='text-red-600'>*</span>
                </div>
                <input
                  value={empId}
                  maxLength={7}
                  onChange={(e) => setEmpId(e.target.value)}
                  onBlur={() => validateInput("empid", empId)}
                  onFocus={() => setEmpIdErr("")}
                  type='text'
                  id='empid'
                  className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                />
                <span className='text-red-500'>{empIdErr}</span>
              </div>
              <div className='mb-2 relative'>
                <div
                  htmlFor='password'
                  className='block text-gray-700 font-bold mb-2'
                >
                  Password <span className='text-red-600'>*</span>
                </div>
                <div className='relative'>
                  <input
                    autoComplete='off'
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validateInput("password", e.target.value);
                    }}
                    onFocus={() => setPasswordError("")}
                    type={type}
                    id='password'
                    className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10'
                  />
                  <span
                    className='absolute top-0 right-0 h-full flex items-center pr-2 cursor-pointer'
                    onClick={() => handleToggle("password")}
                  >
                    <Icon icon={icon} size={15} />
                  </span>
                </div>
                {passwordError ? (
                  passwordError.map((error, index) => (
                    <span key={index} className='text-red-500 block'>
                      {error}
                    </span>
                  ))
                ) : (
                  <span className='text-red-500'>{passwordError}</span>
                )}
              </div>

              <div className='mb-2'>
                <div
                  htmlFor='confirm password'
                  className='block text-gray-700 font-bold mb-2'
                >
                  Confirm Password <span className='text-red-600'>*</span>
                </div>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() =>
                    validateInput("confirm password", confirmPassword)
                  }
                  onFocus={() => setConfirmPasswordError("")}
                  type={confirmType}
                  id='confirm password'
                  className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                />
                <span
                  className='flex justify-end items-center'
                  onClick={() => handleToggle("confirmPassword")}
                >
                  <Icon
                    className='absolute mb-10 mr-2'
                    icon={confirmIcon}
                    size={15}
                  />
                </span>
                <span className='text-red-500'>{confirmPasswordError}</span>
              </div>

              <button
                type='submit'
                className='bg-blue-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              >
                Register
              </button>
           <div className='text-center'>
                Already a user?{"  "}
                <Link href='/login'>
                  <span className='text-blue-400 underline font-bold'>
                    Login
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default UserRegister;
