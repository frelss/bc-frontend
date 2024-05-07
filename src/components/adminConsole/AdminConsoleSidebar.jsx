import { useState } from "react";
import { Link } from "react-router-dom";

const AdminConsoleSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeSidebar = () => setIsOpen(false);

  const navbarHeight = "72px";

  return (
    <div>
      {isOpen && (
        <div
          className="lg:hidden h-full fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        ></div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden text-gray-900 p-2 m-2 rounded z-50 fixed left-0 top-1/2 transform -translate-y-1/2 translate-x-0"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
          </svg>
        )}
      </button>

      <div
        className={`transform top-0 lg:top-auto left-0 w-64 bg-gray-700 p-5 text-white fixed h-full z-40 ease-in-out duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
        style={{ top: isOpen ? navbarHeight : "0" }}
      >
        <div className="space-y-2">
          <Link
            to="/adminConsole"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-600"
          >
            <svg
              className="w-5 h-5 fill-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            Users
          </Link>
          <Link
            to="/adminConsole/adminProjects"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-600"
          >
            <svg
              className="w-5 h-5 fill-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M3 13h2v-2H3v2zm4 0h2v-2H7v2zm-4 4h2v-2H3v2zm4 0h2v-2H7v2zm2-12v2h2V5h-2zm4 12h2v-2h-2v2zm0-4h2v-2h-2v2zm2-8v2h2V5h-2zm-6 0v2h2V5H9zm4 4h2v-2h-2v2zm-4 0h2v-2H9v2zm-2 4h2v-2H7v2zm10 4h2v-2h-2v2zm-6 0h2v-2h-2v2z" />
            </svg>
            Projects
          </Link>
          <Link
            to="/adminConsole/adminReports"
            className="flex items-center py-2.5 px-4 rounded hover:bg-gray-600"
          >
            <svg
              className="w-5 h-5 fill-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2h5v7h-5V5zm-6 0h5v7H6V5zm0 12v-7h5v7H6zm6 0v-7h5v7h-5z" />
            </svg>
            Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminConsoleSidebar;
