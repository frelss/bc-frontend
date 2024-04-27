import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProject, fetchProjects } from "../../redux/projectSlice";
import { Form } from "react-router-dom";
import "../../darkDatePicker.css";

const ProjectCreationModal = ({ isOpen, onClose }) => {
  const userId = useSelector((state) => state.user?.user?.id);

  const dispatch = useDispatch();

  const [projectsData, setProjectsData] = useState({
    title: "",
    status: "On Track",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  //handlers
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !projectsData.title ||
      !projectsData.startDate ||
      !projectsData.endDate
    ) {
      setErrorMessage("All fields must be filled out!");
      return;
    }

    if (!projectsData.description || projectsData.description.trim() === "") {
      setErrorMessage("Description is required!");
      return;
    }

    if (new Date(projectsData.endDate) < new Date(projectsData.startDate)) {
      setErrorMessage("End Date cannot be earlier than Start Date!");
      return;
    }

    try {
      await dispatch(createProject({ projectsData, userId }));
      await dispatch(fetchProjects());
      onClose();
      setProjectsData({
        title: "",
        status: "On Track",
        description: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      setErrorMessage("Failed to create project!");
    }
  };

  const handleChange = (e) => {
    setProjectsData({ ...projectsData, [e.target.id]: e.target.value });
    setErrorMessage("");
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  //! :)
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={handleOutsideClick}
    >
      <div className="relative w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl">
        <div className="p-5 text-gray-100">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-xl font-semibold">Create New Project</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-100"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <Form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className=" border border-gray-300 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:texWhite dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="What's the project name?"
                  required
                  value={projectsData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="startDate"
                  className="block mb-2 text-sm font-medium text-gray-200"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="datepickerbg border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  value={projectsData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="endDate"
                  className="block mb-2 text-sm font-medium text-gray-200"
                >
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  className="datepickerbg border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  value={projectsData.endDate}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-gray-200"
                >
                  Select status
                </label>
                <select
                  id="status"
                  name="status"
                  value={projectsData.status}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="On Track">On Track</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Off Track">Off Track</option>
                  <option value="Completed">Completed</option>
                  <option value="Not started">Not started</option>
                </select>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-200 "
                >
                  Project Description
                </label>
                <textarea
                  id="description"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-white   bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your project description here"
                  value={projectsData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleSubmit}
            >
              <svg
                className="me-1 -ms-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Create Project
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreationModal;
