import { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import axios from "axios";
import { toast } from "react-toastify";

const TaskDescription = ({
  task,
  projectId,
  columnId,
  onClose,
  usersForAssigning,
  selectedDevelopers,
  dueDate,
  handleTaskUpdate,
}) => {
  const BASE_URL = "http://localhost:3000/api";

  const [subtasks, setSubtasks] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setDescription(task.description);
  }, [task.description]);

  //subtask
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasks/${task._id}/subtasks`
        );
        if (response.data && Array.isArray(response.data)) {
          setSubtasks(
            response.data.map((subtask) => ({
              ...subtask,
              content: subtask.content || subtask.title,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching subtasks:", error);
      }
    }
    if (projectId && columnId && task._id) {
      fetchData();
    }
  }, [projectId, columnId, task, BASE_URL]);

  //adding subtask
  const addSubtask = async (projectId, columnId, taskId, subtaskContent) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/subtasks`,
        { content: subtaskContent }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add subtask:", error);
      throw error;
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setIsEditing(e.target.value !== task.description);
  };

  // Save function
  const onSaveDescription = async () => {
    if (!isEditing || loading) return;
    setLoading(true);
    try {
      const response = await axios.patch(
        `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasks/${task._id}/description`,
        { description }
      );
      if (response.data) {
        toast.success("Description updated successfully!");
        handleTaskUpdate({ ...task, description: response.data.description });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update task description:", error);
      toast.error("Failed to update description");
    } finally {
      setLoading(false);
    }
  };

  //completed subtask
  const handleSubtaskCompletionUpdate = async (id, isCompleted) => {
    try {
      await axios.patch(
        `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasks/${task._id}/subtasks/${id}/updateCompletion`,
        { isCompleted }
      );

      const updatedSubtasks = subtasks.map((subtask) =>
        subtask._id === id ? { ...subtask, isCompleted } : subtask
      );
      const message = isCompleted
        ? "Subtask marked as completed!"
        : "Subtask marked as incompleted!";
      toast.success(message);
      setSubtasks(updatedSubtasks);
    } catch (error) {
      console.error("Error updating subtask completion status:", error);
    }
  };

  //title update of subtask
  const handleSubtaskTitleUpdate = async (id, newTitle) => {
    try {
      await axios.patch(
        `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasks/${task._id}/subtasks/${id}/updateTitle`,
        { content: newTitle }
      );
      const updatedSubtasks = subtasks.map((subtask) =>
        subtask._id === id ? { ...subtask, content: newTitle } : subtask
      );
      setSubtasks(updatedSubtasks);
    } catch (error) {
      console.error("Error updating subtask title:", error);
    }
  };

  //deleting subtask
  const deleteSubtask = async (projectId, columnId, taskId, subtaskId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/subtasks/${subtaskId}/delete`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete subtask:", error);
      throw error;
    }
  };

  //handlers
  const handleAddSubtask = async () => {
    const newSubtaskContent = "New subtask";
    try {
      const response = await addSubtask(
        projectId,
        columnId,
        task._id,
        newSubtaskContent
      );
      if (response && response.task && response.task.sub_tasks) {
        const updatedSubtasks = response.task.sub_tasks.map((sub) => ({
          ...sub,
          content: sub.content || sub.title || "Enter a subtask",
        }));
        setSubtasks(updatedSubtasks);
        toast.success("New subtask added!");
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error adding new subtask:", error);
    }
  };

  const handleSubtaskChange = (id, value) => {
    const updatedSubtasks = subtasks.map((subtask) =>
      subtask._id === id ? { ...subtask, content: value } : subtask
    );
    setSubtasks(updatedSubtasks);
  };

  const handleDeleteSubtask = async (id) => {
    try {
      const updatedSubtasks = subtasks.filter((subtask) => subtask._id !== id);
      setSubtasks(updatedSubtasks);
      toast.success("Subtask deleted successfully!");
      await deleteSubtask(projectId, columnId, task._id, id);
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-end items-start pt-24">
      <section className="absolute top-24  right-0 bottom-0 z-20 w-96 bg-gray-800 text-gray-200 shadow-lg rounded-l-md p-6 overflow-auto transition-all duration-300">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-semibold text-white">Task Details</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Assigned to:
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedDevelopers.length > 0 ? (
                selectedDevelopers.map((developerId) => {
                  const user = usersForAssigning.find(
                    (u) => u._id === developerId
                  );
                  return user ? (
                    <span
                      key={developerId}
                      className="bg-gray-700 text-sm rounded px-3 py-1 border"
                    >
                      {user.name}
                    </span>
                  ) : null;
                })
              ) : (
                <span className="text-gray-400 text-sm">No assignee</span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Due Date:</label>
            <div className="text-sm rounded px-3 py-1 bg-gray-700 border">
              {dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1 "
            >
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full p-2 border bg-gray-700 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
              rows="10"
            ></textarea>
          </div>

          <div className="flex justify-end">
            {isEditing && (
              <button
                type="button"
                disabled={loading}
                onClick={onSaveDescription}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {loading ? "Saving..." : "Save Description"}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-white">Subtasks</h3>
          {subtasks?.map((subtask) => (
            <div
              key={subtask._id}
              className="flex items-center justify-between bg-gray-700 p-3 rounded"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={subtask.isCompleted}
                  onChange={(e) =>
                    handleSubtaskCompletionUpdate(subtask._id, e.target.checked)
                  }
                  className="form-checkbox h-4 w-4 text-green-600 rounded"
                />
                <input
                  type="text"
                  className="ml-4 bg-transparent border-none text-white focus:ring-0"
                  value={subtask.content || ""}
                  onChange={(e) =>
                    handleSubtaskChange(subtask._id, e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubtaskTitleUpdate(subtask._id, e.target.value);
                      e.target.blur();
                    }
                  }}
                  placeholder="Enter subtask"
                />
              </div>
              <button
                onClick={() => handleDeleteSubtask(subtask._id)}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                <TiDelete size={20} />
              </button>
            </div>
          ))}

          <button
            onClick={handleAddSubtask}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            + Add subtask
          </button>
        </div>
      </section>
    </div>
  );
};

export default TaskDescription;
