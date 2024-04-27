const HelpModal = ({ isOpen, onClose, role }) => {
  if (!isOpen) return null;

  const permissionsData = {
    admin: {
      canDeleteUsers: "Yes",
      canModifyProjects: "Yes",
      canViewReports: "Yes",
      canCreateUsers: "No",
      canModifyUsers: "Yes",
      canAccessAllProjects: "Yes",
    },
    pr_manager: {
      canCreateUsers: "No",
      canDeleteUsers: "No",
      canModifyProjects: "Yes",
      canViewReports: "No",
      canAddProjects: "Yes",
    },
    developer: {
      canModifyProjects: "No",
      canAddMilestones: "Yes",
      canCreateProject: "No",
      canViewTasks: "Yes",
      canDeleteTasks: "No",
      canApplyFilters: "Yes",
      canUseTemplates: "No",
      canUseAutoAssign: "No",
      canDeleteColumns: "Yes",
      canRenameColumns: "Yes",
      canAddColumns: "Yes",
      canUpdateTaskStatus: "Yes",
    },
  };

  const permissions = permissionsData[role] || {};

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg max-w-lg w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Permissions Table - {role}</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Close
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th className="px-2 py-3">Permission</th>
                <th className="px-2 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
              {Object.entries(permissions).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-2 py-3">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </td>
                  <td
                    className={`px-2 py-3 ${
                      value === "Yes" ? "text-green-500" : ""
                    }`}
                  >
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
