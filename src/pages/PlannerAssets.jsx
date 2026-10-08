import React from "react";
import { FolderOpen } from "lucide-react";
import GenericPlannerList from "@/components/planner/GenericPlannerList";

export default function PlannerAssets() {
  return (
    <GenericPlannerList
      entityName="AssetLibrary"
      title="Asset Library"
      icon={FolderOpen}
      fields={[
        { name: "name", label: "Asset Name", type: "text", required: true },
        { name: "assetType", label: "Asset Type", type: "select", default: "png", options: [
          { value: "png", label: "PNG" },
          { value: "logo", label: "Logo" },
          { value: "emote", label: "Emote" },
          { value: "alert", label: "Alert" },
          { value: "overlay", label: "Overlay" },
          { value: "starting_screen", label: "Starting Screen" },
          { value: "brb_screen", label: "BRB Screen" },
          { value: "ending_screen", label: "Ending Screen" },
          { value: "thumbnail", label: "Thumbnail" },
          { value: "wallpaper", label: "Wallpaper" },
          { value: "promo_graphic", label: "Promo Graphic" },
          { value: "character_art", label: "Character Art" },
          { value: "model_version", label: "Model Version" },
        ] },
        { name: "fileLink", label: "File / Link", type: "text" },
        { name: "usageRights", label: "Usage Rights / License", type: "textarea" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      displayFields={["name", "assetType", "fileLink", "usageRights"]}
    />
  );
}