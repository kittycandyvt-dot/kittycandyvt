import React from "react";
import { Mic2 } from "lucide-react";
import GenericPlannerList from "@/components/planner/GenericPlannerList";

export default function PlannerCommissions() {
  return (
    <GenericPlannerList
      entityName="CommissionTracker"
      title="Commissions"
      icon={Mic2}
      fields={[
        { name: "commissionNumber", label: "Commission #", type: "text" },
        { name: "client", label: "Client", type: "text", required: true },
        { name: "project", label: "Project", type: "text", required: true },
        { name: "projectType", label: "Type", type: "text" },
        { name: "contentRating", label: "SFW / NSFW", type: "select", default: "SFW", options: [
          { value: "SFW", label: "SFW" },
          { value: "NSFW", label: "NSFW" },
        ] },
        { name: "scriptReceived", label: "Script Received", type: "boolean", default: false },
        { name: "wordCount", label: "Word Count", type: "number", default: 0 },
        { name: "price", label: "Price", type: "number", default: 0 },
        { name: "deposit", label: "Deposit", type: "number", default: 0 },
        { name: "deadline", label: "Deadline", type: "date" },
        { name: "recording", label: "Recording", type: "select", default: "not_started", options: [
          { value: "not_started", label: "Not Started" },
          { value: "in_progress", label: "In Progress" },
          { value: "done", label: "Done" },
        ] },
        { name: "editing", label: "Editing", type: "select", default: "not_started", options: [
          { value: "not_started", label: "Not Started" },
          { value: "in_progress", label: "In Progress" },
          { value: "done", label: "Done" },
        ] },
        { name: "revisions", label: "Revisions", type: "number", default: 0 },
        { name: "delivery", label: "Delivery", type: "select", default: "pending", options: [
          { value: "pending", label: "Pending" },
          { value: "delivered", label: "Delivered" },
        ] },
        { name: "paymentReceived", label: "Payment Received", type: "boolean", default: false },
        { name: "testimonialRequested", label: "Testimonial Requested", type: "boolean", default: false },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      displayFields={["client", "project", "projectType", "contentRating", "price", "deadline", "delivery"]}
    />
  );
}