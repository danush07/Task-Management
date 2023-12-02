import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '@/features/auth/authSlice';
import { toast } from "react-toastify";
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { useRouter } from "next/navigation";

const LoginPage = () => {
 // 
  const [formData, setFormData] = useState({
    empId: '',
    email: '',
    password: '',
  });

  const [empIdError, setEmpIdError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { empId, email, password } = formData;
  const dispatch = useDispatch();
  const router = useRouter();
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);
  const { user, isError, isSuccess, message } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      router.push('/');
    }
    dispatch(reset());
  }, [isError, user, message, dispatch, isSuccess]);

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text');
    } else {
      setIcon(eyeOff);
      setType('password');
    }
  };


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
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  };


  const validateInput = (field, value) => {
    if (field === 'empId' && value.trim() === '') {
      setEmpIdError('Employee ID is Required');
    } else if (field === 'empId') {
      const empRegex = /^STS-\d{3}$/;
      setEmpIdError(empRegex.test(value.trim()) ? '' : 'ID Must begin with STS- followed by 3 digit numbers');
    } else if (field === 'email' && value.trim() === '') {
      setEmailError('Email is Required');
    } else if (field === 'email') {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      setEmailError(emailRegex.test(value.trim()) ? '' : 'Please enter a valid email address');
    } else if (field === 'password') {
      const errors = validatePassword(value);
      setPasswordError(errors);
    }  else {
      setPasswordError('');
    }
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    validateInput('empId', empId);
    validateInput('email', email);
    validateInput('password', password);

    if (!empIdError && !emailError ) {
      const userData = {
        empId : empId,
        email :email,
        password :password,
      };
      
        dispatch(login(userData));
      
    }
  };



  return (
    <div>
    {!user &&
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-fuchsia-500">
      <form className="p-10 bg-white rounded-xl shadow-lg space-y-5">
        <h1 className="text-center text-3xl">Login</h1>
        <div className="flex flex-col space-y-2">
        <div htmlFor="empId" className="text-sm font-bold">
         Employee ID
        </div>
         <input
           type="text"
           id="empId"
           maxLength={7}
           autoComplete="off"
           className="w-96 px-3 py-2 rounded-md border border-slate-400"
           placeholder="Enter Your Employee ID"
           value={empId}
           onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
           onBlur={() => validateInput('empId', empId)}
           onFocus={() => setEmpIdError('')}
          />
          {empIdError && <span className="text-red-500">{empIdError}</span>}
          </div>
          <div className="flex flex-col space-y-2">
          <div htmlFor="email" className="text-sm font-bold">
          Email
          </div>
          <input
           type="email"
           id="email"
           maxLength={70}
           autoComplete="off"
           className="w-96 px-3 py-2 rounded-md border border-slate-400"
           placeholder="Your Email"
           value={email}
           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
           onBlur={() => validateInput('email', email)}
           onFocus={() => setEmailError('')}
         />
        {emailError && <span className="text-red-500">{emailError}</span>}
        </div>
        <div className="flex flex-col space-y-2">
          <div htmlFor="password" className="text-sm font-bold">
            Password
          </div>
          <input
            type={type}
            id="password"
            maxLength={30}
            className="w-96 px-3 py-2 rounded-md border border-slate-400"
            placeholder="Your Password"
            value={password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              validateInput('password', e.target.value)
            }}
            onBlur={() => validateInput('password', password)}
            onFocus={() => setPasswordError('')}
          />
          <span className="flex justify-end items-center" onClick={handleToggle}>
            <Icon className="absolute mb-14 mr-2" icon={icon} size={15}/>
          </span>
          {(passwordError) ? (
              passwordError.map((error, index) => (
                <span key={index} className='text-red-500 block'>
                  {error}
                </span>
              ))
            ) : (
                <span className='text-red-500'>{passwordError}</span>
            )}
        </div>

        <button
          onClick={onSubmit}
          className="w-full px-10 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 hover:shadow-md duration-300 ease-in"
          type="click"
        >
          Sign In
        </button>
        <div className="text-center">
        
          Don't have an Account? <Link href='/register' ><span className="text-blue-400 underline font-bold" >Register Now!</span>
          </Link>
          </div>
      </form>
    </div>
    }
    </div>
  );
};

export default LoginPage;
