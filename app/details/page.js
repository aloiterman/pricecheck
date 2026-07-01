
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Details() {
  const params = useSearchParams();
  const router = useRouter();

  const item = params.get("item");
  const vendor = params.get("vendor");

  const [data, setData] = useState([]);

  //  Load and filter data
  useEffect(() => {
    const saved = localStorage.getItem("items");
    if (!saved) return;

    const allItems = JSON.parse(saved);

    const filtered = allItems
      .filter(
        (e) =>
          e.item === item &&
          e.vendor === vendor
      )
      .sort(
        (a, b) =>
          new Date(a.date) - new Date(b.date)
      );

    setData(filtered);
  }, [item, vendor]);

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/*  BACK BUTTON */}
      <button
        className="text-blue-600 underline mb-4"
        onClick={() => router.push("/")}
      >
        ← Back to Dashboard
      </button>

      {/*  HEADER */}
      <h1 className="text-2xl font-bold mb-4">
        {item} — {vendor}
      </h1>

      {/*  TABLE */}
      <table className="w-full border-collapse border mb-6">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Price</th>
          </tr>
        </thead>

        <tbody>
          {data.map((entry, i) => (
            <tr key={i} className="border-b">

              <td className="p-2">
                {entry.date}
              </td>

              <td className="p-2">
                ${entry.price.toFixed(2)}
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/*  CHART */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">
          Price Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
