import { useSelector } from "react-redux";
import {
  ProjectDescription,
  ProjectRoles,
  OverviewStats,
  Milestones,
} from "../../components";
import { useParams } from "react-router-dom";

const ProjectOverview = () => {
  const { projectId } = useParams();

  const userId = useSelector((state) => state.user?.user?.id);

  return (
    <div>
      <div className="w-full bg-gray-900 min-h-screen p-5 items-start space-x-5">
        <div className="p-8 mt-10">
          <ProjectDescription projectId={projectId} />
          <ProjectRoles projectId={projectId} />
          <OverviewStats projectId={projectId} />
          <Milestones projectId={projectId} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
