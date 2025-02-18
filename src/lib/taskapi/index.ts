import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Task, CustomField } from "@/types";
import { mockData } from "@/mock-data";

const tasksAtom = atomWithStorage<Task[]>("tasks", mockData);

const useCreateTask = () => {
  const [tasks, setTasks] = useAtom(tasksAtom);
  return (task: Task) => {
    setTasks([...tasks, task]);
  };
};

const useReadTasks = () => {
  const [tasks] = useAtom(tasksAtom);
  return (page: number, limit: number) => {
    const totalPages = Math.ceil(tasks.length / limit);
    return {
      tasks: tasks
        .sort((a, b) => b.id - a.id)
        .slice((page - 1) * limit, page * limit),
      totalPages,
    };
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
};
