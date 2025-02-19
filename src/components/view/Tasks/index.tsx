"use client";

import React, { useState } from "react";
import { useReadTasks, useDeleteTask } from "@/lib/taskapi";

// components
import { Button } from "@/components/ui/button";
import CreateTaskModal from "./CreateTasks";
import DropdownMenu from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import UpdateTaskModal from "./UpdateTasks";
import ExpandedView from "./ExpandedView";
import EmptyState from "../EmptyState";
import TableView from "./TableView";
import KanbanView from "./KanbanView";

// Assets
import { PlusIcon, LayoutGridIcon, TableIcon } from "lucide-react";

// Types
import { TaskPriority, TaskStatus } from "@/types";

const Tasks = () => {
  // Constants
  const pageSize = 10;

  // Hooks
  const readTasks = useReadTasks();
  const deleteTask = useDeleteTask();

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"title" | "priority" | "status">();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [open, setOpen] = useState(false);
  const [updateTaskId, setUpdateTaskId] = useState<number | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [filters, setFilters] = useState<{
    title?: string;
    priority?: TaskPriority[];
    status?: TaskStatus[];
  }>({});

  const { tasks, totalPages } = readTasks(
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    filters
  );

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleSort = (column: "title" | "priority" | "status") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const priorityOptions = Object.values(TaskPriority).map((priority) => ({
    label: priority,
    onClick: () => {
      setFilters((prev) => ({
        ...prev,
        priority: prev.priority?.includes(priority)
          ? prev.priority.filter((p) => p !== priority)
          : [...(prev.priority || []), priority],
      }));
    },
    isActive: filters.priority?.includes(priority),
  }));

  const statusOptions = Object.values(TaskStatus).map((status) => ({
    label: formatStatus(status),
    onClick: () => {
      setFilters((prev) => ({
        ...prev,
        status: prev.status?.includes(status)
          ? prev.status.filter((s) => s !== status)
          : [...(prev.status || []), status],
      }));
    },
    isActive: filters.status?.includes(status),
  }));

  return (
    <div className="w-full py-6">
      <CreateTaskModal open={open} onOpenChange={setOpen} />
      <UpdateTaskModal
        open={!!updateTaskId}
        onOpenChange={() => setUpdateTaskId(null)}
        taskId={updateTaskId}
      />
      <ExpandedView
        open={!!expandedTaskId}
        onOpenChange={() => setExpandedTaskId(null)}
        taskId={expandedTaskId}
      />

      <div className="flex flex-col gap-y-4 my-6 w-full">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-sm font-bold">minimalist task manager</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setViewMode(viewMode === "table" ? "kanban" : "table")
              }
            >
              {viewMode === "table" ? (
                <LayoutGridIcon className="w-4 h-4" />
              ) : (
                <TableIcon className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-2" />
              Add Task
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search by title..."
            className="px-3 py-2 border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <DropdownMenu options={priorityOptions} shouldCloseOnClick={false}>
            <span className="text-sm">
              Priority{" "}
              {filters.priority?.length ? `(${filters.priority.length})` : ""}
            </span>
          </DropdownMenu>
          <DropdownMenu options={statusOptions} shouldCloseOnClick={false}>
            <span className="text-sm">
              Status{" "}
              {filters.status?.length ? `(${filters.status.length})` : ""}
            </span>
          </DropdownMenu>
        </div>

        {tasks.length === 0 ? (
          <EmptyState />
        ) : viewMode === "table" ? (
          <TableView
            tasks={tasks}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            sortBy={sortBy}
            handleSort={handleSort}
            setExpandedTaskId={setExpandedTaskId}
            setUpdateTaskId={setUpdateTaskId}
            deleteTask={deleteTask}
            formatStatus={formatStatus}
          />
        ) : (
          <KanbanView
            tasks={tasks}
            setExpandedTaskId={setExpandedTaskId}
            setUpdateTaskId={setUpdateTaskId}
            deleteTask={deleteTask}
            formatStatus={formatStatus}
          />
        )}
      </div>
    </div>
  );
};

export default Tasks;
