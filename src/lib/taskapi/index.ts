import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Task, TaskPriority, TaskStatus } from "@/types";
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
    sortOrder: "asc" | "desc" = "asc",
    filters?: {
      title?: string;
      priority?: TaskPriority[];
      status?: TaskStatus[];
    }
  ) => {
    let filteredTasks = [...tasks];

    // Apply filters
    if (filters) {
      if (filters.title) {
        filteredTasks = filteredTasks.filter((task) =>
          task.title.toLowerCase().includes(filters.title!.toLowerCase())
        );
      }
      if (filters.priority?.length) {
        filteredTasks = filteredTasks.filter((task) =>
          filters.priority!.includes(task.priority)
        );
      }
      if (filters.status?.length) {
        filteredTasks = filteredTasks.filter((task) =>
          filters.status!.includes(task.status)
        );
      }
    }

    // Sort filtered tasks
    if (sortBy) {
      filteredTasks.sort((a, b) => {
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
      filteredTasks.sort((a, b) => b.id - a.id);
    }

    const totalPages = Math.ceil(filteredTasks.length / limit);

    return {
      tasks: filteredTasks.slice((page - 1) * limit, page * limit),
      totalPages,
      totalItems: filteredTasks.length,
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

export {
  tasksAtom,
  useCreateTask,
  useReadTasks,
  useUpdateTask,
  useDeleteTask,
  useGetTaskById,
};
