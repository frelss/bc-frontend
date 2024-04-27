import { Outlet } from "react-router-dom";
import { AdminConsoleNavbar, AdminConsoleSidebar } from "../../components";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <nav>
        <AdminConsoleNavbar />
      </nav>
      <div className="flex flex-1">
        <div>
          <AdminConsoleSidebar />
        </div>
        <div className="flex-1 p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
