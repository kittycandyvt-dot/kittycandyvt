import React from "react";
import { Smartphone } from "lucide-react";
import GenericPlannerList from "@/components/planner/GenericPlannerList";

export default function PlannerShortForm() {
  return (
    <GenericPlannerList
      entityName="ShortFormPlan"
      title="TikTok / Reels / Shorts"
      icon={Smartphone}
      fields={[
        { name: "clipIdea", label: "Clip Idea", type: "text", required: true },
        { name: "platform", label: "Platform", type: "select", default: "tiktok", options: [
          { value: "tiktok", label: "TikTok" },
          { value: "reels", label: "Reels" },
          { value: "shorts", label: "Shorts" },
        ] },
        { name: "sourceStream", label: "Source Stream", type: "text" },
        { name: "hook", label: "Hook", type: "text" },
        { name: "caption", label: "Caption", type: "textarea" },
        { name: "hashtags", label: "Hashtags", type: "text" },
        { name: "editingStatus", label: "Editing Status", type: "select", default: "not_started", options: [
          { value: "not_started", label: "Not Started" },
          { value: "in_progress", label: "In Progress" },
          { value: "done", label: "Done" },
        ] },
        { name: "scheduledDate", label: "Scheduled Date", type: "date" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      displayFields={["clipIdea", "platform", "sourceStream", "editingStatus", "scheduledDate"]}
    />
  );
}