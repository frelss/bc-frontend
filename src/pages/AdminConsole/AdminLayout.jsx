import { Outlet } from "react-router-dom";
import { AdminConsoleNavbar, AdminConsoleSidebar } from "../../components";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full">
      <nav className="w-full">
        <AdminConsoleNavbar />
      </nav>
      <div className="flex flex-grow w-full">
        <AdminConsoleSidebar />
        <main className="flex-grow p-10 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
