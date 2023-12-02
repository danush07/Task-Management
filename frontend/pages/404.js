import Link from 'next/link';
import React from 'react'
import { FaRegSadTear } from "react-icons/fa";

export default function Custom404() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <p className="text-xl mt-4 mb-8">Oops! Something went wrong...</p>
            <FaRegSadTear className='text-3xl ml-28 text-center flex items-center mb-11'/>
            <Link href="/dashboard">
              <div className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Return Back to Dashboard
              </div>
            </Link>
          </div>
        </div>
      );
}




