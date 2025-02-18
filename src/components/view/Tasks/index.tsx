"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useReadTasks, useDeleteTask } from "@/lib/taskapi";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  Trash2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CreateTaskModal from "./CreateTasks";

const Tasks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const readTasks = useReadTasks();
  const deleteTask = useDeleteTask();
  const { tasks, totalPages } = readTasks(currentPage, pageSize);

  const [open, setOpen] = useState(false);

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
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
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <Badge priority={task.priority}>{task.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge status={task.status}>
                    {formatStatus(task.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
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
