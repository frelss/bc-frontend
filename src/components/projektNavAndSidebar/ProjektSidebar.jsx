import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setActiveProjectId } from "../../redux/projectSlice";
import axios from "axios";

const ProjektSidebar = ({ isSidebarVisible, toggleSidebar }) => {
  const BASE_URL = "https://prmanagement-api.onrender.com/api";

  const user = useSelector((state) => state.user.user);
  const userId = useSelector((state) => state.user?.user?.id);
  const projectId = useSelector((state) => state.projects?.activeProjectId);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [myTasksCount, setMyTasksCount] = useState(0);
  const [projectsItems, setProjectsItems] = useState([]);

  //projectID
  useEffect(() => {
    const fetchRelevantProjects = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `${BASE_URL}/projects/user/${userId}/projects`
          );
          const projects = response.data.data.projects;
          setProjectsItems(projects);

          // Select the first project if no valid projectId is stored or if it's no longer valid
          let projectIdToSelect = localStorage.getItem("activeProjectId");
          if (
            !projectIdToSelect ||
            !projects.find((p) => p._id === projectIdToSelect)
          ) {
            projectIdToSelect = projects.length > 0 ? projects[0]._id : null;
            localStorage.setItem("activeProjectId", projectIdToSelect);
          }

          if (projectIdToSelect && projectIdToSelect !== projectId) {
            dispatch(setActiveProjectId(projectIdToSelect));
            navigate(`/projekt/${projectIdToSelect}`, { replace: true });
          }
        } catch (error) {
          console.error("Error fetching relevant projects:", error);
        }
      }
    };

    fetchRelevantProjects();
  }, [userId, projectId, dispatch, navigate, projectsItems]);

  //taskCount
  useEffect(() => {
    const fetchMyTasksCount = async () => {
      if (projectId && userId) {
        try {
          const res = await axios.get(
            `${BASE_URL}/projects/${projectId}/tasks/assigned/${userId}`
          );
          setMyTasksCount(res.data.length);
        } catch (err) {
          console.error("Error fetching tasks:", err);
        }
      }
    };

    fetchMyTasksCount();
  }, [projectId, userId, BASE_URL]);

  // Választ projektet
  const handleSelectProject = (newProjectId) => {
    dispatch(setActiveProjectId(newProjectId));
    localStorage.setItem("activeProjectId", newProjectId);
    navigate(`/projekt/${newProjectId}`, { replace: true });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {projectsItems?.length !== 0 || user?.role === "admin" ? (
        <aside
          className={`fixed top-15 left-0 z-40 h-screen transition-transform ${
            isSidebarVisible ? "translate-x-0 pt-2" : "-translate-x-full pt-20"
          } bg-white border-r border-gray-200 lg:translate-x-0 dark:bg-gray-800 dark:border-gray-700 lg:pt-20`}
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li>
                <Link
                  to={`/projekt/${projectId}`}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 18"
                  >
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Board</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/projekt/myTasks"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    My Tasks
                  </span>
                  <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {myTasksCount}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/projekt/${projectId}/dashboard`}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  <span className="ms-3">Dashboard</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  aria-controls="dropdown-example"
                  data-collapse-toggle="dropdown-example"
                  onClick={toggleDropdown}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                  </svg>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                    Projects
                  </span>
                  <svg
                    className="w-3 h-3 ml-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>

                <ul
                  id="dropdown-example"
                  className={`${
                    isDropdownOpen ? "block" : "hidden"
                  } py-2 space-y-2`}
                >
                  {projectsItems && projectsItems?.length > 0 ? (
                    projectsItems?.map((project, index) => {
                      //active project
                      const isActive = project._id === projectId;

                      return (
                        <li key={project._id || index}>
                          <Link
                            to={`/projekt/${project._id}`}
                            onClick={() => handleSelectProject(project._id)}
                            className={`flex items-center w-full p-2 pl-5 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${
                              isActive ? "bg-blue-100 dark:bg-blue-700" : ""
                            }`}
                          >
                            <svg
                              className="w-4 h-4 mr-5 text-gray-200"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2.2V7H4.2l.4-.5 3.9-4 .5-.3Zm2-.2v5a2 2 0 0 1-2 2H4v11c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="flex-1 ms-3">
                              {project.title.length > 3
                                ? `${project.title.substring(0, 3)}...`
                                : project.title}
                            </span>
                          </Link>
                        </li>
                      );
                    })
                  ) : (
                    <li>No Projects</li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </aside>
      ) : null}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default ProjektSidebar;
