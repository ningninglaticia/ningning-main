import React, { useEffect } from 'react';
import { LuCheck } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';

const Toast = ({ isShow, message, type, onClose }) => {
  useEffect(() => {
    if (isShow) {
      const timeoutId = setTimeout(onClose(), 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [isShow, onClose]);

  return (
    <div
      className={`fixed top-20 right-6 transition-opacity duration-500 ease-in-out ${
        isShow ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`min-w-52 bg-white border shadow-2xl rounded-md relative p-4 flex gap-3 items-center
          ${type === 'delete' ? 'after:bg-red-500' : 'after:bg-green-500'}
          after:absolute after:w-1 after:h-full after:left-0 after:top-0`}
      >
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full ${
            type === 'delete' ? 'bg-red-50' : 'bg-green-50'
          }`}
        >
          {type === 'delete' ? (
            <MdDeleteOutline className='text-xl text-red-500' />
          ) : (
            <LuCheck className='text-xl text-green-500' />
          )}
        </div>
        <p className='text-sm font-medium text-slate-800'>{message}</p>
      </div>
    </div>
  );
};

export default Toast;
