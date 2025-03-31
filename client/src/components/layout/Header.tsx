import React, { useState } from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="z-10 flex items-center justify-between flex-shrink-0 h-16 px-4 bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="p-2 mr-2 rounded-md md:hidden hover:bg-gray-100 dark:hover:bg-neutral-700"
        >
          <i className="text-xl bx bx-menu"></i>
        </button>
        
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="text-gray-400 bx bx-search dark:text-gray-500"></i>
          </div>
          <input 
            type="text" 
            className="block w-full py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-gray-400 dark:text-white sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Search for jobs, companies, skills..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          id="darkModeToggle" 
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
          onClick={() => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', document.documentElement.classList.contains('dark').toString());
          }}
        >
          <i className="text-xl bx bx-moon dark:hidden"></i>
          <i className="hidden text-xl text-yellow-300 bx bx-sun dark:block"></i>
        </button>
        
        <button className="relative p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
          <i className="text-xl bx bx-bell"></i>
          <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">3</span>
        </button>
        
        <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700">
          <i className="text-xl bx bx-help-circle"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
