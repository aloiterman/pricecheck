
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    item: "",
    vendor: "",
    price: "",
    date: new Date().toISOString().split("T")[0]
  });

  //  Load data
  useEffect(() => {
    const saved = localStorage.getItem("items");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  //  Save data
useEffect(() => {
  const loadItems = () => {
    const saved = localStorage.getItem("items");
    if (saved) setItems(JSON.parse(saved));
  };

  loadItems();

  window.addEventListener("focus", loadItems);

  return () => {
    window.removeEventListener("focus", loadItems);
  };
}, []);

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

  //  Group data
  const grouped = {};
  items.forEach((entry) => {
    if (!grouped[entry.item]) grouped[entry.item] = {};
    if (!grouped[entry.item][entry.vendor]) {
      grouped[entry.item][entry.vendor] = [];
    }
    grouped[entry.item][entry.vendor].push(entry);
  });

  //  Build summary table
  const buildSummaryData = (grouped) => {
    const summary = [];

    Object.keys(grouped).forEach((item) => {
      const vendors = grouped[item];

      let bestVendor = null;
      let bestPrice = Infinity;
      let bestLatest = null;
      let bestPrev = null;

      Object.keys(vendors).forEach((vendor) => {
        const entries = vendors[vendor].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        const latest = entries[entries.length - 1];
        const prev = entries[entries.length - 2];

        if (latest.price < bestPrice) {
          bestPrice = latest.price;
          bestVendor = vendor;
          bestLatest = latest;
          bestPrev = prev;
        }
      });

      let change = null;
      if (bestPrev) {
        change = bestLatest.price - bestPrev.price;
      }

      summary.push({
        item,
        vendor: bestVendor,
        lastPrice: bestLatest.price,
        change,
        bestPrice
      });
    });

    return summary;
  };

  const summaryData = buildSummaryData(grouped);

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* NAVIGATION */}
      <div className="flex gap-4 mb-6">
        <button
          className="text-blue-600 underline"
          onClick={() => router.push("/upload")}
        >
          Upload Invoice
        </button>

        <button
          className="text-blue-600 underline"
          onClick={() => router.push("/manage")}
        >
          Manage Items & Vendors
        </button>

        <button
          className="text-blue-600 underline"
          onClick={() => router.push("/vendors")}
        >
          Vendor Insights
        </button>
      </div>

      {/* FORM */}
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

      {/* ✅ SUMMARY TABLE */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="text-left p-2">Item</th>
            <th className="text-left p-2">Vendor</th>
            <th className="text-left p-2">Last Price</th>
            <th className="text-left p-2">Change</th>
            <th className="text-left p-2">Best Price</th>
          </tr>
        </thead>

        <tbody>
          {summaryData.map((row, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">

              {/* ITEM */}
              <td className="p-2 font-semibold">
                {row.item}
              </td>

              {/* VENDOR */}
              <td
                className="p-2 text-blue-600 underline cursor-pointer"
                onClick={() =>
                  router.push(`/details?item=${row.item}&vendor=${row.vendor}`)
                }
              >
                {row.vendor}
              </td>

              {/* LAST PRICE */}
              <td className="p-2">
                ${row.lastPrice.toFixed(2)}
              </td>

              {/* CHANGE */}
              <td className="p-2">
                {row.change !== null && (
                  <span
                    className={
                      row.change > 0
                        ? "text-red-500"
                        : "text-green-600"
                    }
                  >
                    {row.change > 0 ? "↑" : "↓"}{" "}
                    {Math.abs(row.change).toFixed(2)}
                  </span>
                )}
              </td>

              {/* BEST PRICE */}
              <td className="p-2 font-bold text-green-600">
                ${row.bestPrice.toFixed(2)}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
