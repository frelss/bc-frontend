import { useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCardKanban from "./TaskCardKanban";
import axios from "axios";
import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdAddCircle } from "react-icons/io";
import { toast } from "react-toastify";

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  projectId,
  updateTasksInColumn,
  onDeleteTask,
}) {
  const BASE_URL = "https://prmanagement-api.onrender.com/api";

  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title || "");

  const userRole = useSelector((state) => state.user.user.role);
  const isDeveloper = userRole === "developer";

  // creating task
  async function createTask(columnId, content) {
    try {
      const response = await axios.post(
        `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasks`,
        { content }
      );
      const newTask = response.data;
      const updatedTasks = [...column.tasks, newTask];
      console.log("Task created");
      updateTasksInColumn(columnId, updatedTasks);

      return newTask;
    } catch (error) {
      console.error("Error creating task:", error.response.data);
    }
  }

  const handleDeleteColumn = (columnId) => {
    if (column.tasks.length > 0 && isDeveloper) {
      toast.error("Developers can only delete empty columns.");
      return;
    }

    deleteColumn(columnId);
  };

  //tsak update
  const handleTaskUpdate = (updatedTask) => {
    const updatedTasks = column.tasks.map((task) =>
      task._id === updatedTask._id ? updatedTask : task
    );
    updateTasksInColumn(column._id, updatedTasks);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-900 bg-opacity-25 border-2 border-gray-700 w-[350px] h-[650px] max-h-[650px] rounded-lg flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[350px] h-[650px] max-h-[650px] flex flex-col text-white rounded-lg"
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="bg-gray-700 bg-opacity-50 border-blue-400 text-md h-[60px] cursor-grab rounded-lg p-3 font-bold border-b-2 flex items-center justify-between"
      >
        <div className="flex gap-2">
          {!editMode && column.title}
          {editMode && (
            <>
              <input
                className="bg-black focus:border-blue-500 border rounded-lg outline-none px-2"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateColumn(column._id, newTitle);
                    setEditMode(false);
                    e.preventDefault();
                  }
                }}
              />
              <button
                className="ml-2 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  updateColumn(column._id, newTitle);
                  setEditMode(false);
                }}
              >
                Save
              </button>
            </>
          )}
        </div>
        {/*delete icon for column */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteColumn(column._id);
          }}
          className="stroke-gray-500 hover:stroke-white rounded px-1 py-2"
        >
          <RiDeleteBin6Line />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext
          items={column.tasks.map((task, index) => task._id || index)}
        >
          {column.tasks.length > 0 &&
            column.tasks.map((task, index) => (
              <TaskCardKanban
                key={task._id || index}
                task={task}
                projectId={projectId}
                columnId={column._id}
                onDeleteTask={onDeleteTask}
                onUpdateTask={handleTaskUpdate}
                columnTitle={column.title}
              />
            ))}
        </SortableContext>
      </div>

      <button
        className="flex gap-2 items-center border-t-2 border-blue-500 rounded-b-lg p-4 text-white hover:bg-blue-900 hover:bg-opacity-25 active:bg-blue-800 active:bg-opacity-50"
        onClick={() => createTask(column._id)}
        disabled={isDeveloper}
      >
        <IoMdAddCircle />
        Add task
      </button>
    </div>
  );
}

export default ColumnContainer;
