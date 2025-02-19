import React from "react";
import { motion } from "framer-motion";

// Components
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/view/EmptyState";

// Icons
import {
  ArrowUpDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

// Types
import { Task } from "@/types";

interface TableViewProps {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  sortBy?: "title" | "priority" | "status";
  handleSort: (column: "title" | "priority" | "status") => void;
  setExpandedTaskId: (id: number | null) => void;
  setUpdateTaskId: (id: number | null) => void;
  deleteTask: (id: number) => void;
  formatStatus: (status: string) => string;
}

const TableView = ({
  tasks,
  currentPage,
  totalPages,
  setCurrentPage,
  sortBy,
  handleSort,
  setExpandedTaskId,
  setUpdateTaskId,
  deleteTask,
  formatStatus,
}: TableViewProps) => {
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

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
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
                <Badge status={task.status}>{formatStatus(task.status)}</Badge>
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
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <span className="text-sm">
          Page {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default TableView;
