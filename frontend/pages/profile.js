import React, { useState } from 'react';
import * as cookie from 'cookie';
import axios from 'axios';
import Link from 'next/link';
import Header from '@/components/Header';
import { FaExchangeAlt } from 'react-icons/fa';
import PasswordModal from '@/components/PasswordModal';

const Profile = ({ user }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const openPasswordModal = () => {
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded shadow">
          <div className="text-3xl font-semibold mb-4 text-center">User Profile</div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Name:</div>
            <div>{user.name}</div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Email:</div>
            <div>{user.email}</div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Employee ID:</div>
            <div>{user.empId}</div>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={openPasswordModal}
              className="bg-blue-500 flex text-white font-semibold px-4 py-2 rounded"
            >
              <FaExchangeAlt className="mr-3 mt-1" /> Change Password
            </button>
            <Link href="/">
              <span className="bg-blue-500 px-4 py-2 rounded text-white font-semibold">
                Back to Home Page
              </span>
            </Link>
          </div>
        </div>
      </div>
      {showPasswordModal && <PasswordModal onClose={closePasswordModal} />}
    </>
  );
};

export default Profile;

export async function getServerSideProps(context) {
  const { req } = context;
  const cookies = cookie.parse(req.headers.cookie || '');
  const user = JSON.parse(cookies.user || '{}');
  const token = user.token;

  try {
    const response = await axios.get(
      "https://task-management-backend-hpay.onrender.com/api/users/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const userData = response.data;

    return {
      props: { user: userData },
    };
  } catch (error) {
    console.log('Error fetching user data:', error);
    return { props: { user: {} } };
  }
}
