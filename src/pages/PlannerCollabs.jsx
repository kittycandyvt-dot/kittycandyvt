import React from "react";
import { Users } from "lucide-react";
import GenericPlannerList from "@/components/planner/GenericPlannerList";

export default function PlannerCollabs() {
  return (
    <GenericPlannerList
      entityName="CollabPlanner"
      title="Collab Planner"
      icon={Users}
      fields={[
        { name: "creator", label: "Creator", type: "text", required: true },
        { name: "platform", label: "Platform", type: "text" },
        { name: "contact", label: "Contact", type: "text" },
        { name: "contentStyle", label: "Content Style", type: "text" },
        { name: "timezone", label: "Time Zone", type: "text" },
        { name: "ideas", label: "Ideas", type: "textarea" },
        { name: "contacted", label: "Contacted?", type: "boolean", default: false },
        { name: "response", label: "Response", type: "select", default: "none", options: [
          { value: "none", label: "None" },
          { value: "pending", label: "Pending" },
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ] },
        { name: "plannedDate", label: "Planned Date", type: "date" },
        { name: "streamIdea", label: "Stream Idea", type: "textarea" },
        { name: "promotionPlan", label: "Promotion Plan", type: "textarea" },
        { name: "wishlist", label: "Wishlist (People I Want to Collab With)", type: "boolean", default: false },
      ]}
      displayFields={["creator", "platform", "contentStyle", "contacted", "response", "plannedDate"]}
    />
  );
}