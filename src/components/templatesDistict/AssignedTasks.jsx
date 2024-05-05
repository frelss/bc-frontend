import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const AssignedTasks = () => {
  const BASE_URL = "https://prmanagement-api.onrender.com/api";

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [message, setMessage] = useState("");

  //selector
  const user = useSelector((state) => state.user.user);

  //fetch
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = `${BASE_URL}/projects/user/${user.id}/projects`;
        const response = await axios.get(url);
        setProjects(response.data.data.projects);
        setMessage("");
      } catch (error) {
        console.error("Error fetching projects:", error);
        setMessage("Error fetching projects, please try again.");
      }
    };

    if (user.role === "pr_manager" || user.role === "admin") {
      fetchProjects();
    }
  }, [user]);

  //handlers
  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
    setMessage("");
  };

  const handleAutoAssign = async () => {
    if (selectedProject) {
      try {
        const response = await axios.post(
          `${BASE_URL}/projects/${selectedProject}/autoAssignTasks`
        );

        setMessage(response.data.message);
      } catch (error) {
        console.error(
          "Error auto-assigning tasks:",
          error.response?.data?.message || "An error occurred"
        );
        setMessage(
          error.response?.data?.message ||
            "Error auto-assigning tasks, please try again."
        );
      }
    } else {
      setMessage("Please select a project first.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 w-full max-w-2xl">
      <h2 className="text-xl text-white mb-4 text-center">Task Distribution</h2>
      <div className="bg-gray-700 p-4 rounded-md mb-4">
        <select
          id="projectSelect"
          className="bg-gray-600 text-white rounded p-2 w-full focus:outline-none mt-2"
          onChange={handleProjectChange}
          value={selectedProject}
        >
          <option value="">Choose a project...</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>
      {message && (
        <div className="text-white bg-blue-500 p-2 mb-3 rounded">{message}</div>
      )}
      {(user.role === "pr_manager" || user.role === "admin") && (
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full focus:outline-none"
          onClick={handleAutoAssign}
        >
          Auto-Assign Tasks
        </button>
      )}
    </div>
  );
};

export default AssignedTasks;
