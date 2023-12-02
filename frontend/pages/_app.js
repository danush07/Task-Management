import '@/styles/globals.css'
import { Provider } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import store from '../store/index'
import {useState,useEffect} from 'react'


export default function App({ Component, pageProps }) {
const [hasMounted, setHasMounted] = useState(false);
useEffect(() => {
setHasMounted(true);
}, []);
return (
    <>
      <Provider store={store}>
        {hasMounted && (
          <>
              <Component {...pageProps} />
              <ToastContainer />
          </>
          
        )}
      </Provider>
    </>
  );
}