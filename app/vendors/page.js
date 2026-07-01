
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VendorsPage() {
  const [items, setItems] = useState([]);
  const router = useRouter();

  // ✅ Load data
  useEffect(() => {
    const saved = localStorage.getItem("items");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // ✅ Group data by item → vendor
  const grouped = {};
  items.forEach((entry) => {
    if (!grouped[entry.item]) grouped[entry.item] = {};
    if (!grouped[entry.item][entry.vendor]) {
      grouped[entry.item][entry.vendor] = [];
    }
    grouped[entry.item][entry.vendor].push(entry);
  });

  // ✅ Build vendor stats
  const vendorStats = {};

  items.forEach((entry) => {
    if (!vendorStats[entry.vendor]) {
      vendorStats[entry.vendor] = {
        totalSpent: 0,
        cheapestItems: new Set()
      };
    }

    vendorStats[entry.vendor].totalSpent += entry.price;
  });

  // ✅ Find cheapest vendor per item
  Object.keys(grouped).forEach((item) => {
    const vendors = grouped[item];

    let lowestVendor = null;
    let lowestPrice = Infinity;

    Object.keys(vendors).forEach((vendor) => {
      const entries = vendors[vendor].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      const latest = entries[0];

      if (latest.price < lowestPrice) {
        lowestPrice = latest.price;
        lowestVendor = vendor;
      }
    });

    if (lowestVendor) {
      vendorStats[lowestVendor].cheapestItems.add(item);
    }
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* ✅ BACK BUTTON */}
      <button
        className="text-blue-600 underline mb-4"
        onClick={() => router.push("/")}
      >
        ← Back to Dashboard
      </button>

      {/* ✅ HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Vendor Insights
      </h1>

      {/* ✅ GRID OF CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {Object.keys(vendorStats).map((vendor) => {
          const stats = vendorStats[vendor];
          const cheapestItems = [...stats.cheapestItems];

          return (
            <div
              key={vendor}
              className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              {/* ✅ Vendor Name */}
              <h2 className="text-lg font-semibold mb-2 capitalize">
                {vendor}
              </h2>

              {/* ✅ Total Spend */}
              <p className="mb-3">
                💰 Total Spent:{" "}
                <span className="font-medium">
                  ${stats.totalSpent.toFixed(2)}
                </span>
              </p>

              {/* ✅ Cheapest Items */}
              <div>
                <p className="font-semibold mb-1">
                  🏆 Cheapest For:
                </p>

                {cheapestItems.length > 0 ? (
                  <ul className="list-disc ml-5 text-sm">
                    {cheapestItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No items
                  </p>
                )}
              </div>

              {/* ✅ Optional Action */}
              <button
                className="mt-3 text-blue-600 underline text-sm"
                onClick={() =>
                  router.push(`/details?vendor=${vendor}`)
                }
              >
                View Details →
              </button>
            </div>
          );
        })}

      </div>
    </div>
  );
}
