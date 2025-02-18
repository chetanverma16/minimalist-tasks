import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Task, CustomField, TaskPriority, TaskStatus } from "@/types";
import { mockData } from "@/mock-data";

const tasksAtom = atomWithStorage<Task[]>("tasks", mockData);

const useCreateTask = () => {
  const [tasks, setTasks] = useAtom(tasksAtom);
  return (task: Task) => {
    setTasks([...tasks, task]);
  };
};

const priorityOrder = {
  [TaskPriority.Urgent]: 0,
  [TaskPriority.High]: 1,
  [TaskPriority.Medium]: 2,
  [TaskPriority.Low]: 3,
  [TaskPriority.None]: 4,
};

const statusOrder = {
  [TaskStatus.NotStarted]: 0,
  [TaskStatus.InProgress]: 1,
  [TaskStatus.Completed]: 2,
};

const useReadTasks = () => {
  const [tasks] = useAtom(tasksAtom);
  return (
    page: number,
    limit: number,
    sortBy?: "title" | "priority" | "status",
    sortOrder: "asc" | "desc" = "asc"
  ) => {
    const totalPages = Math.ceil(tasks.length / limit);

    const sortedTasks = [...tasks];

    if (sortBy) {
      sortedTasks.sort((a, b) => {
        if (sortBy === "title") {
          const comparison = a.title.localeCompare(b.title);
          return sortOrder === "asc" ? comparison : -comparison;
        }

        if (sortBy === "priority") {
          const comparison =
            priorityOrder[a.priority] - priorityOrder[b.priority];
          return sortOrder === "asc" ? comparison : -comparison;
        }

        if (sortBy === "status") {
          const comparison = statusOrder[a.status] - statusOrder[b.status];
          return sortOrder === "asc" ? comparison : -comparison;
        }

        return 0;
      });
    } else {
      // Default sort by id if no sort specified
      sortedTasks.sort((a, b) => b.id - a.id);
    }

    return {
      tasks: sortedTasks.slice((page - 1) * limit, page * limit),
      totalPages,
    };
  };
};

const useGetTaskById = () => {
  const [tasks] = useAtom(tasksAtom);
  return (id: number) => {
    return tasks.find((task) => task.id === id) || null;
  };
};

const useUpdateTask = () => {
  const [tasks, setTasks] = useAtom(tasksAtom);
  return (id: number, updatedTask: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };
};

const useDeleteTask = () => {
  const [tasks, setTasks] = useAtom(tasksAtom);
  return (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
};

const useAddCustomField = () => {
  const [tasks, setTasks] = useAtom(tasksAtom);
  return (taskId: number, field: CustomField) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              customFields: { ...task.customFields, [field.name]: field },
            }
          : task
      )
    );
  };
};

const useRemoveCustomField = () => {
  const [tasks, setTasks] = useAtom(tasksAtom);
  return (taskId: number, fieldName: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId && task.customFields) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [fieldName]: removed, ...remainingFields } =
            task.customFields;
          return { ...task, customFields: remainingFields };
        }
        return task;
      })
    );
  };
};

export {
  tasksAtom,
  useCreateTask,
  useReadTasks,
  useUpdateTask,
  useDeleteTask,
  useAddCustomField,
  useRemoveCustomField,
  useGetTaskById,
};
