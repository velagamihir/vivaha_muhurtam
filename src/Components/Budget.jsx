import React, { useEffect, useState } from "react";
import { supabase } from "../Supabase";

const Budget = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState({});
  const [newCategory, setNewCategory] = useState("");
  const [newBudget, setNewBudget] = useState({ category_id: "", amount: 0 });

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("budget_categories")
      .select("*")
      .eq("user_id", user.uid);

    if (error) console.error("Error fetching categories:", error);
    else {
      setCategories(data || []);
    }
  };

  useEffect(() => {
    if (user) fetchCategories();
  }, [user]);

  const addCategory = async () => {
    if (!newCategory) return;

    const { error } = await supabase
      .from("budget_categories")
      .insert({ name: newCategory, allocated: 0, spent: 0, user_id: user.uid });

    if (error) console.error("Error adding category:", error);
    else {
      setNewCategory("");
      fetchCategories();
    }
  };

  const saveCategory = async (cat) => {
    const { error } = await supabase
      .from("budget_categories")
      .update({ allocated: cat.allocated })
      .eq("id", cat.id);

    if (error) console.error("Error updating category:", error);
    else fetchCategories();

    setEditing({});
  };

  const addBudgetItem = async () => {
    if (!newBudget.category_id || newBudget.amount <= 0) return;

    const { error: insertError } = await supabase.from("budget").insert({
      user_id: user.uid,
      category_id: newBudget.category_id,
      amount: newBudget.amount,
    });

    if (insertError) console.error("Error adding budget item:", insertError);

    const cat = categories.find((c) => c.id === newBudget.category_id);
    const updatedSpent = (cat.spent || 0) + Number(newBudget.amount);

    const { error: updateError } = await supabase
      .from("budget_categories")
      .update({ spent: updatedSpent })
      .eq("id", newBudget.category_id);

    if (updateError)
      console.error("Error updating category spent:", updateError);

    setNewBudget({ category_id: "", amount: 0 });
    fetchCategories();
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-6 text-center sm:text-left">
        Budget Overview
      </h2>

      {/* Add New Category */}
      <div className="bg-white rounded-3xl shadow-lg p-4 mb-6">
        <h3 className="font-semibold text-pink-600 mb-2">Add New Category</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full border px-2 py-1 rounded-lg"
          />
          <button
            onClick={addCategory}
            className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600"
          >
            Add
          </button>
        </div>
      </div>

      {/* Existing Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-3xl shadow-lg p-4">
            {editing[cat.id] ? (
              <div className="space-y-2">
                <label className="block font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editing[cat.id].name}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      [cat.id]: { ...editing[cat.id], name: e.target.value },
                    })
                  }
                  className="w-full border px-2 py-1 rounded-lg"
                />
                <label className="block font-medium text-gray-700">
                  Allocated Amount
                </label>
                <input
                  type="number"
                  value={editing[cat.id].allocated}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      [cat.id]: {
                        ...editing[cat.id],
                        allocated: e.target.value,
                      },
                    })
                  }
                  className="w-full border px-2 py-1 rounded-lg"
                />
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button
                    onClick={() => saveCategory(editing[cat.id])}
                    className="bg-pink-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() =>
                      setEditing({ ...editing, [cat.id]: undefined })
                    }
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-pink-600">{cat.name}</h3>
                <p>Allocated: ₹{cat.allocated || 0}</p>
                <p>Spent: ₹{cat.spent || 0}</p>
                <p>Remaining: ₹{(cat.allocated || 0) - (cat.spent || 0)}</p>
                <button
                  onClick={() => setEditing({ ...editing, [cat.id]: cat })}
                  className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Budget Item */}
      <div className="mt-6 bg-white rounded-3xl shadow-lg p-4 max-w-md mx-auto">
        <h3 className="font-semibold text-pink-600 mb-2">Add Budget Item</h3>
        <label className="block mb-1 font-medium text-gray-700">
          Select Category
        </label>
        <select
          value={newBudget.category_id}
          onChange={(e) =>
            setNewBudget({ ...newBudget, category_id: e.target.value })
          }
          className="w-full border px-2 py-1 rounded-lg mb-2"
        >
          <option value="">--Select--</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label className="block mb-1 font-medium text-gray-700">Amount</label>
        <input
          type="number"
          value={newBudget.amount}
          onChange={(e) =>
            setNewBudget({ ...newBudget, amount: e.target.value })
          }
          className="w-full border px-2 py-1 rounded-lg mb-2"
          placeholder="Amount"
        />

        <button
          onClick={addBudgetItem}
          className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 w-full"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Budget;
