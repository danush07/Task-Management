import React, { useEffect, useState } from 'react';
import { getSingleProject } from '@/features/projects/projectSlice';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Header from '@/components/Header';
import Link from 'next/link';
import { FaRegTrashCan } from 'react-icons/fa6';
import { MdAddTask } from "react-icons/md";
import { MdModeEdit } from 'react-icons/md';
import EditProjectModal from '@/components/EditProjectModal';
import DeleteModal from '@/components/DeleteProjectModal';
import { useRouter } from 'next/router'
import TaskModal from '@/components/TaskModal';
import TaskDeleteModal from '@/components/TaskDeleteModal';
import EditTaskModal from '@/components/EditTaskModal';
import { IoPersonAdd } from "react-icons/io5";
import moment from 'moment';
import MembersModal from '@/components/AddMembersModal';
import { GoTasklist } from "react-icons/go";
import EpicModal from '@/components/AddEpicModal';
import Task from '@/components/Task';

// 
function ProjectPage({ id }) {
  const user = useSelector((state) => state.auth.user);
  const router =useRouter()
  const SingleProject = useSelector((state) => state.Projects.SingleProject);
  const getAllProjects = useSelector((state)=>state.Projects.getAllProjects)
  const dispatch = useDispatch();
  const [UsersList, setUsersList] = useState([]);
  const [EditModalVisible,setEditModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [taskModalVisible,setTaskModalVisible] = useState(false)
  const [taskDeleteModal,setTaskDeleteModal] = useState(false)
  const [taskId,setTaskId] = useState(null)
  const [taskEditModalVisible,setTaskEditModalVisible] = useState(false)
  const [OpenMembersModalVisible,setOpenMembersModalVisible] = useState(false)
  const [ShowEpicModal,setShowEpicModal] = useState(false)

  const isAdmin = user?.isAdmin === true;
// 
//const idCheck = (getAllProjects.map((project)=>(project._id).includes(id)))
//const correctID = idCheck.includes(true)
//console.log(correctID)
//if (correctID === false){
//  router.push('/404')
//}
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://task-management-backend-hpay.onrender.com/api/users/getall",
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setUsersList(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    } else {
      router.push("/login");
    }
  }, [user]);

  useEffect(() => {
    dispatch(getSingleProject(id, user.token));
  }, [dispatch]);

  

  const getAssignedMembersNames = () => {
    if (SingleProject && SingleProject.assignedMembers) {
      const memberNames = SingleProject.assignedMembers.map((memberId) => {
        const user = UsersList.find((u) => u._id === memberId);
        return user?.name;
      });
      return memberNames.join(', ');
    }
    return '';
  };

  const handleOpenEditModal = () =>{
    setEditModalVisible(true)
  }
  const handleCloseEditModal = () =>{
    setEditModalVisible(false)
  }
  const openDeleteModal = () =>{
    setDeleteModalVisible(true)
  }
  const closeDeleteModal = () =>{
    setDeleteModalVisible(false)
  }
  const openTaskModal = () =>{
    setTaskModalVisible(true)
  }
  const closeTaskModal = () =>{
    setTaskModalVisible(false)
  }
  const openTaskDelete = () =>{
    setTaskDeleteModal(true)
  }
  const closeTaskDelete = () =>{
    setTaskDeleteModal(false)
  }
  const openTaskEditModal = () =>{
    setTaskEditModalVisible(true)
  }
  const closeTaskEditModal = () =>{
    setTaskEditModalVisible(false)
  }
  const handleOpenAddMembersModal =() =>{
    setOpenMembersModalVisible(true)
  }
  const handleCloseAddMembersModal =() =>{
    setOpenMembersModalVisible(false)
  }

  const openEpicModal =() =>{
    setShowEpicModal(true)
  }
  const closeEpicModal =() =>{
    setShowEpicModal(false)
  }
