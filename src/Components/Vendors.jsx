// src/Components/Vendors.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../Supabase";

const Vendors = ({ user }) => {
  const [vendors, setVendors] = useState([]);
  const [newVendor, setNewVendor] = useState({
    type: "",
    name: "",
    contact: "",
  });

  // Fetch vendors
  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("user_id", user.uid)
      .order("type", { ascending: true });
    if (error) console.error("Error fetching vendors:", error);
    else setVendors(data || []);
  };

  useEffect(() => {
    if (user) fetchVendors();
  }, [user]);

  // Add new vendor
  const addVendor = async () => {
    if (
      !newVendor.type.trim() ||
      !newVendor.name.trim() ||
      !newVendor.contact.trim()
    )
      return;

    try {
      const { data, error } = await supabase
        .from("vendors")
        .insert([
          {
            type: newVendor.type.trim(),
            name: newVendor.name.trim(),
            contact: newVendor.contact.trim(),
            user_id: user.uid,
          },
        ])
        .select();
      if (error) throw error;

      setNewVendor({ type: "", name: "", contact: "" });
      setVendors((prev) => [...prev, ...data]);
    } catch (err) {
      console.error("Error adding vendor:", err.message);
    }
  };

  // Delete vendor
  const deleteVendor = async (id) => {
    const { error } = await supabase.from("vendors").delete().eq("id", id);
    if (error) console.error("Error deleting vendor:", error);
    else fetchVendors();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Add Vendor */}
      <div className="bg-white rounded-3xl shadow-lg p-4">
        <h2 className="text-xl font-semibold text-pink-600 mb-2">Add Vendor</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Type (e.g., Photographer)"
            value={newVendor.type}
            onChange={(e) =>
              setNewVendor({ ...newVendor, type: e.target.value })
            }
            className="border px-2 py-1 rounded-lg"
          />
          <input
            type="text"
            placeholder="Name"
            value={newVendor.name}
            onChange={(e) =>
              setNewVendor({ ...newVendor, name: e.target.value })
            }
            className="border px-2 py-1 rounded-lg"
          />
          <input
            type="text"
            placeholder="Contact"
            value={newVendor.contact}
            onChange={(e) =>
              setNewVendor({ ...newVendor, contact: e.target.value })
            }
            className="border px-2 py-1 rounded-lg"
          />
          <button
            onClick={addVendor}
            className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600"
          >
            Add
          </button>
        </div>
      </div>

      {/* Vendor List */}
      <div className="bg-white rounded-3xl shadow-lg p-4">
        <h2 className="text-xl font-semibold text-pink-600 mb-2">
          Vendor List
        </h2>
        {vendors.length === 0 ? (
          <p className="text-gray-500">No vendors added yet.</p>
        ) : (
          <ul className="space-y-2">
            {vendors.map((vendor) => (
              <li
                key={vendor.id}
                className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
              >
                <div>
                  <p className="font-medium">{vendor.name}</p>
                  <p className="text-gray-500">
                    {vendor.type} | {vendor.contact}
                  </p>
                </div>
                <button
                  onClick={() => deleteVendor(vendor.id)}
                  className="bg-gray-300 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-400"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Vendors;
