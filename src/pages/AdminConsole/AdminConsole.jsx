import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, updateUserRole } from "../../redux/userSlice";
import { toast } from "react-toastify";
import RoleEditModal from "../../components/adminConsole/RoleEditModal";

const AdminConsole = () => {
  const dispatch = useDispatch();
  const dropdownRefs = useRef({});

  const { userList, isLoading, fetchError } = useSelector(
    (state) => state.user
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUserList, setFilteredUserList] = useState([]);

  //handlers..
  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
    toast.success("User deleted!", {
      theme: "colored",
    });
  };

  const handleRoleChange = async (newRole) => {
    try {
      const response = await dispatch(
        updateUserRole({ userId: selectedUser._id, newRole })
      );

      if (response.payload) {
        const updatedUser = response.payload;

        const updatedUserList = userList.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );

        dispatch(fetchUsers(updatedUserList));
        setFilteredUserList(
          updatedUserList.filter(
            (user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.role.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        toast.success("User role updated!");
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role. Please try again later.");
    }
  };

  const handleClickOutside = useCallback(
    (event) => {
      if (
        activeDropdown &&
        dropdownRefs.current[activeDropdown] &&
        !dropdownRefs.current[activeDropdown].contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    },
    [activeDropdown]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //UseEffects
  useEffect(() => {
    dispatch(fetchUsers({ searchTerm: "", searchField: "name" }));
  }, [dispatch]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = userList.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercasedSearchTerm) ||
          user.email.toLowerCase().includes(lowercasedSearchTerm) ||
          user.role.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredUserList(filtered);
    } else {
      setFilteredUserList(userList);
    }
  }, [userList, searchTerm]);

  if (isLoading) return <div>Loading...</div>;
  if (fetchError) return <div>Error: {fetchError}</div>;

  return (
    <div className="text-black">
      <h2 className="text-2xl font-bold mb-6">Users</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6 overflow-x-auto">
        <h3 className="text-xl font-bold mb-4">User Management</h3>
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUserList.map((user) => (
              <tr key={user._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {user.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {user.email}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                    ></span>
                    {user.role === "developer"
                      ? "User"
                      : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm mr-5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                  {selectedUser && (
                    <RoleEditModal
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      onStatusChange={(role) => handleRoleChange(role)}
                      currentRole={selectedUser ? selectedUser.role : ""}
                      userId={selectedUser ? selectedUser._id : null}
                      user={selectedUser}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminConsole;
