import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import { FcFullTrash } from "react-icons/fc";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";
import { fetchUsers } from "../../redux/userSlice";
import { createSelector } from "@reduxjs/toolkit";
import "../../darkDatePicker.css";
import TaskDescription from "./TaskDescription";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import axios from "axios";

//! selecting user list
const selectUserList = (state) => state.user.userList;
const selectUsersToAssign = createSelector([selectUserList], (userList) =>
  userList.filter((user) => user.role === "developer")
);

function TaskCardKanban({
  task,
  columnId,
  projectId,
  onDeleteTask,
  onUpdateTask,
}) {
  const BASE_URL = "http://localhost:3000/api";

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers({ role: "developer" }));
  }, [dispatch]);

  const [editedContent, setEditedContent] = useState(task.title);
  const [isCompleted, setIsCompleted] = useState(!!task.isCompleted);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );

  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTaskDescription, setShowTaskDescription] = useState(false);
  const [showAssigneeInput, setShowAssigneeInput] = useState(false);
  const [filter, setFilter] = useState(
    localStorage.getItem("selectedFilter") || ""
  );

  const dropdownRef = useRef(null);
  const taskDescriptionRef = useRef(null);
  const datePickerRef = useRef(null);

  const usersForAssigning = useSelector(selectUsersToAssign);
  const userRole = useSelector((state) => state.user.user.role);

  const showActionButtons = userRole !== "developer";

  useEffect(() => {
    const handleFilterChange = (event) => {
      setFilter(event.detail);
    };

    window.addEventListener("filterChange", handleFilterChange);

    return () => {
      window.removeEventListener("filterChange", handleFilterChange);
    };
  }, []);

  //state
  const [selectedDevelopers, setSelectedDevelopers] = useState(
    task.assignedTo?.map((user) => user._id) || []
  );

  const toggleDeveloperSelection = (developerId) => {
    setSelectedDevelopers((prev) =>
      prev.includes(developerId)
        ? prev.filter((id) => id !== developerId)
        : [...prev, developerId]
    );
  };

  //useEffects
  useEffect(() => {
    setEditedContent(task.title);
  }, [task.title]);

  useEffect(() => {
    setIsCompleted(!!task.isCompleted);
  }, [task.isCompleted]);

  useEffect(() => {
    const assignedDeveloperIds = task.assignedTo?.map(
      (developer) => developer._id
    );
    setSelectedDevelopers(assignedDeveloperIds || []);
  }, [task]);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const url = `${BASE_URL}/projects/tasks/${task._id}`;
        const response = await axios.get(url);
        const fetchedTask = response.data;

        setEditedContent(fetchedTask.title);
        setIsCompleted(fetchedTask.isCompleted);
        setDueDate(
          fetchedTask.dueDate
            ? new Date(fetchedTask.dueDate).toISOString().split("T")[0]
            : ""
        );
        setSelectedDevelopers(fetchedTask.assignedTo.map((user) => user._id));
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    if (task && task._id) {
      fetchTaskDetails();
    }
  }, [task, BASE_URL]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  //updating the due date
  const updateDueDate = async (taskId, newDate) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/date`,
        { date: newDate }
      );

      onUpdateTask(response.data);
      toast.success("Due date updated!");
    } catch (error) {
      console.error("Failed to update task due date:", error);
    }
  };

  // formatting the date
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("default", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  //date
  const selectedDate = formatDateForDisplay(dueDate);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  //click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAssigneeInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //date change
  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setDueDate(newDate);
    await updateDueDate(task._id, newDate);
  };

  //click outside for description
  const handleClickOutside = (event) => {
    if (
      taskDescriptionRef.current &&
      !taskDescriptionRef.current.contains(event.target)
    ) {
      setShowTaskDescription(false);
    }
  };

  //click outside for date
  const handleClickOutsideDate = (event) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target)
    ) {
      setShowDatePicker(false);
    }
  };

  //assign developers
  const assignDevelopersToTask = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasks/${task._id}/assign`,
        { userIds: selectedDevelopers }
      );

      if (
        response.data &&
        response.data.task &&
        response.data.task.assignedTo
      ) {
        const updatedSelectedDevelopers = response.data.task.assignedTo.map(
          (user) => user
        );
        setSelectedDevelopers(updatedSelectedDevelopers);
        setShowAssigneeInput(false);
        toast.success("User assigned to a task successfully");
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error assigning developers:", error);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideDate);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //checkbox change
  const handleCheckboxChange = async () => {
    const newCompletedStatus = !isCompleted;
    try {
      const updatedTask = await updateTaskStatus(
        projectId,
        columnId,
        task._id,
        {
          isCompleted: newCompletedStatus,
        }
      );
      onUpdateTask(updatedTask);
      setIsCompleted(newCompletedStatus);
      const message = newCompletedStatus
        ? "Task marked as completed!"
        : "Task marked as incompleted!";
      toast.success(message);
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status.");
    }
  };

  const updateTaskStatus = async (
    projectId,
    columnId,
    taskId,
    { isCompleted }
  ) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasks/${taskId}`,
        { isCompleted }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  };

  //deleting task
  const deleteTask = async (projectId, columnId, taskId) => {
    try {
      await axios.delete(
        `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasksDelete/${taskId}`
      );
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  //task title
  async function saveEditedContent() {
    if (editedContent.trim() !== task.title && editedContent.trim() !== "") {
      try {
        const updatedTask = await updateTaskTitle(
          projectId,
          columnId,
          task._id,
          editedContent.trim()
        );
        onUpdateTask(updatedTask);
      } catch (error) {
        console.error("Failed to save edited content:", error);
      }
      setEditMode(false);
    } else {
      setEditMode(false);
    }
  }

  const handleContentChange = (event) => {
    setEditedContent(event.target.value);
  };

  //updating task title
  const updateTaskTitle = async (projectId, columnId, taskId, title) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/title`,
        { title }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating task title:", error);
      throw error;
    }
  };

  //? clickoutside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsCompleted(task.isCompleted);
  }, [task.isCompleted]);

  //? deleting task
  const deleteTaskAndCloseDescription = async (projectId, columnId, taskId) => {
    await deleteTask(projectId, columnId, taskId);
    setShowTaskDescription(false);
  };

  //for avatar
  function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      const darkValue = Math.floor(value * 0.5)
        .toString(16)
        .padStart(2, "0");
      color += darkValue;
    }
    return color;
  }

  //for avatar
  function getInitials(name) {
    return name
      .split(" ")
      .filter((n) => n)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  //filter
  const isDueThisWeek = (dueDate) => {
    const now = new Date();
    const firstDayOfWeek = new Date(
      now.setDate(now.getDate() - now.getDay() + 1)
    );
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    return dueDate >= firstDayOfWeek && dueDate <= lastDayOfWeek;
  };

  //filter
  const isDueNextWeek = (dueDate) => {
    const now = new Date();
    const firstDayOfNextWeek = new Date(
      now.setDate(now.getDate() - now.getDay() + 8)
    );
    firstDayOfNextWeek.setHours(0, 0, 0, 0);

    const lastDayOfNextWeek = new Date(firstDayOfNextWeek);
    lastDayOfNextWeek.setDate(firstDayOfNextWeek.getDate() + 6);
    lastDayOfNextWeek.setHours(23, 59, 59, 999);

    return dueDate >= firstDayOfNextWeek && dueDate <= lastDayOfNextWeek;
  };

  //filter
  const shouldDisplayTask = () => {
    switch (filter) {
      case "All tasks":
        return true;
      case "Completed tasks":
        return task.isCompleted;
      case "Incomplete tasks":
        return !task.isCompleted;
      case "Due this week":
        return isDueThisWeek(new Date(task.dueDate));
      case "Due next week":
        return isDueNextWeek(new Date(task.dueDate));
      default:
        return true;
    }
  };

  //filter
  if (!shouldDisplayTask()) {
    return null;
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-gray-900 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-gray-800 cursor-grab relative"
      />
    );
  }

  if (editMode || !task.title) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-700 cursor-grab relative"
      >
        <textarea
          className="w-full resize-none border-none rounded bg-transparent text-white focus:outline-none p-2"
          style={{ minHeight: "80px" }}
          value={editedContent}
          onChange={handleContentChange}
          onBlur={saveEditedContent}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              saveEditedContent();
            }
          }}
          onFocus={() => {
            if (editedContent === null || editedContent === undefined) {
              setEditedContent("");
              setEditMode(false);
            }
          }}
          autoFocus
          placeholder="Write your task here"
        />
      </div>
    );
  }

  return (
    <div className="relative flex">
      <div className="flex-1">
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-500 hover:ring-opacity-50 cursor-grab relative flex-wrap items-start"
          onMouseEnter={() => setMouseIsOver(true)}
          onMouseLeave={() => setMouseIsOver(false)}
        >
          <div className="flex items-center mb-10">
            <input
              type="checkbox"
              checked={isCompleted || false}
              onChange={handleCheckboxChange}
              className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div
              className={`ml-3 mb-1 text-white flex-1 break-all overflow-hidden text-sm pr-10 ${
                isCompleted ? "line-through" : ""
              }`}
              onClick={toggleEditMode}
              title={task.title}
            >
              <div className="line-clamp-3">{task.title}</div>
            </div>
          </div>
          {mouseIsOver && (
            <div>
              <button
                onClick={() => setShowTaskDescription(!showTaskDescription)}
                className="absolute right-0 top-0 mt-2 mr-2 p-2 rounded opacity-60 hover:opacity-100"
              >
                <GiHamburgerMenu size={25} />
              </button>
              {showActionButtons && (
                <button
                  onClick={() => onDeleteTask(task._id, columnId)}
                  className="absolute bottom-4 right-4 pl-2 rounded opacity-60 hover:opacity-100 z-10"
                >
                  <FcFullTrash size={25} />
                </button>
              )}
            </div>
          )}
          <div className="absolute bottom-1 left-2  flex items-center gap-x-2">
            {showActionButtons && (
              <span
                className="hover:text-gray-200 mr-2 w-7 h-7 rounded-full border border-dashed flex items-center justify-center border-gray-500 cursor-pointer"
                onClick={() => setShowAssigneeInput(!showAssigneeInput)}
              >
                <svg
                  className="fill-current "
                  height="14"
                  focusable="false"
                  viewBox="0 0 32 32"
                >
                  <path d="M16,18c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S20.4,18,16,18z M16,4c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S19.3,4,16,4z M29,32c-0.6,0-1-0.4-1-1v-4.2c0-2.6-2.2-4.8-4.8-4.8H8.8C6.2,22,4,24.2,4,26.8V31c0,0.6-0.4,1-1,1s-1-0.4-1-1v-4.2C2,23,5,20,8.8,20h14.4c3.7,0,6.8,3,6.8,6.8V31C30,31.6,29.6,32,29,32z"></path>
                </svg>
              </span>
            )}
            <span className="flex items-center gap-2">
              <AvatarGroup
                max={3}
                sx={{
                  "& .MuiAvatar-root": {
                    width: 20,
                    height: 20,
                    color: "gray",
                    fontSize: "0.875rem",
                    border: "2px solid #bdbdbd",
                    boxShadow: "none",
                  },
                  "& .MuiAvatarGroup-excess": {
                    width: 16,
                    height: 16,
                    fontSize: "0.75rem",
                  },
                }}
              >
                {selectedDevelopers.length > 0 ? (
                  usersForAssigning
                    .filter((user) => selectedDevelopers.includes(user._id))
                    .map((user) => (
                      <Avatar
                        key={user._id}
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: stringToColor(user.name),
                          color: "gray",
                          fontSize: "0.875rem",
                        }}
                      >
                        {getInitials(user.name)}
                      </Avatar>
                    ))
                ) : (
                  <span className="text-gray-200 text-xs">No assignee</span>
                )}
              </AvatarGroup>
            </span>

            {showAssigneeInput && (
              <div
                ref={dropdownRef}
                className="absolute z-30 top-10  w-72 rounded-md shadow-2xl bg-gradient-to-tl from-gray-800 via-gray-900 to-black border border-gray-700"
              >
                <ul className="max-h-64 overflow-y-auto text-sm text-gray-300">
                  {usersForAssigning.map((developer) => (
                    <li
                      key={developer._id}
                      className={`flex items-center justify-between px-4 py-2 transition-colors duration-200 ease-in-out ${
                        selectedDevelopers.includes(developer._id)
                          ? "bg-gray-750"
                          : "hover:bg-gray-750"
                      }`}
                    >
                      <span className="font-medium">{developer.name}</span>
                      <button
                        onClick={() => toggleDeveloperSelection(developer._id)}
                        className={`text-xs font-semibold py-1 px-3 rounded-full transition-all duration-150 ease-in-out ${
                          selectedDevelopers.includes(developer._id)
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                        }`}
                      >
                        {selectedDevelopers.includes(developer._id)
                          ? "Unassign"
                          : "Assign"}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end border-t border-gray-700 p-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-full transition duration-150 ease-in-out"
                    onClick={assignDevelopersToTask}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {showActionButtons && (
              <button className="text-icon hover:text-gray-800 hover:border-gray-800 w-6 h-6 rounded-full border border-dashed flex items-center justify-center border-gray-500">
                <svg
                  className="fill-current"
                  height="14"
                  focusable="false"
                  viewBox="0 0 32 32"
                  onClick={() => {
                    setShowDatePicker(!showDatePicker);
                    if (datePickerRef.current) {
                      datePickerRef.current.focus();
                    }
                  }}
                >
                  <path d="M24,2V1c0-0.6-0.4-1-1-1s-1,0.4-1,1v1H10V1c0-0.6-0.4-1-1-1S8,0.4,8,1v1C4.7,2,2,4.7,2,8v16c0,3.3,2.7,6,6,6h16c3.3,0,6-2.7,6-6V8C30,4.7,27.3,2,24,2z M8,4v1c0,0.6,0.4,1,1,1s1-0.4,1-1V4h12v1c0,0.6,0.4,1,1,1s1-0.4,1-1V4c2.2,0,4,1.8,4,4v2H4V8C4,5.8,5.8,4,8,4z M24,28H8c-2.2,0-4-1.8-4-4V12h24v12C28,26.2,26.2,28,24,28z"></path>
                </svg>
              </button>
            )}
            {showDatePicker && (
              <input
                ref={datePickerRef}
                type="date"
                value={
                  dueDate ? new Date(dueDate).toISOString().split("T")[0] : ""
                }
                onChange={handleDateChange}
                className="datepickerbg border border-gray-600 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            )}
            {!showDatePicker && selectedDate && (
              <div className="text-sm text-slate-700">{selectedDate}</div>
            )}
          </div>
        </div>
      </div>

      {showTaskDescription && (
        <div
          ref={taskDescriptionRef}
          className="fixed inset-y-0 right-0 w-1/4 overflow-auto z-20"
        >
          <TaskDescription
            task={task}
            onClose={() => setShowTaskDescription(false)}
            onDelete={() => deleteTaskAndCloseDescription(task._id)}
            selectedDevelopers={selectedDevelopers}
            usersForAssigning={usersForAssigning}
            dueDate={dueDate}
            projectId={projectId}
            columnId={columnId}
            handleTaskUpdate={onUpdateTask}
          />
        </div>
      )}
    </div>
  );
}

export default TaskCardKanban;
