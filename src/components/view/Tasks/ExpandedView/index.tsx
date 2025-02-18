import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetTaskById } from "@/lib/taskapi";

interface ExpandedViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number | null;
}

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ExpandedView = ({ open, onOpenChange, taskId }: ExpandedViewProps) => {
  const getTaskById = useGetTaskById();
  const task = taskId ? getTaskById(taskId) : null;

  if (!task) return null;

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogTitle>{task.title}</DialogTitle>
        <DialogDescription>Task Details</DialogDescription>

        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Priority:</span>
            <Badge priority={task.priority}>{task.priority}</Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge status={task.status}>{formatStatus(task.status)}</Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Created:</span>
            <span>
              {new Date(task.id).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpandedView;
