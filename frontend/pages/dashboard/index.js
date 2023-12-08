import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {getAllProjects} from "@/features/projects/projectSlice";
import ProjectModal from "@/components/AddProjectModal";
import {MdAddTask} from "react-icons/md";
import Header from "@/components/Header";
import axios from "axios";
import Link from "next/link";
import {FaEye} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {MdOpenInNew} from "react-icons/md";
import {toast} from "react-toastify";
import {getSingleProject} from "@/features/projects/projectSlice";
import moment from "moment";
import {logout} from "@/features/auth/authSlice";




function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {user, message} = useSelector((state) => state.auth);
  const ListOfProjects = useSelector((state) => state.Projects.getAllProjects);
  const [UsersList, setUsersList] = useState([]);
  const isAdmin = user?.isAdmin === true;
  const [ProjectModalVisible, SetProjectModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const getAllProjects1 = useSelector((state) => state.Projects.getAllProjects);
  

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    if (message === "Not Authorized") {
      dispatch(logout()).then(() => {
        router.push("/login");
      });
    }
    dispatch(getAllProjects(user?.token));
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      try {
        const fetchData = async () => {
          const response = await axios.get(
            "https://task-management-backend-hpay.onrender.com/api/users/getall",
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );
          setUsersList(response.data);
        };

        fetchData();
      } catch (error) {
        console.log(" in dashboard", error);
        toast.error(error);
      }
    }
  }, [user]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    if (searchTerm === "") {
      setShowResults(false);
      setSearchResults(false)
    } else {
      const filteredUsers = getAllProjects1.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm) &&
          (isAdmin || project.assignedMembers.includes(user._id))
      );

      setSearchResults(filteredUsers);
      setShowResults(filteredUsers.length > 0);
    }
  };
  const handleInputFocus = () => {
    setInputFocused(true);
  };
  //

  const handleInputBlur = () => {
    setInputFocused(false);
  };
  const navigateToProject = (Id) => {
    setShowResults(false);
    router.push(`/dashboard/${Id}`);
    dispatch(getSingleProject(Id, user.token));
  };
  const getAssignedMembersNames = (assignedMembers) => {
    const memberNames = assignedMembers.map((memberId) => {
      const user = UsersList.find((u) => u._id === memberId);
      return user?.name;
    });
    return memberNames.join(", ");
  };

  const handleOpenModal = () => {
    SetProjectModalVisible(true);
  };

  const closeModal = () => {
    SetProjectModalVisible(false);
  };

  const handleClickChange = (id) => {
    router.push(`/dashboard/${id}`);
  };
  const handleTaskUpdate = async (projectId, taskId, completedStatus) => {
    const details = {
      completed: completedStatus,
    };

    try {
      await axios.put(
        `https://task-management-backend-hpay.onrender.com/api/projects/${projectId}/task/${taskId}/complete`,
        details,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(getSingleProject(projectId, user.token));
      dispatch(getAllProjects(user?.token));
      toast.success("Task Updated Successfully");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className='h-screen  font-[inter]'>
      <Header />
      <div className='mt-12 flex justify-between'>
        <Link
          href='/'
          className='bg-blue-500 p-3 ml-2 flex font-medium text-white rounded'
        >
          <svg
            className='w-5 mr-2'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z'
              clipRule='evenodd'
            ></path>
          </svg>
          Back to Home Page
        </Link>
        <>
          <div className='relative flex mr-2 items-center'>
            <input
              type='text'
              placeholder='Search Projects...'
              value={searchTerm}
              onChange={handleSearch}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className='border border-gray-300 rounded-md p-2 pl-8 focus:outline-none focus:border-blue-500'
            />
            <svg
              className='absolute top-3 left-2 w-5 h-5 text-gray-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              style={{top: "50%", transform: "translateY(-50%)"}}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M21 21l-6-6m2-6a8 8 0 11-16 0 8 8 0 0116 0z'
              ></path>
            </svg>
            {showResults && (
              <div className='absolute top-10 bg-white  rounded-md w-56 shadow-lg max-h-40 overflow-y-auto'>
                {searchResults.length > 0
                  ? searchResults.map((project, index) => (
                      <div
                        key={index}
                        className='cursor-pointer p-2 mb-1 hover:bg-gray-100'
                        onClick={() => navigateToProject(project._id)}
                      >
                        <span className='font-medium flex  px-12'>
                          {project.title}
                        </span>
                      </div>
                    ))
                  : null}
              </div>
            )}
            {searchResults.length === 0 && inputFocused && (
              <div className='absolute bg-white top-10 px-10 rounded-md shadow-lg max-h-40 overflow-y-auto'>
                <div className='p-2 text-gray-500'>No Results found.</div>
              </div>
            )}
          </div>
        </>
        {isAdmin && (
          <div
            onClick={handleOpenModal}
            className='flex p-3  cursor-pointer justify-end bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl dark:focus:ring-blue-800 text-white font-medium  rounded mr-4 text-center text-sm transition duration-300'
          >
            <MdAddTask className='text-xl mr-2 flex' /> Add Project
          </div>
        )}
      </div>
      <h1 className='text-2xl flex justify-center mt-8 font-medium mb-4 '>
        Projects
      </h1>

      <div className='mt-8 grid grid-cols-1 md:grid-cols-3  gap-4 max-w-6xl mx-auto'>
       
        {ListOfProjects && ListOfProjects.length > 0 ? (
          isAdmin ||
          ListOfProjects.some((project) =>
            project.assignedMembers.includes(user?._id)
          ) ? (
            ListOfProjects.map((project, index) =>
              isAdmin || project.assignedMembers.includes(user?._id) ? (
                <div
                  key={index}
                  onClick={() => handleClickChange(project._id)}
                  className='cursor-pointer bg-white border p-4 rounded-md transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-10 hover:shadow-md'
                >
                  <span className='flex justify-end'>
                    <FaEye />
                  </span>
                  <div>
                    <span className='font-semibold'>Project Title</span> -{" "}
                    {project.title}
                  </div>
                  <div>
                    <span className='font-semibold'>Description</span> -{" "}
                    {project.description}
                  </div>
                  <div>
                    <span className='font-semibold'>Created By </span> -{" "}
                    {project.createdBy}
                  </div>
                  <div>
                    <span className='font-semibold'>
                      Members of the Project
                    </span>{" "}
                    - {getAssignedMembersNames(project.assignedMembers)}
                  </div>
                </div>
              ) : null
            )
          ) : (
            <div className='text-blue-500 text-xl font-semibold'>
              {" "}
              You are Not a Member of Any Projects...{" "}
            </div>
          )
        
        ) : (
          <div role='status'>
            <svg
              aria-hidden='true'
              className='w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
          </div>
        )}
      </div>
      <h1 className='text-2xl flex justify-center font-medium mb-4 mt-7 '>
        {" "}
        My Tasks
      </h1>
      <div className='mt-8 grid grid-cols-3 md:grid-cols-3 gap-4 max-w-6xl mx-auto'>
        {ListOfProjects && ListOfProjects.length > 0 ? (
          ListOfProjects.some((project) =>
            project.tasks.some((task) => task.subassignedTo.includes(user?._id))
          ) ? (
            ListOfProjects.map((project, index) =>
              project.tasks.filter((task) =>
                task.subassignedTo.includes(user?._id)
              ).length > 0 ? (
                <div
                  key={index}
                  className={`bg-white border p-4 rounded-md  transition-shadow hover:shadow-md `}
                >
                  <span className='flex justify-end'>
                    <button>
                      <MdOpenInNew
                        className='text-xl cursor-pointer'
                        onClick={() => handleClickChange(project._id)}
                      />
                    </button>
                  </span>
                  <h2 className='text-lg font-semibold mb-2'>
                    Project Title:{" "}
                    <span className='text-blue-500'>{project.title}</span>
                  </h2>
                  <div className=' p-3 shadow-sm'>
                    {project.tasks
                      .filter((task) => task.subassignedTo.includes(user?._id))
                      .map((task) => (
                        <div key={task._id} className='mt-4 border p-4 '>
                          <div>
                            <span className='font-semibold'>Epic Title</span> -{" "}
                            {task.epictitle.map((title) => title.label)}
                          </div>
                          <div className='font-semibold'>
                            Task Assigned By{" "}
                            <span className='font-normal'>
                              {" "}
                              - {task.subassignedBy}
                            </span>
                          </div>
                          <div>
                            <span className='font-semibold'>Task Name</span> -{" "}
                            {task.subtitle}
                          </div>
                          <div>
                            <span className='font-semibold'>Description</span> -{" "}
                            {task.subdescription}
                          </div>
                          <div>
                            <span className='font-semibold'>
                              Task Priority:
                            </span>{" "}
                            <span
                              className={`${
                                task.priority == "High"
                                  ? "text-red-500 font-semibold"
                                  : task.priority == "Medium"
                                    ? "text-blue-500 font-semibold"
                                    : task.priority == "Low"
                                      ? "text-green-500 font-semibold"
                                      : "text-black"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <div
                            className={`${
                              task.completed === true
                                ? "text-green-500 font-semibold"
                                : "text-red-500 font-semibold"
                            }`}
                          >
                            Task Status:{" "}
                            {task.completed === true
                              ? "Completed"
                              : "Not Completed"}
                          </div>
                          <div
                            className={`${
                              task.completed === true
                                ? "font-semibold text-green-500 "
                                : "font-semibold text-red-500"
                            } `}
                          >
                            <span className='font-semibold'>Due Date</span> -{" "}
                            {task.dueDate
                              ? moment(task.dueDate).format("ll")
                              : "----"}
                          </div>
                          <div>
                            <span className='font-semibold'>Created At</span> -{" "}
                            {task.createdAt
                              ? moment(task.createdAt).format("lll")
                              : "----"}
                          </div>
                          <div className='flex mt-2 justify-end'>
                            <label className='relative inline-flex mb-3 items-center cursor-pointer'>
                              <input
                                type='checkbox'
                                onChange={(e) =>
                                  handleTaskUpdate(
                                    project._id,
                                    task._id,
                                    e.target.checked
                                  )
                                }
                                checked={task.completed}
                                disabled={task.completed}
                                className='sr-only peer'
                              />
                              <div className="w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                              <span className='ms-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                Completed
                              </span>
                            </label>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : null
            )
          ) : (
            <div className='text-blue-500 text-xl font-semibold'>
              {" "}
              Currently, You Are Not Assigned to Any Tasks...
            </div>
          )
        ) : (
          <div role='status'>
            <svg
              aria-hidden='true'
              className='w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
          </div>
        )}
      </div>

      {ProjectModalVisible && <ProjectModal onClose={closeModal} />}
    </div>
  );
      
      
}

export default Dashboard;
