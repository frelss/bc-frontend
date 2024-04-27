import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { createPortal } from "react-dom";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ColumnContainer from "./ColumnContainer";
import TaskCardKanban from "./TaskCardKanban";
import PlusIcon from "../../icons/PlusIcon";
import axios from "axios";
import { toast } from "react-toastify";

function KanbanBoard() {
  const BASE_URL = "http://localhost:3000/api";

  const { projectId } = useParams();

  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const {
    data: columnsData,
    isLoading,
    error,
    refetch,
  } = useQuery(["columns", projectId], () => fetchColumns(projectId), {
    enabled: !!projectId,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    if (columnsData) {
      setColumns(columnsData.columns || []);
      setTasks([]);
    }
  }, [columnsData]);

  //fetching columns
  const fetchColumns = async (projectId) => {
    const response = await axios.get(
      `${BASE_URL}/projects/${projectId}/columns`
    );
    return response.data.data;
  };

  //create a column
  const createColumnInBackend = async (column, projectId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/projects/${projectId}/newcolumn`,
        column
      );
      if (response.data) {
        await refetch();
      }
      return response.data;
    } catch (error) {
      console.error("Error creating column:", error);
      throw error;
    }
  };

  //create column func
  async function createNewColumn() {
    const highestPosition = columns.reduce(
      (max, col) => Math.max(max, col.position),
      -1
    );

    const newPosition = highestPosition + 1;

    const columnToAdd = {
      title: `Column ${columns.length + 1}`,
      position: newPosition,
    };

    try {
      const createdColumn = await createColumnInBackend(columnToAdd, projectId);
      setColumns([...columns, createdColumn]);
      toast.success("New column created!");
    } catch (error) {
      console.error("Error creating new column:", error);
    }
  }

  //deleting column
  async function deleteColumn(columnId) {
    try {
      await axios.delete(
        `http://localhost:3000/api/projects/${projectId}/columns/${columnId}`
      );

      const newColumns = columns.filter((col) => col._id !== columnId);

      const filteredColumns = columns.filter((col) => col._id !== columnId);
      setColumns(filteredColumns);

      const updatedColumns = newColumns.map((col, index) => {
        return { ...col, position: index };
      });

      setColumns(updatedColumns);
      toast.success("Column deleted successfuly!");
      await refetch();
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  }

  //updating column title
  async function updateColumn(columnId, newTitle) {
    try {
      await axios.patch(
        `http://localhost:3000/api/projects/${projectId}/columns/${columnId}`,
        {
          title: newTitle,
        }
      );

      const updatedColumns = columns?.map((column) => {
        if (column._id === columnId) {
          return { ...column, title: newTitle };
        }
        return column;
      });
      setColumns(updatedColumns);
      toast.success("Column title updated successfully!");
    } catch (error) {
      console.error("Error updating column title:", error);
    }
  }

  //update tasks in column
  const updateTasksInColumn = async (columnId, newTask) => {
    setColumns((prevColumns) => {
      return prevColumns.map((col) => {
        if (col._id === columnId) {
          return { ...col, tasks: [...col.tasks, newTask] };
        }
        return col;
      });
    });
    await refetch();
  };

  //deleting task
  function handleDeleteTask(deletedTaskId, columnId) {
    axios
      .delete(
        `${BASE_URL}/projects/${projectId}/columns/${columnId}/tasksDelete/${deletedTaskId}`
      )
      .then(async () => {
        setTasks((currentTasks) =>
          currentTasks.filter((task) => task._id !== deletedTaskId)
        );
        await refetch();
      })
      .catch((error) => {
        console.error("Failed to delete task", error);
      });
  }

  //drag start
  function onDragStart(event) {
    const { active } = event;

    if (active.data.current?.type === "Column") {
      setActiveColumn(active.data.current.column);
      setActiveTask(null);
    } else if (active.data.current?.type === "Task") {
      setActiveTask(active.data.current.task);
      setActiveColumn(null);
    }
  }

  //dragging enden
  async function onDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const fromId = active.id;
    const toId = over.id;

    if (
      active.data.current.type === "Column" &&
      over.data.current.type === "Column"
    ) {
      const oldIndex = columns.findIndex((col) => col._id === fromId);
      const newIndex = columns.findIndex((col) => col._id === toId);

      const reorderedColumns = arrayMove(columns, oldIndex, newIndex);
      setColumns(reorderedColumns);

      try {
        await axios.patch(
          `${BASE_URL}/projects/${projectId}/updateColumnPositions`,
          {
            columnPositions: reorderedColumns.map((col, index) => ({
              id: col._id,
              position: index,
            })),
          }
        );
      } catch (error) {
        console.error("Error updating column positions:", error);
      }
    } else {
      // handling task dragging between columns or within the same column
      const fromColumnIndex = columns.findIndex((col) =>
        col.tasks.some((task) => task._id === fromId)
      );
      const toColumnIndex = columns.findIndex(
        (col) => col.tasks.some((task) => task._id === toId) || col._id === toId
      );
      const fromTaskIndex =
        fromColumnIndex !== -1
          ? columns[fromColumnIndex].tasks.findIndex(
              (task) => task._id === fromId
            )
          : -1;
      const toTaskIndex =
        toColumnIndex !== -1
          ? columns[toColumnIndex].tasks.findIndex((task) => task._id === toId)
          : -1;

      if (
        fromColumnIndex !== -1 &&
        toColumnIndex !== -1 &&
        fromTaskIndex !== -1
      ) {
        // Simább áthúzás végett frissítjük a feladatokat
        let newColumns = [...columns];
        const taskToMove = newColumns[fromColumnIndex].tasks[fromTaskIndex];
        newColumns[fromColumnIndex].tasks.splice(fromTaskIndex, 1); // Kivesszük a feladatot az eredeti oszlopból
        if (fromColumnIndex === toColumnIndex) {
          // Ha ugyanabban az oszlopban mozgatjuk, újrahelyezzük az új pozícióba
          newColumns[toColumnIndex].tasks.splice(
            toTaskIndex !== -1
              ? toTaskIndex
              : newColumns[toColumnIndex].tasks.length,
            0,
            taskToMove
          );
        } else {
          // Ha másik oszlopba mozgatjuk, hozzáadjuk az oszlophoz
          newColumns[toColumnIndex].tasks.splice(
            toTaskIndex !== -1
              ? toTaskIndex
              : newColumns[toColumnIndex].tasks.length,
            0,
            taskToMove
          );
        }
        setColumns(newColumns);

        try {
          await axios.post(
            `${BASE_URL}/projects/${projectId}/columns/${columns[fromColumnIndex]._id}/tasks/${fromId}/move/${columns[toColumnIndex]._id}`,
            {
              newPosition: toTaskIndex,
            }
          );
        } catch (error) {
          console.error("Error moving task:", error);
        }
      }
    }
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Exit if the task is over itself
    if (activeId === overId) return;

    setColumns((currentColumns) => {
      const activeColumnIndex = currentColumns.findIndex((col) =>
        col.tasks.some((task) => task._id === activeId)
      );
      const overColumnIndex = currentColumns.findIndex(
        (col) =>
          col.tasks.some((task) => task._id === overId) || col._id === overId
      );

      // if the task is found in some column
      if (activeColumnIndex === -1) return currentColumns;

      const activeTaskIndex = currentColumns[activeColumnIndex].tasks.findIndex(
        (task) => task._id === activeId
      );
      const task = currentColumns[activeColumnIndex].tasks[activeTaskIndex];

      // Removing the task from its original column
      currentColumns[activeColumnIndex].tasks.splice(activeTaskIndex, 1);

      if (activeColumnIndex === overColumnIndex) {
        const overTaskIndex = currentColumns[overColumnIndex].tasks.findIndex(
          (task) => task._id === overId
        );
        // Adding the task to new position in the same column
        currentColumns[overColumnIndex].tasks.splice(overTaskIndex, 0, task);

        axios
          .post(
            `${BASE_URL}/projects/${projectId}/columns/${currentColumns[overColumnIndex]._id}/tasks/${task._id}/reorder`,
            {
              newPosition: overTaskIndex,
            }
          )
          .then(() => {
            console.log("Task reordered successfully within the column!");
          })
          .catch((error) => {
            console.error("Failed to reorder task within the column:", error);
          });
      } else {
        const overTaskIndex = currentColumns[overColumnIndex].tasks.findIndex(
          (task) => task._id === overId
        );
        const newIndex =
          overTaskIndex === -1
            ? currentColumns[overColumnIndex].tasks.length
            : overTaskIndex;
        currentColumns[overColumnIndex].tasks.splice(newIndex, 0, task);

        axios
          .post(
            `${BASE_URL}/projects/${projectId}/columns/${currentColumns[activeColumnIndex]._id}/tasks/${task._id}/move/${currentColumns[overColumnIndex]._id}`,
            {
              newPosition: newIndex,
            }
          )
          .then(() => {
            console.log("Task moved successfully!");
          })
          .catch((error) => {
            console.error("Failed to move task:", error);
          });
      }

      return [...currentColumns];
    });
  }

  if (isLoading) return <div>Loading..</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columns.map((col) => col._id)}>
              {columns.map((col, index) => (
                <ColumnContainer
                  key={col._id || index}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  updateTasksInColumn={updateTasksInColumn}
                  onDeleteTask={handleDeleteTask}
                  projectId={projectId}
                  tasks={tasks.filter((task) => task.columnId === col._id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-blue-500 ring-opacity-50 hover:ring-2 flex gap-2 text-white"
          >
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                onDeleteTask={handleDeleteTask}
              />
            )}
            {activeTask && (
              <TaskCardKanban
                task={activeTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
