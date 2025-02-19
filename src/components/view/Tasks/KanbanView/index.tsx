import React from "react";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";

import { Task, TaskStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  EllipsisVertical,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useUpdateTask } from "@/lib/taskapi";
import DropdownMenu from "@/components/ui/select";

interface KanbanViewProps {
  tasks: Task[];
  setExpandedTaskId: (id: number | null) => void;
  setUpdateTaskId: (id: number | null) => void;
  deleteTask: (id: number) => void;
  formatStatus: (status: string) => string;
}

const TaskItem = ({
  task,
  setExpandedTaskId,
  setUpdateTaskId,
  deleteTask,
  isDragging = false,
  index = 0,
}: {
  task: Task;
  setExpandedTaskId: (id: number | null) => void;
  setUpdateTaskId: (id: number | null) => void;
  deleteTask: (id: number) => void;
  isDragging?: boolean;
  index?: number;
}) => {
  const { attributes, listeners, setNodeRef } = useSortable({ id: task.id });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
    >
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`p-4 bg-white rounded-lg border border-gray-200/50 cursor-move ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="font-medium">{task.title}</p>
            <Badge priority={task.priority} className="mt-2">
              {task.priority}
            </Badge>
          </div>
          <DropdownMenu
            options={[
              {
                label: "View",
                onClick: () => setExpandedTaskId(task.id),
                Icon: <EyeIcon className="w-4 h-4" />,
              },
              {
                label: "Edit",
                onClick: () => setUpdateTaskId(task.id),
                Icon: <PencilIcon className="w-4 h-4" />,
              },
              {
                label: "Delete",
                onClick: () => deleteTask(task.id),
                Icon: <Trash2Icon className="w-4 h-4" />,
              },
            ]}
            onlyIcon
          >
            <EllipsisVertical className="w-4 h-4" />
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
};

const KanbanView = ({
  tasks,
  setExpandedTaskId,
  setUpdateTaskId,
  deleteTask,
  formatStatus,
}: KanbanViewProps) => {
  const [activeId, setActiveId] = React.useState<number | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );
  const updateTask = useUpdateTask();

  const columns = {
    [TaskStatus.NotStarted]: tasks.filter(
      (task) => task.status === TaskStatus.NotStarted
    ),
    [TaskStatus.InProgress]: tasks.filter(
      (task) => task.status === TaskStatus.InProgress
    ),
    [TaskStatus.Completed]: tasks.filter(
      (task) => task.status === TaskStatus.Completed
    ),
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const taskId = Number(active.id);

    // Find the closest droppable container (column)
    const container = over.data.current?.sortable?.containerId || over.id;
    const newStatus = String(container) as TaskStatus;

    console.log("taskId", taskId);
    console.log("newStatus", newStatus);

    updateTask(taskId, { status: newStatus });
  };

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(Number(event.active.id));
  };

  const activeTask = activeId
    ? tasks.find((task) => task.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, columnTasks]) => (
          <div
            key={status}
            id={status}
            className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{formatStatus(status)}</h3>
              <Badge>{columnTasks.length}</Badge>
            </div>

            <SortableContext
              id={status}
              items={columnTasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {columnTasks.map((task, index) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    setExpandedTaskId={setExpandedTaskId}
                    setUpdateTaskId={setUpdateTaskId}
                    deleteTask={deleteTask}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <TaskItem
            task={activeTask}
            setExpandedTaskId={setExpandedTaskId}
            setUpdateTaskId={setUpdateTaskId}
            deleteTask={deleteTask}
            isDragging={true}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanView;
