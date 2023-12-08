import axios from "axios";
import React from "react";
import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";
import  {reset} from "@/features/auth/authSlice";

function PasswordModal({onClose}) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [cpasswordError, setCpasswordError] = useState("");
  const [currentpassword, setCurrentPassword] = useState("");
  //console.log(password)
  const dispatch = useDispatch();
  const { isError, message} = useSelector(
    (state) => state.auth
  );
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(reset());
  }, [isError, user, message, dispatch]);


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
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return errors;
  };

  const validateInput = (field, value) => {
    if (field === "password") {
      const errors = validatePassword(value);
      setPasswordError(errors);
    } else if (field === "confirm password") {
      setCpasswordError(value === password ? "" : "Passwords do not match");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateInput("password", password);
    validateInput("confirm password", cpassword);
    const details = {
      currentPassword: currentpassword,
      newPassword: password,
    };
    if (!cpasswordError && !passwordError) {
      try {
        await axios.put(
          `https://task-management-backend-hpay.onrender.com/api/users/changepassword`,
          details,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!isError && passwordError) {
          toast.success("Password Updated Successfully");
          onClose();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  return (
    <div className='fixed top-0 right-3 bottom-0 left-0 flex items-center overflow-x-hidden overflow-y-visible justify-end z-50'>
      <div className='relative p-4 w-full max-w-md max-h-full'>
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
              Change Password
            </h3>
            <button
              onClick={() => onClose()}
              type='button'
              className='end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
              data-modal-hide='authentication-modal'
            >
              <svg
                className='w-3 h-3'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 14'
              >
                <path
                  stroke='currentColor'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                />
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
          </div>
          <div className='p-4 md:p-5'>
            <form className='space-y-4'>
              <div>
                <label
                  for='password0'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Current Password
                </label>
                <input
                  value={currentpassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                  }}
                  type='password'
                  name='password0'
                  id='password0'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                />
              </div>
              <div>
                <label
                  for='password'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  New Password
                </label>
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateInput("password", e.target.value);
                  }}
                  type='password'
                  name='password'
                  id='password'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                />
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
              <div>
                <label
                  for='password2'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Confirm New Password
                </label>
                <input
                  value={cpassword}
                  onChange={(e) => {
                    setCpassword(e.target.value);
                  }}
                  onBlur={() => validateInput("confirm password", cpassword)}
                  onFocus={() => setCpasswordError("")}
                  type='password'
                  name='password2'
                  id='password2'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                />
              </div>
              <span className='text-red-500'> {cpasswordError}</span>
              <button
                onClick={(e) => handleSubmit(e)}
                className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordModal;
