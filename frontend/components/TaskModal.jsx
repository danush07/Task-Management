import React, {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {addNewTask} from "@/features/projects/projectSlice";
import {useSelector, useDispatch} from "react-redux";
import Select from "react-select";
import axios from "axios";
import {getSingleProject} from "@/features/projects/projectSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const TaskModal = ({membersid, projectid, onClose}) => {
  const [addDate, setDateField] = useState("");
  //console.log(addDate)
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [UsersList, setUsersList] = useState([]);
  const [titleError, setTitleError] = useState("");
  const [descError, setDescError] = useState("");
  const [membersError, setMembersError] = useState("");
  const [priority, setPriority] = useState("");
  const [priorityError, setPriorityError] = useState("");
  const [epictitle, setepictitle] = useState([]);
  const [epictitleError, setEpicTitleError] = useState("");
  const [dateError, setDateError] = useState("");
  const SingleProject = useSelector((state) => state.Projects.SingleProject);
  //

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(
          "https://task-management-backend-hpay.onrender.com/api/users/getall",
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
  const filteredUsersList = UsersList.filter((user) =>
    membersid.includes(user._id)
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedMembers, setAssignedMembers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    validateDesc(description);
    validateTitle(title);
    validateMembers(assignedMembers);
    validatePriority(priority);
    validateData(addDate);

    const assignedMembersIds = assignedMembers.map((member) => member.value);
    if (
      title &&
      description &&
      priority &&
      addDate &&
      assignedMembers &&
      !descError &&
      !membersError &&
      !titleError &&
      !priorityError &&
      !dateError
    ) {
      const details = {
        subassignedBy: `${user.name} ${user.empId}`,
        projectId: projectid,
        epictitle: epictitle,
        priority: priority,
        subtitle: title,
        dueDate: addDate,
        subdescription: description,
        subassignedTo: assignedMembersIds,
      };
      dispatch(addNewTask(details, user.token)).then(() => {
        toast.success("Task Added Successfully");
        dispatch(getSingleProject(projectid, user.token));
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
      setMembersError("Add Members to the Task");
    } else {
      setMembersError("");
    }
  };

  const validateEpicName = (value) => {
    if (value.length == 0) {
      setEpicTitleError("Please Assign the Task to a Epic Name");
    } else {
      setEpicTitleError("");
    }
  };
  const validatePriority = (value) => {
    if (!value) {
      setPriorityError("Please Select the Priority of the Task");
    } else {
      setPriorityError("");
    }
  };
  const validateData = (value) => {
    if (!value) {
      setDateError("Due Date is Required");
    } else {
      setDateError("");
    }
  };
  const minDate = moment().add(1, "days").toDate();
  return (
    <div className='fixed top-0 right-3 bottom-0 left-0 flex items-center overflow-x-hidden overflow-y-visible justify-end z-50'>
      <div className='bg-white w-full max-w-md p-6  rounded-md shadow-md'>
        <button
          onClick={closeModal}
          type='button'
          className='flex ml-96 items-center top-5 mt-12  justify-end right-2.5 text-gray-400 hover:text-gray-900 rounded-md p-2 '
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
        <h2 className='text-2xl font-bold mb-4'>Create a New Task</h2>
        <form>
          <div className='mb-4'>
            <div className='flex'>
              <label className='flex text-sm font-semibold text-gray-600 mr-1'>
                Epic Title
              </label>
              <span className='text-red-600 flex'>*</span>
            </div>
            <Select
              
              options={SingleProject.epictitle.map((title) => ({
                label: title.epictitle,
              }))}
              value={epictitle}
              onChange={(e) => setepictitle(e)}
              onBlur={() => {
                validateEpicName(epictitle);
              }}
            />
            <span className='text-red-600 text-sm'>{epictitleError}</span>
          </div>
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
              value={title}
              placeholder='Title of the task'
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => validateTitle(title)}
              onFocus={() => setTitleError("")}
              className='w-full border rounded-md py-2 px-3 '
            />
            <span className='text-red-600 text-sm'>{titleError}</span>
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
              placeholder='Enter the Description'
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
            <span className='text-red-600 text-sm'>{descError}</span>
          </div>
          <div className='mb-4'>
            <div className='flex'>
              <label className='flex text-sm font-semibold text-gray-600 mr-1'>
                Set Priority
              </label>
              <span className='text-red-600 flex'>*</span>
            </div>
            <Select
              options={[
                {label: "High", value: "High"},
                {label: "Medium", value: "Medium"},
                {label: "Low", value: "Low"},
              ]}
              value={{label: priority, value: priority}}
              onChange={(e) => setPriority(e.value)}
              onBlur={() => validatePriority(priority)}
              onFocus={() => setPriorityError("")}
            />
            <span className='text-red-600'>{priorityError}</span>
          </div>
          <div>
            <div className='flex text-sm font-medium text-gray-900 dark:text-white'>
              Set Due Date <span className='text-red-600 flex ml-1'>*</span>
            </div>
            <DatePicker
              className='border mb-2 border-gray-300 bg-gray-50 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500  w-96  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white '
              showIcon
              selected={addDate}
              onChange={(date) => setDateField(date)}
              dateFormat='dd/MM/yyyy'
              placeholderText={moment(new Date()).add(1, "days").format("ll")}
              minDate={minDate}
              onBlur={() => validateData(addDate)}
              onFocus={() => setDateError("")}
            />
            <span className='text-red-600 text-sm'>{dateError}</span>
          </div>
          <div className='mb-4'>
            <div className='flex'>
              <label className='flex text-sm font-semibold text-gray-600 mr-1'>
                Assign Task To
              </label>
              <span className='text-red-600 flex'>*</span>
            </div>
            <Select
              isMulti
              options={filteredUsersList.map((user) => ({
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
            <span className='text-red-600 text-sm'>{membersError}</span>
          </div>
          <div className='text-center'>
            <button
              type='button'
              onClick={handleSubmit}
              className='bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 '
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
