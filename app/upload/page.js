
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [rows, setRows] = useState([
    { item: "", vendor: "", price: "", date: "" }
  ]);
  const router = useRouter();

  const [knownItems, setKnownItems] = useState([]);
  const [knownVendors, setKnownVendors] = useState([]);

  // ✅ Load master data (items + vendors)
 



  // ✅ Add new row
  const addRow = () => {
    setRows([
      ...rows,
      { item: "", vendor: "", price: "", date: "" }
    ]);
  };

  // ✅ Remove row
  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // ✅ Update row field
  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // ✅ Save all rows
  const saveAll = () => {
    const existing = JSON.parse(localStorage.getItem("items")) || [];

    const cleaned = rows
      .filter((row) => row.item && row.vendor && row.price)
      .map((row) => ({
        item: row.item.trim().toLowerCase(),
        vendor: row.vendor.trim().toLowerCase(),
        price: parseFloat(row.price),
        date:
          row.date ||
          new Date().toISOString().split("T")[0]
      }));

    localStorage.setItem(
      "items",
      JSON.stringify([...existing, ...cleaned])
    );

    alert("Saved successfully!");

    // reset form
    setRows([
      { item: "", vendor: "", price: "", date: "" }
    ]);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

  {/* ✅ BACK BUTTON */}
      <button
        className="text-blue-600 underline mb-4"
        onClick={() => router.push("/")}
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-xl font-bold mb-4">
        Invoice Entry
      </h1>

      {/* ✅ ENTRY TABLE */}
      <table className="w-full border-collapse border mb-4">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-left">Vendor</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Date</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b">

              {/* ITEM */}
              <td className="p-2">
                <input
                  list="items"
                  className="border p-1 w-full"
                  value={row.item}
                  onChange={(e) =>
                    updateRow(idx, "item", e.target.value)
                  }
                />

                <datalist id="items">
                  {knownItems.map((i) => (
                    <option key={i} value={i} />
                  ))}
                </datalist>
              </td>

              {/* VENDOR */}
              <td className="p-2">
                <input
                  list="vendors"
                  className="border p-1 w-full"
                  value={row.vendor}
                  onChange={(e) =>
                    updateRow(idx, "vendor", e.target.value)
                  }
                />

                <datalist id="vendors">
                  {knownVendors.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </td>

              {/* PRICE */}
              <td className="p-2">
                <input
                  type="number"
                  className="border p-1 w-full"
                  value={row.price}
                  onChange={(e) =>
                    updateRow(idx, "price", e.target.value)
                  }
                />
              </td>

              {/* DATE */}
              <td className="p-2">
                <input
                  type="date"
                  className="border p-1 w-full"
                  value={row.date}
                  onChange={(e) =>
                    updateRow(idx, "date", e.target.value)
                  }
                />
              </td>

              {/* DELETE BUTTON */}
              <td className="p-2">
                <button
                  className="text-red-500"
                  onClick={() => removeRow(idx)}
                >
                  ✕
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ ACTION BUTTONS */}
      <div className="flex gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addRow}
        >
          + Add Row
        </button>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={saveAll}
        >
          ✅ Save All
        </button>
      </div>
    </div>
  );
}
