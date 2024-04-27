import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../redux/projectSlice";
import { ProjectCreationModal, UserOptions } from "../index";
import logo from "../../pics/pr-navbar.png";
import ProjektSidebar from "./ProjektSidebar";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const ProjektNavbar = () => {
  const user = useSelector((state) => state.user.user);
  const userId = useSelector((state) => state.user?.user?.id);
  const projectId = useSelector((state) => state.projects.activeProjectId);

  //states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [projectsItems, setProjectsItems] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setIsMenuVisible(newWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //projectID
  useEffect(() => {
    const fetchRelevantProjects = async () => {
      try {
        if (userId) {
          const response = await axios.get(
            `${BASE_URL}/projects/user/${userId}/projects`
          );
          const projects = response.data.data.projects;
          setProjectsItems(projects);
        }
      } catch (error) {
        console.error("Error fetching relevant projects:", error);
      }
    };

    fetchRelevantProjects();
    //const interval = setInterval(fetchRelevantProjects, 1000);

    //return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const openModal = () => {
    if (user.role === "admin" || user.role === "pr_manager")
      setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleMenuVisibility = () => {
    setIsMenuVisible((prev) => !prev);
  };

  const navItems = [
    { name: "Overview", path: `/projekt/${projectId}/projektOverview` },
    { name: "Board", path: `/projekt/${projectId}` },
    { name: "Templates / a-assign", path: `/projekt/${projectId}/templates` },
    { name: "Dashboard", path: `/projekt/${projectId}/dashboard` },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b-2 bg-gray-900">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center">
          {/* Menu button projectItems szerint */}
          <button
            onClick={toggleSidebar}
            className="inline-flex items-center p-2 text-sm rounded-lg focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600 lg:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {projectsItems?.length !== 0 || user?.role === "admin" ? (
            <Link to={`/projekt/${projectId}`} className="flex items-center">
              <img
                src={logo}
                className="h-6 sm:h-8 me-3"
                alt="pr-management-logo"
              />
              <span className="hidden lg:block text-xl font-semibold">
                Pr. Management
              </span>
            </Link>
          ) : (
            <Link className="flex items-center">
              <img
                src={logo}
                className="h-6 sm:h-8 me-3"
                alt="pr-management-logo"
              />
              <span className="hidden lg:block text-xl font-semibold">
                Pr. Management
              </span>
            </Link>
          )}
        </div>
        <div className="flex md:order-2">
          <UserOptions />

          {/* Menu button projectItems szerint */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 ml-5 justify-center text-sm  rounded-lg md:hidden  focus:outline-none focus:ring-2  text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
            onClick={toggleMenuVisibility}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div>
          <div>
            {projectsItems?.length !== 0 || user?.role === "admin" ? (
              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">
                <li>
                  <NavLink
                    to={`/projekt/${projectId}/projektOverview`}
                    className={({ isActive }) =>
                      isActive
                        ? "block py-2 px-3 rounded md:p-0 text-blue-500 hover:bg-gray-700"
                        : "block py-2 px-3 rounded md:p-0 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700"
                    }
                  >
                    Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/projekt/${projectId}`}
                    end
                    className={({ isActive }) =>
                      isActive
                        ? "block py-2 px-3 rounded md:p-0 text-blue-500 hover:bg-gray-700"
                        : "block py-2 px-3 rounded md:p-0 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700"
                    }
                  >
                    Board
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/projekt/${projectId}/templates`}
                    className={({ isActive }) =>
                      isActive
                        ? "block py-2 px-3 rounded md:p-0 text-blue-500 hover:bg-gray-700"
                        : "block py-2 px-3 rounded md:p-0 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700"
                    }
                  >
                    Templates & Assign
                  </NavLink>
                </li>
                <li>
                  <button
                    className="block py-2 px-3 rounded md:p-0 md:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700"
                    onClick={openModal}
                  >
                    New Project
                  </button>
                </li>
                <li>
                  <NavLink
                    to={`/projekt/${projectId}/dashboard`}
                    className={({ isActive }) =>
                      isActive
                        ? "block py-2 px-3 rounded md:p-0 text-blue-500 hover:bg-gray-700"
                        : "block py-2 px-3 rounded md:p-0 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700"
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      {isMenuVisible && projectsItems.length !== 0 && (
        <div className="absolute inset-x-0 top-0 z-10 p-2 mt-20 md:hidden  rounded-lg shadow-lg bg-gray-800">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="block px-3 py-2  rounded  hover:bg-gray-700 hover:text-white text-gray-300"
                  onClick={() => setIsMenuVisible(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <button
                className="w-full text-left px-3 py-2  rounded  md:hover:bg-transparent  md:p-0 hover:text-white text-white hover:bg-gray-700"
                onClick={() => {
                  openModal();
                  setIsMenuVisible(false);
                }}
              >
                New Project
              </button>
            </li>
          </ul>
        </div>
      )}
      {isSidebarVisible && projectsItems.length !== 0 && (
        <ProjektSidebar
          isSidebarVisible={isSidebarVisible}
          toggleSidebar={toggleSidebar}
        />
      )}
      <ProjectCreationModal isOpen={isModalOpen} onClose={closeModal} />
    </nav>
  );
};

export default ProjektNavbar;
