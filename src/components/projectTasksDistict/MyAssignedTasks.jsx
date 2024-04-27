import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TaskCard from "./TaskCard";
import axios from "axios";

const MyAssignedTasks = ({ selectedProject }) => {
  const BASE_URL = "http://localhost:3000/api";

  const [tasks, setTasks] = useState([]);

  const userId = useSelector((state) => state.user.user.id);

  //getting assigned tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (selectedProject && userId) {
        try {
          const res = await axios.get(
            `${BASE_URL}/projects/${selectedProject}/tasks/assigned/${userId}`
          );
          setTasks(res.data);
        } catch (err) {
          console.error("Error fetching tasks:", err);
        }
      } else {
        setTasks([]);
      }
    };

    fetchTasks();
  }, [selectedProject, userId]);

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl mb-2 font-semibold text-gray-100">
        My Assigned Tasks
      </h2>
      {tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              title={task.title}
              description={task.description}
              dueDate={task.dueDate}
              isCompleted={task.isCompleted}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-100">
          {selectedProject
            ? "No tasks assigned to you in this project."
            : "Please select a project."}
        </div>
      )}
    </div>
  );
};

export default MyAssignedTasks;
