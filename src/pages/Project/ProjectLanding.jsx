import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../checkbox.css";
import KanbanBoard from "../../components/kanbanDistict/KanbanBoard";
import FilterOptions from "../../components/kanbanDistict/FilterOptions";
import { useSelector } from "react-redux";

const ProjectLanding = () => {
  const { projectId } = useParams();
  const user = useSelector((state) => state.user?.user);
  const navigate = useNavigate();

  const [showFilterOptions, setShowFilterOptions] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  if (!projectId || projectId === "null" || !user) {
    return (
      <div className="w-full bg-gray-900 h-full p-5 mt-10 flex justify-center items-center flex-wrap space-x-2">
        <svg
          className="w-10 h-10 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.5 10a2.5 2.5 0 1 1 5 .2 2.4 2.4 0 0 1-2.5 2.4V14m0 3h0m9-5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <p className="text-lg text-gray-300 dark:text-white">
          There is no project selected, please try again later, or wait till a
          project is created and a task is assigned to you.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full bg-gray-900 h-full p-5 flex flex-col justify-start mt-10 items-start">
        <div className="self-end relative">
          <button
            onClick={toggleFilterOptions}
            className="px-4 py-2 mt-5 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out"
          >
            Filter Tasks
          </button>
          {showFilterOptions && (
            <div className="origin-top-right absolute right-0 mt-2  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <FilterOptions />
            </div>
          )}
        </div>
        <KanbanBoard projectId={projectId} />
      </div>
    </div>
  );
};

export default ProjectLanding;
