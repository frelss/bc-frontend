import { useEffect, useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import initialTemplates from "../../data/initialTemplates";
import axios from "axios";

const TemplateCard = () => {
  const BASE_URL = "http://localhost:3000/api";

  //states
  const [userTemplates, setUserTemplates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");

  //selectors
  const user = useSelector((state) => state.user?.user);
  const activeProjectId = useSelector(
    (state) => state.projects.activeProjectId
  );

  useEffect(() => {
    if (!activeProjectId) {
      return;
    }

    const fetchUserTemplates = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/projects/${activeProjectId}/templates`
        );
        setUserTemplates(response.data);
      } catch (error) {
        console.error("Failed to load user templates:", error);
        toast.error("Failed to load user templates.");
      }
    };

    fetchUserTemplates();
  }, [activeProjectId]);

  const templates = [...initialTemplates, ...userTemplates];

  const openModal = (index) => {
    setActiveTemplateIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setActiveTemplateIndex(null);
  };

  const toggleEditing = (initialValue) => {
    setIsEditing(!isEditing);
    setEditableTitle(initialValue);
  };

  const handleTitleChange = (e) => {
    setEditableTitle(e.target.value);
  };

  const handleTitleSave = (index) => {
    handleTemplateTitleChange(index, editableTitle);
    setIsEditing(false);
  };

  const combinedTemplates = [
    ...initialTemplates.map((template) => ({
      ...template,
      isUserCreated: false,
    })),
    ...userTemplates.map((template) => ({ ...template, isUserCreated: true })),
  ];

  //handlers
  const handleCreateNewTemplate = async () => {
    const newTemplate = {
      title: `Custom Template ${templates.length + 1}`,
      columns: [{ title: "New Column", tasks: [] }],
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/projects/${activeProjectId}/templates`,
        { template: newTemplate }
      );
      setUserTemplates([...userTemplates, response.data.template]);
      toast.success("Template added successfully.");
    } catch (error) {
      console.error("Failed to add template:", error);
      toast.error("Failed to add template.");
    }
  };

  const handleDeleteTemplate = async (combinedTemplateIndex) => {
    if (!combinedTemplates[combinedTemplateIndex].isUserCreated) {
      console.log("Attempted to delete a non-user-created template.");
      return;
    }

    const userTemplateIndex = combinedTemplateIndex - initialTemplates.length;
    const template = userTemplates[userTemplateIndex];

    try {
      await axios.delete(
        `${BASE_URL}/projects/${activeProjectId}/templates/${template._id}`
      );
      const updatedUserTemplates = userTemplates.filter(
        (_, index) => index !== userTemplateIndex
      );
      setUserTemplates(updatedUserTemplates);
      closeModal();
      toast.success("Template deleted successfully.");
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template.");
    }
  };

  const handleDeleteColumn = async (templateIndex, columnIndex) => {
    const template = templates[templateIndex];
    const column = template.columns[columnIndex];

    if (column._id) {
      try {
        await axios.delete(
          `${BASE_URL}/projects/${activeProjectId}/templates/${template._id}/columns/${column._id}`
        );
      } catch (error) {
        console.error("Failed to delete column on server:", error);
        toast.error("Failed to delete column from server.");
        return;
      }
    }

    // Update the state locally
    const updatedTemplates = [...templates];
    updatedTemplates[templateIndex].columns.splice(columnIndex, 1);
    setUserTemplates(updatedTemplates.slice(initialTemplates.length));
  };

  const handleColumnTitleChange = (templateIndex, columnIndex, newTitle) => {
    const updatedTemplates = [...templates];
    updatedTemplates[templateIndex].columns = updatedTemplates[
      templateIndex
    ].columns.map((column, idx) => {
      if (idx === columnIndex) {
        return { ...column, title: newTitle };
      }
      return column;
    });

    setUserTemplates(updatedTemplates.slice(initialTemplates.length));

    const userTemplate = userTemplates[templateIndex - initialTemplates.length];
    if (userTemplate && userTemplate.columns[columnIndex]._id) {
      axios
        .patch(
          `${BASE_URL}/projects/${activeProjectId}/templates/${userTemplate._id}/columns/${userTemplate.columns[columnIndex]._id}`,
          { title: newTitle }
        )
        .catch((error) => {
          console.error("Failed to update column title on server:", error);
        });
    }
  };

  const handleTemplateTitleChange = (templateIndex, newTitle) => {
    let updatedTemplates = [...templates];
    updatedTemplates[templateIndex].title = newTitle;
    setUserTemplates(updatedTemplates.slice(initialTemplates.length));

    const userTemplate = userTemplates[templateIndex - initialTemplates.length];
    axios
      .patch(
        `${BASE_URL}/projects/${activeProjectId}/templates/${userTemplate._id}`,
        { title: newTitle }
      )
      .then(() => {
        console.log("Template title updated successfully.");
      })
      .catch((error) => {
        console.error("Failed to update template title:", error);
        toast.error("Failed to update template title.");
      });
  };

  const handleAddColumn = async (templateIndex) => {
    const template = templates[templateIndex];
    const newColumn = { title: "New Column", tasks: [] };

    if (template._id) {
      try {
        const response = await axios.post(
          `${BASE_URL}/projects/${activeProjectId}/templates/${template._id}/columns`,
          { column: newColumn }
        );
        template.columns.push(response.data.column);
      } catch (error) {
        console.error("Failed to add column:", error);
        toast.error("Failed to add column.");
        return;
      }
    } else {
      template.columns.push(newColumn);
    }

    const updatedTemplates = templates.map((t, idx) =>
      idx === templateIndex ? { ...t } : t
    );

    setUserTemplates(updatedTemplates.slice(initialTemplates.length));
    toast.success("Column added successfully.");
  };

  const handleAddTask = (templateIndex, columnIndex) => {
    const template = templates[templateIndex];
    const newTask = { title: "New Task", description: "" };
    template.columns[columnIndex].tasks.push(newTask);

    if (template._id && template.columns[columnIndex]._id) {
      axios
        .patch(
          `${BASE_URL}/projects/${activeProjectId}/templates/${template._id}/columns/${template.columns[columnIndex]._id}`,
          {
            tasks: template.columns[columnIndex].tasks,
          }
        )
        .then(() => {
          toast.success("Task added successfully.");
          setUserTemplates([...userTemplates]);
        })
        .catch((error) => {
          console.error("Failed to add task:", error);
          toast.error("Failed to add task.");
        });
    } else {
      setUserTemplates([...userTemplates]);
    }
  };

  const handleRemoveTask = (templateIndex, columnIndex, taskIndex) => {
    const updatedTemplates = [...templates];
    const updatedColumns = [...updatedTemplates[templateIndex].columns];
    const updatedTasks = [...updatedColumns[columnIndex].tasks];

    updatedTasks.splice(taskIndex, 1);
    updatedColumns[columnIndex].tasks = updatedTasks;
    updatedTemplates[templateIndex].columns = updatedColumns;

    setUserTemplates(updatedTemplates.slice(initialTemplates.length));

    const userTemplate = userTemplates[templateIndex - initialTemplates.length];
    if (userTemplate && userTemplate._id) {
      axios
        .patch(
          `${BASE_URL}/projects/${activeProjectId}/templates/${userTemplate._id}/columns/${userTemplate.columns[columnIndex]._id}`,
          { tasks: updatedTasks }
        )
        .then(() => {
          toast.success("Task removed from server successfully.");
        })
        .catch((error) => {
          console.error("Failed to remove task from server:", error);
          toast.error("Failed to remove task from server.");
        });
    }
  };

  const handleTaskChange = (
    templateIndex,
    columnIndex,
    taskIndex,
    field,
    value
  ) => {
    const updatedTemplates = [...templates];
    const template = updatedTemplates[templateIndex];
    const column = template.columns[columnIndex];
    const task = column.tasks[taskIndex];

    task[field] = value;

    setUserTemplates(updatedTemplates.slice(initialTemplates.length));

    if (task._id) {
      const url = `${BASE_URL}/projects/${activeProjectId}/templates/${template._id}/columns/${column._id}/tasks/${task._id}`;
      axios.patch(url, { [field]: value }).catch((error) => {
        console.error("Failed to update task on server:", error);
      });
    }
  };

  const handleUseTemplate = async (templateIndex) => {
    if (!activeProjectId) {
      toast.error("Please select a project first.");
      return;
    }

    const template = templates[templateIndex];

    if (template?.columns?.length === 0) {
      toast.error("This template cannot be used because it has no columns.");
      return;
    }

    for (let column of template.columns) {
      if (!column?.title || column?.title?.trim() === "") {
        toast.error(
          "This template cannot be used because one or more columns do not have a name."
        );
        return;
      }

      for (let task of column.tasks) {
        if (!task?.title || task?.title?.trim() === "") {
          toast.error(
            "This template cannot be used because one or more tasks do not have a name."
          );
          return;
        }
      }
    }

    try {
      await axios.post(
        `${BASE_URL}/projects/${activeProjectId}/columns/multiple`,
        {
          columns: template.columns,
        }
      );
      setIsOpen(false);
      toast.success("Template applied successfully.");
    } catch (error) {
      console.error("Error applying template:", error);
      toast.error("Failed to apply template.");
    }
  };

  const handleSaveTemplateChanges = async (templateIndex) => {
    const template = templates[templateIndex];
    if (!template._id) {
      console.error("Template ID is missing.");
      toast.error("Cannot save changes, template ID is missing.");
      return;
    }

    try {
      await axios.patch(
        `${BASE_URL}/projects/${activeProjectId}/templates/${template._id}/full`,
        template
      );
      toast.success("Template changes saved successfully.");
    } catch (error) {
      console.error("Failed to save template changes:", error);
      toast.error("Failed to save template changes.");
    }
  };

  if (!activeProjectId) {
    return <div>Please select a project to manage templates.</div>;
  }

  return (
    <>
      {(user.role === "pr_manager" || user.role === "admin") && (
        <div className="mb-8 text-center">
          <button
            onClick={handleCreateNewTemplate}
            className="text-lg font-semibold text-gray-200 bg-blue-900 hover:bg-blue-700 px-6 py-3 rounded-md shadow-lg transition duration-300 ease-in-out"
          >
            Create New Template
          </button>
        </div>
      )}

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {templates.map((template, templateIndex) => (
          <div
            key={templateIndex}
            className="template-card transform transition duration-300 ease-in-out hover:scale-105 cursor-pointer rounded-xl overflow-hidden shadow-xl bg-gradient-to-tr from-gray-600 to-gray-800"
            onClick={() => openModal(templateIndex)}
          >
            <div className="p-6">
              <h3 className="template-title text-xl md:text-2xl font-semibold text-white mb-4">
                {template.title}
              </h3>
              {template.columns.slice(0, 1).map((column, columnIndex) => (
                <div key={columnIndex} className="column mb-4">
                  <h4 className="column-title text-sm font-medium text-white mb-2 truncate">
                    {column.title}
                  </h4>
                  <ul className="tasks list-disc pl-4 text-white text-xs">
                    {column.tasks.slice(0, 2).map((task, taskIndex) => (
                      <li key={taskIndex} className="task mb-1 truncate">
                        {task.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {template.columns.length > 1 && (
                <div className="text-xs text-white mt-2 flex items-center justify-between">
                  <span>+ more...</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(user.role === "pr_manager" || user.role === "admin") && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <div className="fixed inset-0 bg-black bg-opacity-70"></div>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Dialog.Panel className="w-full max-w-md md:max-w-lg xl:max-w-2xl mx-auto overflow-hidden rounded-lg bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  {activeTemplateIndex !== null && (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="text-lg md:text-xl font-medium leading-6 text-white"
                      >
                        {combinedTemplates[activeTemplateIndex]
                          .isUserCreated ? (
                          isEditing ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={editableTitle}
                                onChange={handleTitleChange}
                                className="mr-2 p-2 w-2/3 text-sm rounded text-gray-900 bg-white border border-gray-300 shadow-sm"
                                onBlur={() =>
                                  handleTitleSave(activeTemplateIndex)
                                }
                                autoFocus
                              />
                              <button
                                onClick={() =>
                                  handleTitleSave(activeTemplateIndex)
                                }
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <span>
                                {templates[activeTemplateIndex].title}
                              </span>
                              <button
                                onClick={() =>
                                  toggleEditing(
                                    templates[activeTemplateIndex].title
                                  )
                                }
                                className="ml-4 py-1 px-3 text-sm font-medium text-blue-700 bg-blue-200 hover:bg-blue-300 rounded-full"
                              >
                                Edit
                              </button>
                            </div>
                          )
                        ) : (
                          <span>
                            Template: {templates[activeTemplateIndex].title}
                          </span>
                        )}
                      </Dialog.Title>
                      <div className="max-h-[70vh] overflow-y-auto mt-4">
                        {templates[activeTemplateIndex].columns.map(
                          (column, columnIndex) => (
                            <div
                              key={columnIndex}
                              className="mb-4 bg-gray-700 p-4 rounded-lg"
                            >
                              <div className="mb-5">
                                <input
                                  type="text"
                                  value={column.title}
                                  onChange={(e) =>
                                    handleColumnTitleChange(
                                      activeTemplateIndex,
                                      columnIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Column ${
                                    columnIndex + 1
                                  } Title`}
                                  className="block w-full px-4 py-2 mt-2 text-lg text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                />
                                <button
                                  onClick={() =>
                                    handleDeleteColumn(
                                      activeTemplateIndex,
                                      columnIndex
                                    )
                                  }
                                  className="mt-2 text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 px-5 py-2 rounded-lg"
                                >
                                  Delete Column
                                </button>
                              </div>
                              <h4 className="text-md text-white mb-2">
                                Column {columnIndex + 1}: {column.title}
                              </h4>
                              {column.tasks.map((task, taskIndex) => (
                                <div
                                  key={taskIndex}
                                  className="bg-gray-600 p-3 rounded-lg mb-3"
                                >
                                  <input
                                    type="text"
                                    value={task.title}
                                    onChange={(e) =>
                                      handleTaskChange(
                                        activeTemplateIndex,
                                        columnIndex,
                                        taskIndex,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Task ${taskIndex + 1} Title`}
                                    className="block w-full px-4 py-2 mb-2 text-lg text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                  />
                                  <textarea
                                    value={task.description}
                                    onChange={(e) =>
                                      handleTaskChange(
                                        activeTemplateIndex,
                                        columnIndex,
                                        taskIndex,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Task ${
                                      taskIndex + 1
                                    } Description`}
                                    className="block w-full px-4 py-2 text-lg text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                  />
                                  <button
                                    className="mt-2 text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 px-5 py-2 rounded-lg"
                                    onClick={() =>
                                      handleRemoveTask(
                                        activeTemplateIndex,
                                        columnIndex,
                                        taskIndex
                                      )
                                    }
                                  >
                                    Remove Task
                                  </button>
                                </div>
                              ))}
                              <button
                                className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 px-5 py-2 rounded-lg"
                                onClick={() =>
                                  handleAddTask(
                                    activeTemplateIndex,
                                    columnIndex
                                  )
                                }
                              >
                                Add New Task
                              </button>
                            </div>
                          )
                        )}
                        <button
                          className="mt-3 text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 px-5 py-2 rounded-lg"
                          onClick={() => handleAddColumn(activeTemplateIndex)}
                        >
                          Add New Column
                        </button>
                      </div>
                      <div className="mt-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                        <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                        <div className="flex flex-col md:flex-row md:space-x-2">
                          {combinedTemplates[activeTemplateIndex]
                            .isUserCreated && (
                            <>
                              <button
                                className="flex justify-center w-full md:w-auto px-4 py-2 mt-2 md:mt-0 md:ml-2 text-sm text-red-700 bg-red-300 border border-transparent rounded-md hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                                onClick={() =>
                                  handleDeleteTemplate(activeTemplateIndex)
                                }
                              >
                                Delete Template
                              </button>

                              <button
                                className="flex justify-center w-full md:w-auto px-4 py-2 mt-2 md:mt-0 md:ml-2 mb-2 md:mb-0 text-sm text-red-700 bg-red-300 border border-transparent rounded-md hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                                onClick={() =>
                                  handleSaveTemplateChanges(activeTemplateIndex)
                                }
                              >
                                Save Changes
                              </button>
                            </>
                          )}
                          <button
                            className="flex justify-center w-full md:w-auto px-4 py-2 text-sm text-green-700 bg-green-300 border border-transparent rounded-md hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                            onClick={() =>
                              handleUseTemplate(activeTemplateIndex)
                            }
                          >
                            Use Template
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};

export default TemplateCard;
