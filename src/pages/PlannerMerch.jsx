import React from "react";
import { ShoppingBag } from "lucide-react";
import GenericPlannerList from "@/components/planner/GenericPlannerList";

export default function PlannerMerch() {
  return (
    <GenericPlannerList
      entityName="MerchPlanner"
      title="Merch Planner"
      icon={ShoppingBag}
      fields={[
        { name: "productIdea", label: "Product Idea", type: "text", required: true },
        { name: "artist", label: "Artist", type: "text" },
        { name: "artworkStatus", label: "Artwork Status", type: "select", default: "not_started", options: [
          { value: "not_started", label: "Not Started" },
          { value: "in_progress", label: "In Progress" },
          { value: "done", label: "Done" },
        ] },
        { name: "manufacturer", label: "Manufacturer", type: "text" },
        { name: "cost", label: "Cost", type: "number", default: 0 },
        { name: "retailPrice", label: "Retail Price", type: "number", default: 0 },
        { name: "profit", label: "Profit", type: "number", default: 0 },
        { name: "storeListing", label: "Store Listing", type: "text" },
        { name: "photos", label: "Photos", type: "text" },
        { name: "launchDate", label: "Launch Date", type: "date" },
        { name: "promoCampaign", label: "Promo Campaign", type: "textarea" },
        { name: "sales", label: "Sales", type: "number", default: 0 },
        { name: "futureIdea", label: "Future Merch Idea", type: "boolean", default: false },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      displayFields={["productIdea", "artist", "artworkStatus", "retailPrice", "profit", "launchDate", "sales"]}
    />
  );
}