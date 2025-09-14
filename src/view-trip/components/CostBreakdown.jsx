import React from "react";
import { useCurrency } from "@/context/CurrencyContext"; // ✅ added

function CostBreakdown({ cost }) {
  const { convert, currency } = useCurrency(); // ✅ added

  if (!cost) return null;

  let parsedCost = cost;

  // Parse JSON string if needed
  if (typeof cost === "string") {
    try {
      parsedCost = JSON.parse(cost);
    } catch (err) {
      console.error("Invalid cost_breakdown JSON:", err);
      return null;
    }
  }

  const entries = Object.entries(parsedCost);
  const totalEntry = entries.find(([key]) => key.toLowerCase() === "total");
  const otherEntries = entries.filter(([key]) => key.toLowerCase() !== "total");

  // Format key (e.g. "hotel" → "Hotel")
  const formatKey = (key) =>
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  // ✅ Parse and convert cost values
  const formatValue = (value) => {
    if (typeof value === "number") {
      return `${convert(value)} ${currency}`;
    }
    if (typeof value === "string") {
      const match = value.match(/\d+(\.\d+)?/); // extract number
      if (match) {
        return `${convert(parseFloat(match[0]))} ${currency}`;
      }
      return value; // fallback if no number
    }
    return value;
  };

  return (
    <div className="space-y-5">
      {/* Breakdown items */}
      <div className="grid gap-4 sm:grid-cols-2">
        {otherEntries.map(([key, value]) => (
          <div
            key={key}
            className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 text-sm rounded-full font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                {formatKey(key)}
              </span>
              <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {formatValue(value)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total row */}
      {totalEntry && (
        <div className="p-6 rounded-2xl bg-blue-600 text-white shadow-md">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>{formatKey(totalEntry[0])}</span>
            <span>{formatValue(totalEntry[1])}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default CostBreakdown;


