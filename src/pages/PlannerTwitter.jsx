import React from "react";
import { MessageCircle } from "lucide-react";
import GenericPlannerList from "@/components/planner/GenericPlannerList";

export default function PlannerTwitter() {
  return (
    <GenericPlannerList
      entityName="TwitterPlan"
      title="Twitter / X"
      icon={MessageCircle}
      fields={[
        { name: "content", label: "Content", type: "textarea", required: true },
        { name: "postType", label: "Post Type", type: "select", default: "announcement", options: [
          { value: "announcement", label: "Announcement" },
          { value: "meme", label: "Meme" },
          { value: "thirst_trap", label: "Thirst Trap 👀" },
          { value: "clip", label: "Clip" },
          { value: "engagement", label: "Engagement Post" },
          { value: "promo", label: "Promo" },
          { value: "personal", label: "Personal / Behind-the-Scenes" },
        ] },
        { name: "status", label: "Status", type: "select", default: "idea", options: [
          { value: "idea", label: "Idea" },
          { value: "drafted", label: "Drafted" },
          { value: "scheduled", label: "Scheduled" },
          { value: "posted", label: "Posted" },
        ] },
        { name: "scheduledDate", label: "Scheduled Date", type: "date" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      displayFields={["content", "postType", "status", "scheduledDate"]}
    />
  );
}