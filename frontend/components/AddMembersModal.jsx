import axios from "axios";
import React from "react";
import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";
import Select from "react-select";
import {editSingleProject} from "@/features/projects/projectSlice";
function MembersModal({projectId, onClose, project}) {
  //console.log(password)
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [UsersList, setUsersList] = useState([]);
  //
  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(
          "http://localhost:5000/api/users/getall",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setUsersList(response.data);
      };

      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [user]);
  useEffect(() => {
    const initialAssignedMembers = project.assignedMembers?.map((memberId) => {
      const user = UsersList.find((u) => u._id === memberId);
      return user ? {label: user.name, value: user._id} : null;
    });

    const filteredAssignedMembers = initialAssignedMembers.filter(
      (member) => member !== null
    );

    setAssignedMembers(filteredAssignedMembers);
  }, [project, UsersList]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const assignedMembersIds = assignedMembers.map((member) => member.value);
    const details = {
      _id: projectId,
      assignedMembers: assignedMembersIds,
    };
    dispatch(editSingleProject(details, user.token)).then(() => {
      toast.success("Project Updated Successfully");
      onClose();
    });
  };
  return (
    <div className='fixed top-0 right-3 bottom-0 left-0 flex items-center overflow-x-hidden overflow-y-visible justify-end z-50'>
      <div className='relative p-4 w-full max-w-md max-h-full'>
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
              Add Members To Project
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
              <Select
                isMulti
                options={UsersList.map((user) => ({
                  label: user.name,
                  value: user._id,
                }))}
                value={assignedMembers}
                onChange={(e) => setAssignedMembers(e)}
              />
              <button
                onClick={(e) => handleSubmit(e)}
                className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Add Members
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MembersModal;
