import React from "react";
import { DollarSign } from "lucide-react";
import GenericPlannerList from "@/components/planner/GenericPlannerList";

export default function PlannerMoney() {
  const summary = (items) => {
    const income = items.filter(i => i.entryType === "income").reduce((s, i) => s + (i.amount || 0), 0);
    const expenses = items.filter(i => i.entryType === "expense").reduce((s, i) => s + (i.amount || 0), 0);
    const net = income - expenses;
    return (
      <div className="grid grid-cols-3 gap-3 text-center">
        <div><p className="text-xs text-plum-400">Income</p><p className="text-lg font-bold text-green-600">${income.toFixed(2)}</p></div>
        <div><p className="text-xs text-plum-400">Expenses</p><p className="text-lg font-bold text-red-500">${expenses.toFixed(2)}</p></div>
        <div><p className="text-xs text-plum-400">Net</p><p className={`text-lg font-bold ${net >= 0 ? "text-green-600" : "text-red-500"}`}>${net.toFixed(2)}</p></div>
      </div>
    );
  };

  return (
    <GenericPlannerList
      entityName="MoneyTracker"
      title="Money Tracker"
      icon={DollarSign}
      summary={summary}
      fields={[
        { name: "entryType", label: "Type", type: "select", default: "income", required: true, options: [
          { value: "income", label: "Income" },
          { value: "expense", label: "Expense" },
        ] },
        { name: "source", label: "Source", type: "text", required: true, placeholder: "Twitch, YouTube, Fansly, Patreon, Commissions, Merch, Sponsorships, Affiliate / Software, Assets, Artists, Editors, Equipment, Games, Ads, Website, VTuber Model" },
        { name: "amount", label: "Amount", type: "number", default: 0, required: true },
        { name: "month", label: "Month (YYYY-MM)", type: "text" },
        { name: "category", label: "Category", type: "text" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      displayFields={["source", "entryType", "amount", "month"]}
    />
  );
}