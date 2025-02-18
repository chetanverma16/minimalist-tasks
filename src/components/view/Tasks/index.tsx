"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useReadTasks, useDeleteTask } from "@/lib/taskapi";

// components
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CreateTaskModal from "./CreateTasks";

// Assets
import {
  PlusIcon,
  Trash2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  EyeIcon,
  ArrowUpDown,
} from "lucide-react";
import UpdateTaskModal from "./UpdateTasks";
import ExpandedView from "./ExpandedView";

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

  const { tasks, totalPages } = readTasks(
    currentPage,
    pageSize,
    sortBy,
    sortOrder
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

  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.4,
        ease: "easeOut",
        delay: i * 0.1,
      },
    }),
  };

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

      <div className="flex flex-col gap-y-2 my-6 w-full">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-sm font-bold">minimalist task manager</h1>
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-2" />
            Add Task
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="w-full">
              <TableHead onClick={() => handleSort("title")}>
                <div className="flex items-center gap-2 w-fit cursor-pointer">
                  Title{" "}
                  {sortBy === "title" && (
                    <ArrowUpDown className="inline h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("priority")}>
                <div className="flex items-center gap-2 w-fit cursor-pointer">
                  Priority{" "}
                  {sortBy === "priority" && (
                    <ArrowUpDown className="inline h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("status")}>
                <div className="flex items-center gap-2 w-fit cursor-pointer">
                  Status{" "}
                  {sortBy === "status" && (
                    <ArrowUpDown className="inline h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody variants={container} initial="hidden" animate="show">
            {tasks.map((task, index) => (
              <motion.tr
                key={task.id}
                custom={index}
                variants={item}
                className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800"
              >
                <TableCell>
                  {task.title.slice(0, 20) +
                    (task.title.length > 20 ? "..." : "")}
                </TableCell>
                <TableCell>
                  <Badge priority={task.priority}>{task.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge status={task.status}>
                    {formatStatus(task.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setExpandedTaskId(task.id)}
                  >
                    <EyeIcon />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setUpdateTaskId(task.id)}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </motion.tbody>
        </Table>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
