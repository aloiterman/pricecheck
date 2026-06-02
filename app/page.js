
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function Dashboard() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    item: "",
    vendor: "",
    price: "",
    date: new Date().toISOString().split("T")[0]
  });

  // ✅ Load data
  useEffect(() => {
    const saved = localStorage.getItem("items");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // ✅ Save data
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!form.item || !form.vendor || !form.price) return;

    setItems([
      ...items,
      {
        ...form,
        price: parseFloat(form.price)
      }
    ]);

    setForm({
      item: "",
      vendor: "",
      price: "",
      date: new Date().toISOString().split("T")[0]
    });
  };

  // ✅ Group data by item → vendor
  const grouped = {};
  items.forEach((entry) => {
    if (!grouped[entry.item]) grouped[entry.item] = {};
    if (!grouped[entry.item][entry.vendor]) {
      grouped[entry.item][entry.vendor] = [];
    }
    grouped[entry.item][entry.vendor].push(entry);
  });

  // ✅ ✅ FIX: Build aligned chart data (THIS SOLVES YOUR ISSUE)

const buildChartData = (vendors) => {
  const dateMap = {};
  const allVendors = Object.keys(vendors);

  // Step 1: collect all dates
  Object.keys(vendors).forEach((vendor) => {
    vendors[vendor].forEach((entry) => {
      const date = entry.date;

      if (!dateMap[date]) {
        dateMap[date] = { date };
      }

      dateMap[date][vendor] = entry.price;
    });
  });

  // Step 2: ensure ALL vendors exist on every date
  Object.values(dateMap).forEach((row) => {
    allVendors.forEach((vendor) => {
      if (!(vendor in row)) {
        row[vendor] = null; // ✅ this is the key fix
      }
    });
  });

  return Object.values(dateMap).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};


  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* ✅ FORM */}
      <div className="border p-4 rounded mb-6">
        <h2 className="text-xl font-bold mb-2">Add Item Price</h2>

        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Item"
          value={form.item}
          onChange={(e) => setForm({ ...form, item: e.target.value })}
        />

        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Vendor"
          value={form.vendor}
          onChange={(e) => setForm({ ...form, vendor: e.target.value })}
        />

        <input
          className="border p-2 rounded w-full mb-2"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          className="border p-2 rounded w-full mb-2"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={addItem}
        >
          Add
        </button>
      </div>

      {/* ✅ DATA */}
      {Object.keys(grouped).map((item) => {
        const vendors = grouped[item];
        
let bestVendor = null;
let bestPrice = Infinity;

Object.keys(vendors).forEach((vendor) => {
  const latest = vendors[vendor].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )[0];

  if (latest.price < bestPrice) {
    bestPrice = latest.price;
    bestVendor = vendor;
  }
});


        // ✅ Build proper dataset for chart
        const chartData = buildChartData(vendors);

        return (
          <div key={item} className="border p-4 rounded mb-6">
            <h3 className="text-lg font-bold mb-2">{item}</h3>

            
<p className="text-sm mb-2 text-green-700 font-semibold">
  ✅ Best Price: {bestVendor} (${bestPrice.toFixed(2)})
</p>


            <table className="w-full mb-4">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Latest</th>
                  <th>Change</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(vendors).map((vendor) => {
                  const entries = vendors[vendor].sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                  );

                  const latest = entries[entries.length - 1];
                  const prev = entries[entries.length - 2];

                  let change = null;
                  if (prev) change = latest.price - prev.price;

                  return (
                    <tr key={vendor}>
                      <td>
                        <span
                          className="text-blue-600 cursor-pointer underline"
                          onClick={() =>
                            router.push(
                              `/details?item=${item}&vendor=${vendor}`
                            )
                          }
                        >
                          {vendor}
                        </span>
                      </td>

                      <td>${latest.price.toFixed(2)}</td>

                      <td>
                        {change !== null && (
                          <span
                            className={
                              change > 0
                                ? "text-red-500"
                                : "text-green-600"
                            }
                          >
                            {change > 0 ? "↑" : "↓"}{" "}
                            {Math.abs(change).toFixed(2)}
                          </span>
                        )}
                      </td>

                      <td>{latest.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ✅ ✅ FINAL FIXED CHART */}
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />

                {Object.keys(vendors).map((vendor, index) => {
                  const colors = [
                    "#3b82f6",
                    "#10b981",
                    "#ef4444",
                    "#f59e0b"
                  ];

                  return (
                    <Line
                      key={vendor}
                      dataKey={vendor}
                      stroke={colors[index % colors.length]}
                      name={vendor}
                      connectNulls={true}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
