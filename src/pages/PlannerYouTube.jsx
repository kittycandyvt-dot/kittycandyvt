import React from "react";
import { Video } from "lucide-react";
import GenericPlannerList from "@/components/planner/GenericPlannerList";

export default function PlannerYouTube() {
  return (
    <GenericPlannerList
      entityName="YouTubePlan"
      title="YouTube"
      icon={Video}
      fields={[
        { name: "videoIdea", label: "Video Idea", type: "text", required: true },
        { name: "format", label: "Format", type: "select", default: "long", options: [
          { value: "long", label: "Long-form" },
          { value: "short", label: "Short" },
        ] },
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "recordingDate", label: "Recording Date", type: "date" },
        { name: "editingStatus", label: "Editing Status", type: "select", default: "not_started", options: [
          { value: "not_started", label: "Not Started" },
          { value: "in_progress", label: "In Progress" },
          { value: "done", label: "Done" },
        ] },
        { name: "thumbnail", label: "Thumbnail", type: "text" },
        { name: "uploadDate", label: "Upload Date", type: "date" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      displayFields={["videoIdea", "format", "recordingDate", "editingStatus", "uploadDate"]}
    />
  );
}