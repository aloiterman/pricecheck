
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagePage() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [newItem, setNewItem] = useState("");
  const [newVendor, setNewVendor] = useState("");

  // ✅ Load from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem("items_master");
    const savedVendors = localStorage.getItem("vendors_master");

    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedVendors) setVendors(JSON.parse(savedVendors));
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("items_master", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("vendors_master", JSON.stringify(vendors));
  }, [vendors]);

  // ✅ Normalize helper
  const normalize = (str) =>
    str.trim().toLowerCase();

  // ✅ Simple similarity check
  const findSimilar = (input, list) => {
    return list.find(
      (i) =>
        i.includes(input.toLowerCase()) ||
        input.toLowerCase().includes(i)
    );
  };

  // ✅ Add item
  const addItem = () => {
    if (!newItem) return;

    const normalized = normalize(newItem);

    const similar = findSimilar(normalized, items);

    if (similar) {
      const confirm = window.confirm(
        `Similar item exists: "${similar}". Create anyway?`
      );
      if (!confirm) return;
    }

    if (!items.includes(normalized)) {
      setItems([...items, normalized]);
    }

    setNewItem("");
  };

  // ✅ Add vendor
  const addVendor = () => {
    if (!newVendor) return;

    const normalized = normalize(newVendor);

    const similar = findSimilar(normalized, vendors);

    if (similar) {
      const confirm = window.confirm(
        `Similar vendor exists: "${similar}". Create anyway?`
      );
      if (!confirm) return;
    }

    if (!vendors.includes(normalized)) {
      setVendors([...vendors, normalized]);
    }

    setNewVendor("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* ✅ BACK BUTTON */}
      <button
        className="text-blue-600 underline mb-4"
        onClick={() => router.push("/")}
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">
        Manage Items & Vendors
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ✅ ITEMS SECTION */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">
            Items
          </h2>

          <input
            className="border p-2 w-full mb-2"
            placeholder="New Item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-3"
            onClick={addItem}
          >
            Add Item
          </button>

          <ul className="list-disc ml-5 text-sm">
            {items.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ VENDORS SECTION */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">
            Vendors
          </h2>

          <input
            className="border p-2 w-full mb-2"
            placeholder="New Vendor"
            value={newVendor}
            onChange={(e) => setNewVendor(e.target.value)}
          />

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-3"
            onClick={addVendor}
          >
            Add Vendor
          </button>

          <ul className="list-disc ml-5 text-sm">
            {vendors.map((vendor) => (
              <li key={vendor}>
                {vendor}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
