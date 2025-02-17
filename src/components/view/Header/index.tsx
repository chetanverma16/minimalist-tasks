"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-sm font-bold">minimalist task manager</h1>
      <Button className="flex items-center gap-2">
        <PlusIcon className="w-4 h-2" />
        Add Task
      </Button>
    </div>
  );
};

export default Header;
