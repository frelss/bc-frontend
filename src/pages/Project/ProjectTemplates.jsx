import { AssignedTasks, TaskDisplay, TemplateCard } from "../../components";

const ProjectTemplates = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 py-10 px-4 mt-10 sm:px-10 min-h-screen space-y-8">
      {/* Project Templates Section */}
      <section className="w-full max-w-5xl bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 md:p-10">
          <h2 className="text-3xl font-bold text-white mb-6">
            Project Templates
          </h2>
          <div className="bg-gray-700 p-5 rounded-lg shadow-md">
            <TemplateCard />
          </div>
        </div>
      </section>

      {/* Assigned Tasks Section */}
      <section className="w-full max-w-3xl bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-5 p-6">
          Assigned Tasks
        </h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-inner">
          <AssignedTasks />
        </div>
      </section>

      {/* Task Display Section */}
      <section className="w-full max-w-5xl bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-5 p-6">
          Task Display
        </h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-inner">
          <TaskDisplay />
        </div>
      </section>
    </div>
  );
};

export default ProjectTemplates;
