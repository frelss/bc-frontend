import { useState, useEffect, useRef } from "react";
import { createSelector } from "reselect";
import { fetchUsers } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

//! selectors
const selectUserList = (state) => state.user.userList;
const selectPrManagers = createSelector([selectUserList], (userList) =>
  userList.filter((user) => user.role === "pr_manager")
);

const ProjectRoles = ({ projectId }) => {
  const BASE_URL = "http://localhost:3000/api";

  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  //selectors
  const user = useSelector((state) => state.user.user);
  const projectDetails = useSelector((state) =>
    state.projects.projectsItems.find((project) => project._id === projectId)
  );
  const prManagers = useSelector(selectPrManagers);

  //states
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPrManager, setSelectedPrManager] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [localProjectDetails, setLocalProjectDetails] =
    useState(projectDetails);

  //useEffects
  useEffect(() => {
    dispatch(fetchUsers({ role: "pr_manager" }));
  }, [dispatch]);

  useEffect(() => {
    setLocalProjectDetails(projectDetails);
  }, [projectDetails]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }

      if (
        selectedPrManager &&
        showOptions &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedPrManager, showOptions]);

  //handlers
  const handleAddMemberClick = () => {
    if (user.role === "pr_manager" || user.role === "admin") {
      setShowDropdown(!showDropdown);
    }
  };

  const handlePrManagerSelect = (manager) => {
    if (localProjectDetails.prManager.some((u) => u._id === manager._id)) {
      toast.error("This PR Manager is already added to the project.");
      return;
    }

    setSelectedPrManager(manager);
    setShowDropdown(false);
    axios
      .patch(`${BASE_URL}/projects/updatePrManagers/${projectId}`, {
        prManagerId: manager._id,
      })
      .then((response) => {
        console.log(response.data);
        setLocalProjectDetails((prev) => ({
          ...prev,
          prManager: [...prev.prManager, manager],
        }));
        setSelectedPrManager(null);
        toast.success("Pr. manager added");
      })
      .catch((error) => {
        console.error("Error updating PR Manager:", error.response);
      });
  };

  const removePrManager = (prManagerId) => {
    if (user.role === "pr_manager" || user.role === "admin") {
      axios
        .patch(`${BASE_URL}/projects/removePrManager/${projectId}`, {
          prManagerId,
        })
        .then(() => {
          const updatedUsers = localProjectDetails.prManager.filter(
            (manager) => manager._id !== prManagerId
          );
          setLocalProjectDetails({
            ...localProjectDetails,
            prManager: updatedUsers,
          });
          toast.success("Pr. manager removed!");
        })
        .catch((error) => {
          console.error("Error removing PR Manager:", error.response);
        });
    } else {
      toast.error("You don't have permission to remove PR managers.");
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 mb-5 rounded-lg shadow space-y-4">
      <h4 className="text-lg font-semibold">Project Roles</h4>
      {(user.role === "pr_manager" || user.role === "admin") && (
        <div className="relative inline-block text-left">
          <button
            onClick={handleAddMemberClick}
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            Add PR Manager
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 divide-y divide-gray-600"
            >
              <ul className="py-1 text-sm text-gray-300">
                {prManagers.length > 0 ? (
                  prManagers.map((manager) => (
                    <li
                      key={manager._id}
                      className="block px-4 py-2 hover:bg-gray-600"
                      role="menuitem"
                    >
                      <button
                        className="w-full text-left"
                        onClick={() => handlePrManagerSelect(manager)}
                      >
                        {manager.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="block px-4 py-2 text-gray-500">
                    No PR Managers available
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-wrap">
        {localProjectDetails?.prManager.map((manager, index, arr) => (
          <div
            key={manager._id}
            className="flex items-center m-2 bg-gray-700 rounded-full px-3 py-1 text-sm relative"
          >
            <span>{manager.name}</span>
            {(user.role === "pr_manager" || user.role === "admin") &&
              arr.length > 1 && (
                <button
                  onClick={() => removePrManager(manager._id)}
                  className="ml-2 text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={arr.length <= 1}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectRoles;
