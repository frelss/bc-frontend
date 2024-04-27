import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-router-dom";
import {
  createMilestone,
  fetchMilestones,
  deleteMilestone,
  updateMilestone,
} from "../../redux/projectSlice";
import { createSelector } from "@reduxjs/toolkit";

const selectMilestones = createSelector(
  [(state) => state.projects?.milestones],
  (milestones) => {
    return milestones;
  }
);

const Milestones = ({ projectId, userId }) => {
  const milestoneItems = useSelector(selectMilestones);
  const dispatch = useDispatch();
  const [newMilestone, setNewMilestone] = useState("");

  useEffect(() => {
    if (userId && projectId) {
      dispatch(fetchMilestones({ projectId, userId }));
    }
  }, [projectId, userId, dispatch]);

  const handleMilestoneChange = (e) => {
    setNewMilestone(e.target.value);
  };

  const handleAddMilestoneClick = () => {
    if (newMilestone.trim()) {
      const milestoneData = {
        text: newMilestone.trim(),
        isCompleted: false,
        userId,
      };

      dispatch(createMilestone({ projectId, milestoneData, userId }));
      setNewMilestone("");
    }
  };

  const handleToggleCompletion = (milestone) => {
    if (milestone._id) {
      dispatch(
        updateMilestone({
          projectId,
          milestoneId: milestone._id,
          updateData: { isCompleted: !milestone.isCompleted },
        })
      );
    } else {
      console.error("Error: Milestone ID is undefined at toggle", {
        milestone,
      });
    }
  };

  const handleDeleteMilestone = (milestoneId) => {
    dispatch(deleteMilestone({ projectId, milestoneId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddMilestoneClick();
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-100">Milestones</h2>
        <button
          type="button"
          onClick={handleAddMilestoneClick}
          className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out"
          aria-label="Add Milestone"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </header>
      <input
        className="w-full text-sm text-gray-300 bg-transparent border-b border-gray-600 focus:outline-none"
        placeholder="Enter new milestone text"
        value={newMilestone}
        onChange={handleMilestoneChange}
      />
      <div>
        {milestoneItems?.length > 0 ? (
          milestoneItems?.map((milestone, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 mb-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-150 ease-in-out shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={milestone.isCompleted}
                  onChange={() => handleToggleCompletion(milestone)}
                  className="w-5 h-5 text-blue-600 border-gray-600 rounded-full form-checkbox focus:ring-blue-500 focus:ring-opacity-25"
                />
                <span
                  className={`text-sm font-medium text-gray-300 ${
                    milestone.isCompleted ? "line-through" : ""
                  }`}
                >
                  {milestone.text ? milestone.text : "No text available"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteMilestone(milestone._id)}
                className="text-gray-400 hover:text-red-500 transition duration-150 ease-in-out"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          ))
        ) : (
          <p>No milestones found.</p>
        )}
      </div>
    </Form>
  );
};

export default Milestones;
