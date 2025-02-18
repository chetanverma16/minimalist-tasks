import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateTask } from "@/lib/taskapi";
import { TaskPriority, TaskStatus } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DropdownMenu from "@/components/ui/select";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const formatEnumValue = (value: string) => {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const CreateTaskModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const createTask = useCreateTask();
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      priority: TaskPriority.None,
      status: TaskStatus.NotStarted,
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    createTask({ id: Date.now(), ...data });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogTitle>Create a New Task</DialogTitle>
        <DialogDescription>
          Fill in the details below to add a new task.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <DropdownMenu
                        options={Object.values(TaskPriority).map(
                          (priority) => ({
                            label: formatEnumValue(priority),
                            onClick: () => field.onChange(priority),
                          })
                        )}
                      >
                        {field.value
                          ? formatEnumValue(field.value)
                          : "Select priority"}
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <DropdownMenu
                        options={Object.values(TaskStatus).map((status) => ({
                          label: formatEnumValue(status),
                          onClick: () => field.onChange(status),
                        }))}
                      >
                        {field.value
                          ? formatEnumValue(field.value)
                          : "Select status"}
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
