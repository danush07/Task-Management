import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';;
import { MdAddTask } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import ProjectModal from '@/components/AddProjectModal';
import { useSelector } from 'react-redux';

function HomePage() {
//
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.isAdmin === true;
  const [ProjectModalVisible,SetProjectModalVisible] = useState(false)


const handleOpenModal = () =>{
SetProjectModalVisible(true)
}

const closeModal = () =>{
  SetProjectModalVisible(false)
}
  return (
    <>
      <Header />
      <div className='h-screen font-[inter] flex flex-col items-center justify-center bg-gray-100 bg-gradient-to-r from-rose-100 to-teal-100'>
        <h1 className='text-5xl text-center text-gray-900 font-bold'>
          Welcome to{" "}
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500'>
            Task Management
          </span>{" "}
          System!
        </h1>
        {user ? (
          <>
            <p className='font-semibold mt-4'>
              Hello{" "}
              <span className='text-blue-500'>
                <Link href='/profile'>{user.name}</Link>
              </span>{" "}
              ! What Whould you Like to Do Today...
            </p>
            <div className='flex flex-col md:flex-row items-center mt-8 space-y-4 md:space-y-0 md:space-x-4'>
              {isAdmin && (
                <div
                  onClick={handleOpenModal}
                  className='flex transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300  text-white font-medium py-2 px-4 rounded-lg text-center text-sm '
                >
                  <MdAddTask className='text-xl mr-2' /> Add Project
                </div>
              )}
              <Link
                href='/dashboard'
                className='flex  text-white transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 font-medium py-2 px-4 rounded-lg text-center text-sm '
              >
                <FaEye className='text-xl mr-2' /> View Projects
              </Link>
            </div>
          </>
        ) : (
          <p className='font-semibold mt-4'>
            Please{" "}
            <Link href='/login' className='text-blue-600'>
              Login
            </Link>{" "}
            or{" "}
            <Link href='/register' className='text-blue-600'>
              Register
            </Link>{" "}
            to view the list of Projects
            <div className='mt-12 text-center'>
              Get Admin Access by Registering as {" "}
              <Link href='/admin-register' className='text-blue-600'>
                Admin
              </Link>
            </div>
          </p>
        )}
      </div>
      {ProjectModalVisible && <ProjectModal onClose={closeModal} />}
    </>
  );
}

export default HomePage;
