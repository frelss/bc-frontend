import { useState } from "react";
import { ProjektNavbar, ProjektSidebar } from "../../components";
import { Outlet } from "react-router-dom";

function ProjectLayout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-screen">
      <nav>
        <ProjektNavbar />
      </nav>
      <div
        className={`${
          isSidebarVisible ? "w-40" : "w-0"
        } bg-gray-900 transition-width duration-300 lg:w-40`}
      >
        <ProjektSidebar
          isSidebarVisible={isSidebarVisible}
          toggleSidebar={toggleSidebar}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default ProjectLayout;
