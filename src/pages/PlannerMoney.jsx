import React from "react";
import { DollarSign } from "lucide-react";
import GenericPlannerList from "@/components/planner/GenericPlannerList";

export default function PlannerMoney() {
  const summary = (items) => {
    const income = items.filter(i => i.entryType === "income").reduce((s, i) => s + (i.amount || 0), 0);
    const expenses = items.filter(i => i.entryType === "expense").reduce((s, i) => s + (i.amount || 0), 0);
    const net = income - expenses;
    return (
      <div className="glass rounded-3xl p-5 mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-2xl bg-green-50 py-3">
            <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Income</p>
            <p className="text-2xl font-bold text-green-600 mt-1">${income.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-red-50 py-3">
            <p className="text-xs font-medium text-red-500 uppercase tracking-wide">Expenses</p>
            <p className="text-2xl font-bold text-red-500 mt-1">${expenses.toFixed(2)}</p>
          </div>
          <div className={`rounded-2xl py-3 ${net >= 0 ? "bg-pink-50" : "bg-red-50"}`}>
            <p className={`text-xs font-medium uppercase tracking-wide ${net >= 0 ? "text-pink-600" : "text-red-500"}`}>Net Balance</p>
            <p className={`text-2xl font-bold mt-1 ${net >= 0 ? "text-pink-600" : "text-red-500"}`}>${net.toFixed(2)}</p>
          </div>
        </div>
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