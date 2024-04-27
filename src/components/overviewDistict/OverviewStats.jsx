import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, updateProjectStatus } from "../../redux/projectSlice";
import { toast } from "react-toastify";

const OverviewStats = ({ projectId }) => {
  const BASE_URL = "http://localhost:3000/api";

  const dispatch = useDispatch();

  //data
  const [tasksData, setTasksData] = useState({
    completed: 0,
    total: 0,
    pending: 0,
  });
  const projectDetails = useSelector((state) =>
    state.projects.projectsItems.find((project) => project._id === projectId)
  );
  const [newStatus, setNewStatus] = useState(
    projectDetails?.status || "Not started"
  );

  //selectors
  const user = useSelector((state) => state.user.user);

  //fetching
  useEffect(() => {
    dispatch(fetchProjects(projectId));
  }, [dispatch, projectId]);

  //fetching
  useEffect(() => {
    if (projectId) {
      fetch(`${BASE_URL}/projects/${projectId}/allTasks`)
        .then((response) => response.json())
        .then((tasks) => {
          const completed = tasks.filter((task) => task.isCompleted).length;
          const total = tasks.length;
          const pending = total - completed;

          setTasksData({
            completed,
            pending,
            total,
          });
        })
        .catch((error) => console.error("Error fetching tasks:", error));
    }
  }, [projectId]);

  //date formattinf
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString)
      .toLocaleDateString("en-US", options)
      .replace(",", ".");
  };

  //handlers
  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const updateStatus = () => {
    dispatch(updateProjectStatus({ projectId, newStatus }));
    toast.success("Status updated successfully!");
  };

  if (!projectDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mb-6 text-white">
      {(user.role === "pr_manager" || user.role === "admin") && (
        <div className="update-status-section bg-gray-800 p-5 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Update Project Status
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <select
              value={newStatus}
              onChange={handleStatusChange}
              className="status-select bg-gray-700 text-white text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <option value="Not started">Not started</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Off Track">Off Track</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              onClick={updateStatus}
              className="update-status-btn bg-blue-500 text-white rounded-lg px-4 py-2.5 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
            >
              Update Status
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl md:text-3xl font-semibold mb-3">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">Status</h3>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              projectDetails.status === "On Track" ? "bg-green-500" : ""
            } ${projectDetails.status === "At Risk" ? "bg-red-500" : ""}
              ${projectDetails.status === "Completed" ? "bg-slate-400" : ""}
              ${projectDetails.status === "Off Track" ? "bg-red-900" : ""}
              ${projectDetails.status === "Not started" ? "bg-gray-600" : ""}`}
          >
            {projectDetails.status}
          </span>
        </div>
        {/* Project Timeline */}
        <div className="bg-gray-800 p-4 rounded-md shadow-md">
          <h3 className="text-lg md:text-xl font-semibold mb-2">
            Project timeline
          </h3>
          <ul className="list-disc list-inside">
            <div className="space-y-2">
              <li className="flex flex-col sm:flex-row items-baseline mb-2 sm:mb-0 sm:mr-4">
                <span className="font-medium text-gray-300">StartDate:</span>
                <span className="ml-2 px-2 py-1 bg-green-500 rounded-full text-white flex-shrink-0">
                  {projectDetails.startDate
                    ? formatDate(projectDetails.startDate)
                    : "N/A"}
                </span>
              </li>
              <li className="flex flex-col sm:flex-row items-baseline">
                <span className="font-medium text-gray-300">EndDate:</span>
                <span className="ml-2 px-2 py-1 bg-red-500 rounded-full text-white flex-shrink-0">
                  {projectDetails.endDate
                    ? formatDate(projectDetails.endDate)
                    : "N/A"}
                </span>
              </li>
            </div>
          </ul>
        </div>

        <div className="bg-gray-800 p-4 rounded-md shadow-md">
          <h3 className="text-lg md:text-xl font-semibold mb-2">Statistics</h3>
          <div className="text-sm md:text-base">
            <div className="flex justify-between">
              <span>Total Tasks:</span>
              {tasksData.total.toString()}
            </div>
            <div className="flex justify-between">
              <span>Completed:</span>
              {tasksData.completed.toString()}
            </div>
            <div className="flex justify-between">
              <span>Pending:</span>
              {tasksData.pending.toString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewStats;
