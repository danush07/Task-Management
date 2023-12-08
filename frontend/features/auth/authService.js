import axios from 'axios';
import Cookies from 'js-cookie';
let URL =
  "https://task-management-backend-hpay.onrender.com/api/users/";

const register = async (userData) => {
  const response = await axios.post(URL, userData);

  if (typeof window !== 'undefined') {
   
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  Cookies.set('user', JSON.stringify(response.data));
  return response.data;
};
let LOGIN_URL = "https://task-management-backend-hpay.onrender.com/api/users/";

const login = async (userData) => {
  const response = await axios.post(LOGIN_URL + "login", userData);

  if (typeof window !== 'undefined') 
  { 
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  Cookies.set('user', JSON.stringify(response.data));
  return response.data;
};
const profilePage = async (token) =>{
  try{
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      "https://task-management-backend-hpay.onrender.com/api/users/me",
      config
    );
    return response.data
  }catch(e){
    console.log(e)
  }
}


const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
  Cookies.remove('user');
};

const authService = {
  register,
  logout,
  login,
  profilePage
};

export default authService;
