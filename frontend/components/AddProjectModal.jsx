import React, {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {createProject} from "@/features/projects/projectSlice";
import {getAllProjects} from "@/features/projects/projectSlice";
import {useSelector, useDispatch} from "react-redux";
import Select from "react-select";
import axios from "axios";
const ProjectModal = ({onClose}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [UsersList, setUsersList] = useState([]);
  const [titleError, setTitleError] = useState("");
  const [descError, setDescError] = useState("");
  const [membersError, setMembersError] = useState("");

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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedMembers, setAssignedMembers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    validateDesc(description);
    validateTitle(title);
    validateMembers(assignedMembers);

    const assignedMembersIds = assignedMembers.map((member) => member.value);
    if (
      title &&
      description &&
      assignedMembers &&
      !descError &&
      !membersError &&
      !titleError
    ) {
      const details = {
        createdBy: `${user.name}  ${user.empId}`,
        title,
        description,
        assignedMembers: assignedMembersIds,
      };
      dispatch(createProject(details, user.token)).then(() => {
        dispatch(getAllProjects(user.token));
        toast.success("Project Created Successfully");
        onClose();
      });
    }
  };

  const closeModal = () => {
    onClose();
  };
  const validateTitle = (value) => {
    if (!value) {
      setTitleError("Title is Required");
    } else {
      setTitleError("");
    }
  };

  const validateDesc = (value) => {
    if (!value) {
      setDescError("Description is Required");
    } else {
      setDescError("");
    }
  };
  const validateMembers = (value) => {
    if (value.length == 0) {
      setMembersError("Add Members to the Project");
    } else {
      setMembersError("");
    }
  };
  return (
    <div className='fixed top-0 right-3 bottom-0 left-0 flex items-center overflow-x-hidden overflow-y-visible justify-end z-50'>
      <div className='bg-white w-full max-w-md p-6  rounded-md shadow-md'>
        <button
          onClick={closeModal}
          type='button'
          className='flex ml-96 items-center top-3  justify-end right-2.5 text-gray-400 hover:text-gray-900 rounded-md p-2 '
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M6 18L18 6M6 6l12 12'
            ></path>
          </svg>
        </button>
        <h2 className='text-2xl font-bold mb-4'>Create a New Project</h2>
        <form>
          <div className='mb-4'>
            <div className='flex'>
              <label className='flex text-sm font-semibold text-gray-600 mr-1'>
                Title
              </label>
              <span className='text-red-600 flex'>*</span>
            </div>
            <input
              type='text'
              name='title'
              placeholder='Enter the Title of the Project'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => validateTitle(title)}
              onFocus={() => setTitleError("")}
              className='w-full border rounded-md py-2 px-3 '
            />
            <span className='text-red-600'>{titleError}</span>
          </div>

          <div className='mb-4'>
            <div className='flex'>
              <label className='flex text-sm font-semibold text-gray-600 mr-1'>
                Description
              </label>
              <span className='text-red-600 flex'>*</span>
            </div>
            <textarea
              name='description'
              placeholder='Enter the Description of the Project'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => {
                validateDesc(description);
              }}
              onFocus={() => {
                setDescError("");
              }}
              className='w-full border rounded-md py-2 px-3  '
            />
            <span className='text-red-600'>{descError}</span>
          </div>
          <div className='mb-4'>
            <div className='flex'>
              <label className='flex text-sm font-semibold text-gray-600 mr-1'>
                Add Members
              </label>
              <span className='text-red-600 flex'>*</span>
            </div>
            <Select
              isMulti
              options={UsersList.map((user) => ({
                label: user.name,
                value: user._id,
              }))}
              value={assignedMembers}
              onChange={(e) => setAssignedMembers(e)}
              onBlur={() => {
                validateMembers(assignedMembers);
              }}
              onFocus={() => {
                setMembersError("");
              }}
            />
            <span className='text-red-600'>{membersError}</span>
          </div>
          <div className='text-center'>
            <button
              type='button'
              onClick={handleSubmit}
              className='bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 '
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
