import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

const ProjectSelector = ({ onProjectChange }) => {
  const dispatch = useDispatch();

  const BASE_URL = "https://prmanagement-api.onrender.com/api";

  const userId = useSelector((state) => state.user?.user?.id);

  const [projectsItems, setProjectsItems] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    const fetchRelevantProjects = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `${BASE_URL}/projects/user/${userId}/projects`
          );
          const projects = response.data.data.projects;
          setProjectsItems(projects);

          let projectIdToSelect = localStorage.getItem("activeProjectId");
          if (
            !projectIdToSelect ||
            !projects.find((p) => p._id === projectIdToSelect)
          ) {
            projectIdToSelect = projects.length > 0 ? projects[0]._id : null;
            localStorage.setItem("activeProjectId", projectIdToSelect);
            setSelectedProjectId(projectIdToSelect);
          } else {
            setSelectedProjectId(projectIdToSelect);
          }
          onProjectChange(projectIdToSelect);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };

    fetchRelevantProjects();
  }, [userId, dispatch, onProjectChange]);

  const handleChange = (e) => {
    const projectId = e.target.value;
    setSelectedProjectId(projectId);
    onProjectChange(projectId);
    localStorage.setItem("activeProjectId", projectId);
  };

  return (
    <div className="relative max-w-sm mx-auto mb-10">
      <select
        id="projectSelect"
        value={selectedProjectId}
        onChange={handleChange}
        className="block appearance-none w-full bg-gray-700 text-white py-2 pl-10 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-600 focus:border-gray-500"
      >
        <option value="">Choose a project...</option>
        {projectsItems.map((project) => (
          <option key={project._id} value={project._id}>
            {project.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectSelector;
