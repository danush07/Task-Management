import axios from 'axios';
import Cookies from 'js-cookie';
let URL = "http://localhost:5000/api/users/register";

const register = async (userData) => {
  const response = await axios.post(URL, userData);

  if (typeof window !== 'undefined') {
   
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  Cookies.set('user', JSON.stringify(response.data));
  return response.data;
};
let LOGIN_URL = "http://localhost:5000/api/users/";

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
    const response  = await axios.get("http://localhost:5000/api/users/me",config)
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
