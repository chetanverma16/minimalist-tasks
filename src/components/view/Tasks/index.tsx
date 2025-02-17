"use client";

import React from "react";
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
import { Trash2Icon } from "lucide-react";
import Header from "../Header";
import { Badge } from "@/components/ui/badge";

const Tasks = () => {
  const readTasks = useReadTasks();
  const deleteTask = useDeleteTask();
  const { tasks } = readTasks(1, 10);

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
    <div className="flex flex-col gap-y-2 my-6">
      <Header />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <motion.tbody
          variants={container}
          initial="hidden"
          animate="show"
          className="[&_tr:last-child]:border-0"
        >
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
                <Badge status={task.status}>{formatStatus(task.status)}</Badge>
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
    </div>
  );
};

export default Tasks;
