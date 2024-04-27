import { NavLink } from "react-router-dom";

const AdminConsoleNavbar = () => {
  const projectId = localStorage.getItem("activeProjectId") || "";

  return (
    <div className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <h1 className="text-lg font-bold">Admin Console</h1>

      <div className="flex items-center">
        <NavLink
          to={`/projekt/${projectId}`}
          className="bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-4"
        >
          Back
        </NavLink>

        <NavLink
          to="/"
          className="bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-4"
        >
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default AdminConsoleNavbar;
