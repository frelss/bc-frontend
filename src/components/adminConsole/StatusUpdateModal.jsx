import { useState, useEffect, useRef } from "react";

const StatusUpdateModal = ({
  isOpen,
  onClose,
  onStatusChange,
  currentStatus,
  projectId,
}) => {
  const modalRef = useRef();

  const [newStatus, setNewStatus] = useState(currentStatus);
  const [error, setError] = useState(null);

  useEffect(() => {
    setNewStatus(currentStatus);
  }, [currentStatus]);

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

  const handleSaveChanges = () => {
    if (newStatus === currentStatus) {
      setError("Status is already set to " + newStatus);
    } else {
      onStatusChange(newStatus, projectId);
      onClose();
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div
          className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white "
          ref={modalRef}
        >
          <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Update Status
            </h3>
            <div className="mt-2 px-7 py-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="form-select block w-full mt-1"
              >
                <option value="On Track">On Track</option>
                <option value="At Risk">At Risk</option>
                <option value="Off Track">Off Track</option>
                <option value="Completed">Completed</option>
                <option value="Not started">Not started</option>
              </select>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}

            <div className="items-center px-4 py-3">
              <button
                id="ok-btn"
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default StatusUpdateModal;
