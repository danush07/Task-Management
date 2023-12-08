import axios from "axios";
import React from "react";
import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {getSingleProject} from "@/features/projects/projectSlice";

import {toast} from "react-toastify";
function EpicModal({projectId, onClose}) {
  //console.log(password)
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const [epictitle, setEpictitle] = useState("");
  const [epictitleError, setEpictitleError] = useState("");
  const validateTitle = (value) => {
    if (!value) {
      setEpictitleError("Title is required");
    } else {
      setEpictitleError("");
    }
  };
  //
  const handleEpic = async () => {
    validateTitle(epictitle);

    if (!epictitleError) {
      const details = {
        epictitle,
      };

      try {
        await axios.post(
          `https://task-management-backend-hpay.onrender.com/api/projects/${projectId}/addepicname`,
          details,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        dispatch(getSingleProject(projectId, user.token));
        onClose();
        toast.success("Epic Created Successfully");
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
              Add Epic Title to the Project{" "}
              <span className='text-red-500'>*</span>
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
                  d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                />
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
          </div>
          <div className='p-4 md:p-5'>
            <form className='space-y-4'>
              <div>
                <input
                  value={epictitle}
                  placeholder='Enter the Epic Name ...'
                  onChange={(e) => setEpictitle(e.target.value)}
                  onBlur={() => {
                    validateTitle(epictitle);
                  }}
                  onFocus={() => {
                    setEpictitleError("");
                  }}
                  type='text'
                  name='Modal'
                  id='Modal'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                />
              </div>
              <span className='text-red-500'>{epictitleError}</span>
              <button
                type='button'
                onClick={handleEpic}
                className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Add Epic Name
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EpicModal;
