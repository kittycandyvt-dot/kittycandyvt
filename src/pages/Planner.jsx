import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarDays, FileText, CheckSquare, Target } from "lucide-react";
import StreamsTab from "@/components/planner/StreamsTab";
import ContentTab from "@/components/planner/ContentTab";
import TasksTab from "@/components/planner/TasksTab";
import GoalsTab from "@/components/planner/GoalsTab";

export default function Planner() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-plum-900">My Planner</h1>
        <p className="mt-2 text-plum-500">Plan your streams, content, tasks and goals — all in one place. ✨</p>
      </header>

      <Tabs defaultValue="streams" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-lg mx-auto mb-6">
          <TabsTrigger value="streams"><CalendarDays size={15} className="mr-1.5" />Streams</TabsTrigger>
          <TabsTrigger value="content"><FileText size={15} className="mr-1.5" />Content</TabsTrigger>
          <TabsTrigger value="tasks"><CheckSquare size={15} className="mr-1.5" />Tasks</TabsTrigger>
          <TabsTrigger value="goals"><Target size={15} className="mr-1.5" />Goals</TabsTrigger>
        </TabsList>
        <TabsContent value="streams"><StreamsTab /></TabsContent>
        <TabsContent value="content"><ContentTab /></TabsContent>
        <TabsContent value="tasks"><TasksTab /></TabsContent>
        <TabsContent value="goals"><GoalsTab /></TabsContent>
      </Tabs>
    </div>
  );
}