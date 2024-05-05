import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const TaskDisplay = () => {
  const BASE_URL = "https://prmanagement-api.onrender.com/api";

  const [projectTasks, setProjectTasks] = useState([]);

  //selector
  const activeProjectId = useSelector(
    (state) => state.projects.activeProjectId
  );
  const projectsItems = useSelector((state) => state.projects.projectsItems);
  const activeProject = projectsItems.find((p) => p._id === activeProjectId);

  //fetch
  useEffect(() => {
    const fetchProjectTasks = async () => {
      if (activeProjectId) {
        try {
          const response = await axios.get(
            `${BASE_URL}/projects/${activeProjectId}/allTasks`
          );
          setProjectTasks(response.data);
        } catch (error) {
          console.error("Error fetching project tasks:", error);
        }
      }
    };
    fetchProjectTasks();
  }, [activeProjectId]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full">
      <h2 className="text-xl text-white mb-4">
        Assigned Tasks in Project:{" "}
        {activeProject ? activeProject.title : "Loading..."}
      </h2>
      <div className="overflow-auto max-h-96">
        {projectTasks.length > 0 ? (
          projectTasks.map((task) => (
            <div key={task._id} className="bg-gray-700  p-3 rounded-lg mb-3">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-lg text-white">{task.title}</h4>
                  <p className="text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  {/* Displaying assigned user(s) and count */}
                  <p className="text-gray-400">
                    Assigned to:{" "}
                    {task.assignedTo && task.assignedTo.length > 0
                      ? task.assignedTo.map((user, index) => (
                          <span key={index}>
                            {user.name}
                            {index < task.assignedTo.length - 1}
                          </span>
                        ))
                      : "No one assigned"}
                    {task.assignedTo &&
                      task.assignedTo.length > 0 &&
                      ` (${task.assignedTo.length} member/s)`}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      task.isCompleted ? "bg-green-500" : "bg-yellow-500"
                    } text-white`}
                  >
                    {task.isCompleted ? "Completed" : "In Progress"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">
            No tasks currently assigned in this project.
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskDisplay;
