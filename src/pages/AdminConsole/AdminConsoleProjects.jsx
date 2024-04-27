import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  deleteProject,
  updateProjectStatus,
  updateProjectDeadline,
} from "../../redux/projectSlice";
import { toast } from "react-toastify";
import StatusUpdateModal from "../../components/adminConsole/StatusUpdateModal";
import SetDeadlineModal from "../../components/adminConsole/SetDeadlineModal";

const AdminConsoleProjects = () => {
  const dispatch = useDispatch();

  //states
  const [activeEditDropdown, setActiveEditDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectStatus, setProjectStatus] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjectList, setFilteredProjectList] = useState([]);

  const { projectsItems, isLoading, error } = useSelector(
    (state) => state.projects
  );

  //useEffect
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = projectsItems.filter(
        (project) =>
          project.title.toLowerCase().includes(lowercasedSearchTerm) ||
          project.status.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredProjectList(filtered);
    } else {
      setFilteredProjectList(projectsItems);
    }
  }, [projectsItems, searchTerm]);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  //handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeadlineSave = async (newDeadline, projectId) => {
    if (!projectId) {
      console.error("projectId is undefined or null");
      return;
    }

    try {
      await dispatch(updateProjectDeadline({ projectId, newDeadline }))
        .unwrap()
        .then(() => {
          toast.success("Project deadline updated!", {});
          setIsDeadlineModalOpen(false);
          dispatch(fetchProjects());
        })
        .catch((error) => {
          console.error("Failed to update deadline: " + error.message, {});
        });
    } catch (error) {
      console.error("Error dispatching updateProjectDeadline action:", error);
    }
  };

  const handleStatusChange = async (newStatus, projectId) => {
    await dispatch(updateProjectStatus({ projectId, newStatus }))
      .unwrap()
      .then(() => {
        toast.success("Project status updated!", {});
        dispatch(fetchProjects());
      })
      .catch((error) => {
        console.error("Failed to update status: " + error.message, {});
      });
  };

  const handleUpdateStatusClick = (project) => {
    setCurrentProject(project);
    setProjectStatus(project.status);
    setIsModalOpen(true);
    setActiveEditDropdown(null);
  };

  const handleSetDeadlineClick = (project) => {
    if (!project || !project._id) {
      console.error("Invalid project or project._id is undefined.");
      return;
    }

    setCurrentProject(project);
    setProjectDeadline(project.deadline);
    setIsDeadlineModalOpen(true);
    setActiveEditDropdown(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };

  const handleEditClick = (projectId) => {
    setActiveEditDropdown(activeEditDropdown === projectId ? null : projectId);
  };

  const handleDeleteProject = async (projectId) => {
    await dispatch(deleteProject(projectId))
      .unwrap()
      .then(() => {
        toast.success("Project deleted!", {
          theme: "colored",
        });
        dispatch(fetchProjects());
      })
      .catch((error) => {
        console.error("Failed to delete the project: ", error);
      });
  };

  //date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="text-black">
      <StatusUpdateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onStatusChange={handleStatusChange}
        currentStatus={projectStatus}
        projectId={currentProject?._id}
      />
      <SetDeadlineModal
        isOpen={isDeadlineModalOpen}
        onClose={() => setIsDeadlineModalOpen(false)}
        onDeadlineChange={handleDeadlineSave}
        currentDeadline={projectDeadline}
        projectId={currentProject?._id}
        currentProject={currentProject}
      />

      <h2 className="text-2xl font-bold mb-6">Projects</h2>
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          className="p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Project Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Project Managers
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProjectList.map((project) => (
              <tr key={project._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {project.title}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="text-gray-900 whitespace-no-wrap">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        project.status === "On Track"
                          ? "bg-green-500"
                          : project.status === "At Risk"
                          ? "bg-red-500"
                          : project.status === "Off Track"
                          ? "bg-red-800"
                          : project.status === "Completed"
                          ? "bg-slate-400"
                          : "bg-gray-600 text-gray-200"
                      }`}
                    >
                      {project.status}
                    </span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {project?.startDate ? formatDate(project.startDate) : ""}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {project?.endDate ? formatDate(project.endDate) : ""}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {project.prManager && project.prManager.length > 0
                      ? project.prManager.map((u) => u.name).join(", ")
                      : "Unknown"}
                  </p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  <button
                    className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm mr-2"
                    onClick={() => handleEditClick(project._id)}
                  >
                    Edit
                  </button>
                  {activeEditDropdown === project._id && !isModalOpen && (
                    <div className="absolute right-0 border mr-20 py-2 w-48 bg-white rounded-md shadow-xl">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleUpdateStatusClick(project)}
                      >
                        Update Status
                      </a>
                      <a
                        href="#set-deadline"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleSetDeadlineClick(project)}
                      >
                        Set Deadline
                      </a>
                    </div>
                  )}
                  <button
                    className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminConsoleProjects;
