import { useEffect, useState } from "react";

const RoleEditModal = ({
  isOpen,
  onClose,
  onStatusChange,
  currentRole,
  user,
}) => {
  const [newRole, setNewRole] = useState(currentRole);
  const [error, setError] = useState(null);

  const roleDisplayNames = {
    admin: "Admin",
    pr_manager: "Pr. Manager",
    developer: "User",
  };

  useEffect(() => {
    setNewRole(currentRole);
  }, [currentRole]);

  const handleSaveChanges = () => {
    if (newRole === currentRole) {
      setError("Status is already set to " + roleDisplayNames[newRole]);
    } else {
      onStatusChange(newRole);
      onClose();
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div
        className={`${
          isOpen
            ? "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            : "hidden"
        } `}
        onClick={handleOutsideClick}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg p-5 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold">
              Edit Role for <span className="text-blue-500">{user.name}</span>
            </h3>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="block w-full px-4 py-2 mt-3 mb-2 text-sm text-gray-700 border border-gray-300 rounded-md"
            >
              <option value="admin">Admin</option>
              <option value="pr_manager">Pr. Manager</option>
              <option value="developer">User</option>
            </select>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="flex justify-end mt-4">
              <button
                id="saveButton"
                onClick={handleSaveChanges}
                className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md"
              >
                Save
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 ml-2 text-sm text-gray-700 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default RoleEditModal;
