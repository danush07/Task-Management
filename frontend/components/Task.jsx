import moment from "moment";
import {useState, useEffect} from "react";
import {FaRegPenToSquare, FaTrash} from "react-icons/fa6";
import {useSelector} from "react-redux";
import axios from "axios";
import EditTaskModal from "./EditTaskModal";
import TaskDeleteModal from "./TaskDeleteModal";
import {useRouter} from "next/navigation";

const Task = ({task, isAdmin, handleTaskUpdate, projectId}) => {
  //console.log('advdsvsd',task)
  const router = useRouter();
  const [remainingDays, setRemainingDays] = useState("");
  const [UsersList, setUsersList] = useState([]);
  const [DeleteModalVisible, SetDeleteModalVisible] = useState(false);
  const [EditModalVisible, SetEditModalVisible] = useState(false);
  const SingleProject = useSelector((state) => state.Projects.SingleProject);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/users/getall",
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
      router.push("/");
    }
  }, [user]);
  const TaskAssignedCheck = (taskId) => {
    const task = SingleProject?.tasks?.find((data) => data._id === taskId);
    return task?.subassignedTo.includes(user?._id);
  };

  const openDeleteModal = () => {
    SetDeleteModalVisible(true);
  };
  const openEditModal = () => {
    SetEditModalVisible(true);
  };
  const closeEditModal = () => {
    SetEditModalVisible(false);
  };
  const closeDeleteModal = () => {
    SetDeleteModalVisible(false);
  };

  const checkRemainingDays = (dueDate) => {
    const today = new Date();
    const dueDateTime = new Date(dueDate);
    if (dueDateTime >= today) {
      const timeDiff = dueDateTime.getTime() - today.getTime();
      //console.log(timeDiff)
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

      setRemainingDays(`${daysDiff}`);
    } else {
      setRemainingDays("Task overdue");
    }
  };

  useEffect(() => {
    checkRemainingDays(task.dueDate);
  }, [task.dueDate]);

  return (
    <div className='p-4 bg-white rounded-sm shadow-sm mb-4 relative'>
      {isAdmin && (
        <div className='flex items-center justify-end space-x-2'>
          <div
            onClick={() => openEditModal()}
            className='text-xl cursor-pointer'
          >
            <FaRegPenToSquare />
          </div>
          <div
            onClick={() => openDeleteModal()}
            className='text-xl cursor-pointer'
          >
            <FaTrash />
          </div>
        </div>
      )}
      <h1 className='text-lg text-blue-500 font-semibold'>
        Epic Name: {task.epictitle.map((title) => title.label.toString())}
      </h1>
      <h1 className='font-medium'>Task: {task.subtitle}</h1>
      <div className=''>
        Task Assigned By:{" "}
        <span className='font-semibold'>{task.subassignedBy}</span>
      </div>
      <div>
        Task Priority:{" "}
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
      <div className=''>Task Description: {task.subdescription}</div>
      <div
        className={`${
          task.completed === true
            ? "text-green-500 font-semibold"
            : "text-red-500 font-semibold"
        }`}
      >
        Task Status: {task.completed === true ? "Completed" : "Not Completed"}
      </div>
      <div className='block'>
        <span className='block'>
          Created on :{" "}
          {task.createdAt ? moment(task.createdAt).format("lll") : "----"}
        </span>
        {!task.completed && (
          <>
            <span className='block text-red-500 font-semibold'>
              Due Date :{" "}
              {task.dueDate ? moment(task.dueDate).format("ll") : "----"}
            </span>
            <span className='block text-red-500 font-semibold'>
              Days Remaining: {remainingDays}
            </span>
          </>
        )}

        {/*<span className='block'>Last Updated :{task.updatedAt ? moment(task.updatedAt).format('lll') : '-----'}</span>*/}
      </div>
      <div>
        Task Assigned To :
        {task.subassignedTo.map((userId, index) => {
          const assignedUser = UsersList.find((user) => user._id === userId);
          return (
            <span key={index} className=''>
              {" "}
              {assignedUser?.name},
            </span>
          );
        })}
      </div>
      {TaskAssignedCheck(task._id) && (
        <div className='flex justify-end'>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              onChange={(e) => handleTaskUpdate(task._id, e.target.checked)}
              checked={task.completed}
              disabled={task.completed}
              className='sr-only peer'
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className='ms-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
              Completed
            </span>
          </label>
        </div>
      )}
      {EditModalVisible && (
        <EditTaskModal
          projectId={projectId}
          taskData={SingleProject}
          taskid={task._id}
          assignedMembersList={SingleProject.assignedMembers}
          onClose={closeEditModal}
        />
      )}
      {DeleteModalVisible && (
        <TaskDeleteModal
          taskDetails={task}
          projectId={projectId}
          taskid={task._id}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
};

export default Task;
