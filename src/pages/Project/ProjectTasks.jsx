import { useState } from "react";
import { ProjectSelector, MyAssignedTasks } from "../../components";

const ProjectTasks = () => {
  const [selectedProject, setSelectedProject] = useState("");

  const handleProjectChange = (projectId) => {
    setSelectedProject(projectId);
  };

  return (
    <div className="h-screen bg-gray-900">
      <div className="w-full bg-gray-900 p-5 mt-10 items-start space-x-5">
        <div className="container mx-auto p-8">
          <ProjectSelector onProjectChange={handleProjectChange} />
          <MyAssignedTasks selectedProject={selectedProject} />
        </div>
      </div>
    </div>
  );
};

export default ProjectTasks;