const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  
    if (searchTerm === '') {
      setShowResults(false);
    } else {
      const filteredUsers = getAllProjects.filter((project) =>
        project.title.toLowerCase().includes(searchTerm)
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
    setShowResults(false)
    router.push(`/dashboard/${Id}`)
    dispatch(getSingleProject(Id,user.token))
  };

  const handleTaskUpdate = async (taskId, completedStatus) => {
    const details = {
      completed: completedStatus
    };
  
    try {
      await axios
        .put(
          `https://task-management-backend-hpay.onrender.com/api/projects/${id}/task/${taskId}/complete`,
          details,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then(() => {
          dispatch(getSingleProject(id, user.token));
          toast.success("Task Updated Successfully");
        });
    } catch (e) {
      console.log(e);
    }
  }
  const handleTaskClick = (taskId) => {
    setTaskId(taskId);

  };

  

  return (
    <>
      {user && (
        <div className="h-screen  font-[inter]">
          <Header />
          <div className="flex mt-12">
            <div className="flex items-center ">
              <Link href="/dashboard" className="ml-2">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Back to Dashboard
                  </div>
                </button>
              </Link>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search Projects..."
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="border border-gray-300 rounded-md p-2 pl-8 focus:outline-none focus:border-blue-500"
                />
                <svg
                  className="absolute top-3 left-2 w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-6a8 8 0 11-16 0 8 8 0 0116 0z"
                  ></path>
                </svg>
              </div>
            </div>

            {showResults && (
              <div className="absolute bg-white  w-60  left-60 top-40 z-10 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {searchResults.length > 0
                  ? searchResults.map((project) => (
                      <div
                        key={user.id}
                        className="cursor-pointer text-start p-2 mb-1 hover:bg-gray-100"
                        onClick={() => navigateToProject(project._id)}
                      >
                        <span className="font-medium flex  px-12">
                          {project.title}
                        </span>
                      </div>
                    ))
                  : null}
              </div>
            )}
            {searchResults.length === 0 && inputFocused && (
              <div className="absolute bg-white  w-60  left-60 top-40 z-10 rounded-md shadow-lg max-h-40 overflow-y-auto">
                <div className="p-2 text-gray-500">No Results found.</div>
              </div>
            )}
            {isAdmin && (
              <>
                <button
                  onClick={openTaskModal}
                  className="bg-gradient-to-br items-center text-center  from-purple-600 to-blue-500 hover:bg-gradient-to-bl dark:focus:ring-blue-800 flex ml-60 relative px-2 py-1 text-sm text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg"
                  type="button"
                >
                  <MdAddTask className="mt-0.5 text-lg mr-2" /> Add Tasks
                </button>
                <button
                  onClick={handleOpenEditModal}
                  className="bg-blue-700 flex  ml-5 items-center text-center px-2 py-1 text-sm text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg"
                  type="button"
                >
                  <MdModeEdit className="mt-0.5 text-lg mr-0.5" /> Edit Project
                </button>
                <button
                  type="button"
                  className=" flex text-white  ml-5 mt-2 bg-gradient-to-br text-sm from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg px-5 py-2  text-center  mb-2"
                  onClick={handleOpenAddMembersModal}
                >
                  <IoPersonAdd className="mt-0.5 text-lg mr-0.5" /> Add Members
                </button>
                <button
                  onClick={openDeleteModal}
                  className="ml-5 text-red-600 rounded-sm text-sm text-white hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium"
                >
                  <FaRegTrashCan className="text-xl" />
                </button>
              </>
            )}
          </div>
          {SingleProject && (
            <div className="w-1/2 mx-auto bg-white rounded-xl shadow-lg p-8 space-y-5">
              <div className="mb-4">
                {isAdmin && (
                  <div className="flex justify-end">
                    <button
                      onClick={openEpicModal}
                      className="flex items-center font-semibold justify-end text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 p-2 rounded"
                    >
                      <GoTasklist className="text-xl " /> Add Epic
                    </button>
                  </div>
                )}
                <h1 className="text-3xl font-bold">
                  Project Title :{" "}
                  <span className="text-blue-500 ">{SingleProject.title}</span>
                </h1>
                <p className="text-gray-600 mt-3 font-medium">
                  Description :{" "}
                  <span className="">{SingleProject.description}</span>
                </p>
                <div className="block">
                  <span className="block">
                    Project Created By: {SingleProject?.createdBy}
                  </span>
                  <span className="block">
                    Created on :{" "}
                    {SingleProject.createdAt
                      ? moment(SingleProject.createdAt).format("lll")
                      : `-----`}
                  </span>
                  <span>
                    Last Updated :
                    {SingleProject.createdAt
                      ? moment(SingleProject.updatedAt).format("lll")
                      : `------`}
                  </span>
                </div>
              </div>

              <div className="">
                <strong>Members of the Project:</strong>{" "}
                {getAssignedMembersNames()}
              </div>
              <div className="p-4 bg-white rounded-sm shadow-sm space-y-5">
                <h1 className="text-xl">Tasks : </h1>
                <div>
                  <div className="p-4 bg-white rounded-sm space-y-5">
                    <div className="shadow-sm">
                      {SingleProject.tasks && SingleProject.tasks.length > 0 ? (
                        SingleProject.tasks.map((task, index) => (
                          <Task
                            key={index}
                            task={task}
                            isAdmin={isAdmin}
                            projectId={id}
                            handleTaskEdit={openTaskEditModal}
                            handleTaskDelete={openTaskDelete}
                            handleTaskUpdate={handleTaskUpdate}
                            handleTaskClick={handleTaskClick}
                          />
                        ))
                      ) : (
                        <div className="text-gray-500 text-center ">
                          There are Currently no Tasks for this Project.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {EditModalVisible && (
            <EditProjectModal
              project={SingleProject}
              onClose={handleCloseEditModal}
            />
          )}
          {deleteModalVisible && (
            <DeleteModal userid={id} onClose={closeDeleteModal} />
          )}
          {taskModalVisible && (
            <TaskModal
              projectid={id}
              membersid={SingleProject.assignedMembers}
              onClose={closeTaskModal}
            />
          )}
          {taskDeleteModal && (
            <TaskDeleteModal
              onClose={closeTaskDelete}
              projectId={id}
              taskid={taskId}
            />
          )}
          {taskEditModalVisible && (
            <EditTaskModal
              projectId={id}
              taskData={SingleProject}
              taskid={taskId}
              assignedMembersList={SingleProject.assignedMembers}
              onClose={closeTaskEditModal}
            />
          )}
          {OpenMembersModalVisible && (
            <MembersModal
              project={SingleProject}
              projectId={id}
              onClose={handleCloseAddMembersModal}
            />
          )}
          {ShowEpicModal && (
            <EpicModal
              project={SingleProject}
              projectId={id}
              onClose={closeEpicModal}
            />
          )}
        </div>
      )}
    </>
  );
}

export default ProjectPage;

export async function getServerSideProps(context) {
  const { id } = context.query;

  return {
    props: {
      id,
    },
  };
}
