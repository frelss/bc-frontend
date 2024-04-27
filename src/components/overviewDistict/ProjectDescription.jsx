import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProjectDescription } from "../../redux/projectSlice";
import dayjs from "dayjs";
import DeadlineModal from "./DeadlineModal";
import { toast } from "react-toastify";

const ProjectDescription = ({ projectId }) => {
  //selectors
  const projectsItems = useSelector((state) => state.projects.projectsItems);
  const user = useSelector((state) => state.user.user);
  const project = projectsItems.find((p) => p._id === projectId);

  //states
  const [description, setDescription] = useState(
    project ? project.description : ""
  );
  const [daysRemaining, setDaysRemaining] = useState("");
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [countdownMessage, setCountdownMessage] = useState(
    "Days till the project starts:"
  );

  //diaptch/ref
  const dispatch = useDispatch();
  const editRef = useRef(null);

  //handlers
  const handleSave = () => {
    dispatch(updateProjectDescription({ projectId, description }));
    setEditMode(false);
    toast.success("Project updated successfully!");
  };

  const handleCancel = () => {
    setDescription(project ? project.description : "");
    setEditMode(false);
  };

  const handleCloseModal = () => {
    setModalDismissed(true);
    setShowDeadlineModal(false);
  };

  const handleChange = (event) => {
    setDescription(event.target.value);
    setEditMode(true);
  };

  const handleFocus = () => {
    if (user.role === "pr_manager" || user.role === "admin") {
      setEditMode(true);
    } else {
      setEditMode(false);
    }
  };

  //useEffects
  useEffect(() => {
    if (project) {
      setDescription(project.description);
      setEditMode(false);
    }
  }, [project]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editRef.current && !editRef.current.contains(event.target)) {
        setEditMode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editRef]);

  useEffect(() => {
    if (project) {
      const today = dayjs().startOf("day");
      const startDate =
        project.startDate && dayjs(project.startDate).startOf("day");
      const endDate = project.endDate && dayjs(project.endDate).endOf("day");

      if (today.isBefore(startDate)) {
        const difference = startDate.diff(today, "day");
        setDaysRemaining(difference);
        setCountdownMessage("Days till the project starts:");
      } else if (
        (today.isSame(startDate) || today.isAfter(startDate)) &&
        today.isBefore(endDate)
      ) {
        const difference = endDate.diff(today, "day");
        setDaysRemaining(difference);
        setCountdownMessage("Days left till the project ends:");
        if (difference >= 0 && difference <= 3 && !modalDismissed) {
          setShowDeadlineModal(true);
        } else {
          setShowDeadlineModal(false);
        }
      } else if (today.isAfter(endDate)) {
        setDaysRemaining("Expired");
        setCountdownMessage("Project duration:");
      }
    }
  }, [project, modalDismissed]);

  return (
    <div className="mb-6 rounded-lg" ref={editRef}>
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4 space-y-4">
        <div className="flex justify-between items-center text-white">
          <h2 className="text-xl md:text-2xl font-bold">
            Project Description for{" "}
            {project ? (
              <span className="text-blue-400">{project.title}</span>
            ) : (
              "Loading..."
            )}
          </h2>
        </div>

        {editMode && (user.role === "pr_manager" || user.role === "admin") ? (
          <textarea
            className="w-full h-32 p-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What's this project about?"
            value={description}
            onChange={handleChange}
            onFocus={handleFocus}
          />
        ) : (
          <div className="w-full min-h-[8rem] p-2 rounded-md bg-gray-700 border border-gray-600 text-white overflow-y-auto">
            {description || "No description provided."}
          </div>
        )}

        {editMode && (user.role === "pr_manager" || user.role === "admin") && (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ease-in-out duration-150 text-white"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition ease-in-out duration-150 text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {!editMode && (user.role === "pr_manager" || user.role === "admin") && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ease-in-out duration-150 text-white"
          >
            Edit Description
          </button>
        )}
      </div>

      {showDeadlineModal && (
        <DeadlineModal
          onClose={handleCloseModal}
          daysRemaining={daysRemaining}
        />
      )}

      <div
        className={`mt-4 p-3 rounded-md text-center text-white ${
          daysRemaining === "Expired"
            ? "bg-gray-500"
            : daysRemaining <= 3
            ? "bg-red-500"
            : "bg-green-600"
        }`}
      >
        {countdownMessage} {daysRemaining}
      </div>
    </div>
  );
};
export default ProjectDescription;
