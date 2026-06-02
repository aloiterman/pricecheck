
"use client";
import { useSearchParams } from "next/navigation";
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
  const item = params.get("item");
  const vendor = params.get("vendor");

  const [data, setData] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("items");
    if (!saved) return;

    const items = JSON.parse(saved);

    const filtered = items
      .filter(
        (e) =>
          e.item === item && e.vendor === vendor
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setData(filtered);
  }, [item, vendor]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {item} — {vendor}
      </h1>

      <table className="w-full mb-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.date}</td>
              <td>${d.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="price" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
