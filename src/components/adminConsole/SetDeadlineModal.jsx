import { useState, useEffect, useRef } from "react";

const SetDeadlineModal = ({
  isOpen,
  onClose,
  currentDeadline,
  onDeadlineChange,
  projectId,
  currentProject,
}) => {
  const [newDeadline, setNewDeadline] = useState(currentDeadline || "");
  const [error, setError] = useState(null);

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setNewDeadline(currentDeadline || "");
  }, [currentDeadline]);

  const handleSaveChanges = async () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDeadline)) {
      setError("Invalid date format (YYYY-MM-DD)");
      return;
    }

    if (
      currentProject?.startDate &&
      new Date(newDeadline) < new Date(currentProject.startDate)
    ) {
      setError("Deadline cannot be earlier than the start date");
      return;
    }

    setError(null);

    try {
      await onDeadlineChange(newDeadline, projectId);
      onClose();
    } catch (error) {
      setError("Failed to update deadline. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
        <div className="bg-white p-4 rounded-lg" ref={modalRef}>
          <h2 className="text-lg mb-4">Set New Deadline</h2>
          <input
            type="date"
            placeholder="YYYY-MM-DD"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            className="form-select block w-full mt-1"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default SetDeadlineModal;
