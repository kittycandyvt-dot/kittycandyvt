import React from "react";
import { Radio } from "lucide-react";
import GenericPlannerList from "@/components/planner/GenericPlannerList";

export default function PlannerTwitch() {
  return (
    <GenericPlannerList
      entityName="TwitchPlan"
      title="Twitch"
      icon={Radio}
      fields={[
        { name: "streamTitle", label: "Stream Title", type: "text", required: true },
        { name: "streamDate", label: "Stream Date & Time", type: "datetime" },
        { name: "gameCategory", label: "Game / Category", type: "text" },
        { name: "streamTheme", label: "Stream Theme", type: "text" },
        { name: "isCollab", label: "Collab?", type: "boolean", default: false },
        { name: "collabPartner", label: "Collab Partner", type: "text" },
        { name: "specialEvents", label: "Special Events", type: "textarea" },
        { name: "assetsNeeded", label: "Assets Needed", type: "textarea" },
        { name: "vodStatus", label: "VOD Status", type: "select", default: "pending", options: [
          { value: "pending", label: "Pending" },
          { value: "processing", label: "Processing" },
          { value: "published", label: "Published" },
          { value: "archived", label: "Archived" },
        ] },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      displayFields={["streamTitle", "streamDate", "gameCategory", "streamTheme", "vodStatus"]}
    />
  );
}