// src/Components/Profile.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../Supabase";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Profile = ({ user }) => {
  const [wedding, setWedding] = useState({});
  const [budget, setBudget] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    // Wedding details
    const { data: weddingData } = await supabase
      .from("wedding_details")
      .select("*")
      .eq("user_id", user.uid)
      .single();
    if (weddingData) {
      setWedding(weddingData);
      const weddingDate = new Date(weddingData.date);
      const today = new Date();
      setDaysLeft(
        Math.max(Math.ceil((weddingDate - today) / (1000 * 60 * 60 * 24)), 0)
      );
    }

    // Budget categories
    const { data: budgetData } = await supabase
      .from("budget_categories")
      .select("*")
      .eq("user_id", user.uid);
    setBudget(budgetData || []);

    // Tasks
    const { data: taskData } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.uid);
    setTasks(taskData || []);

    // Vendors
    const { data: vendorData } = await supabase
      .from("vendors")
      .select("*")
      .eq("user_id", user.uid);
    setVendors(vendorData || []);
  };

  // Prepare data for pie chart
  const totalAllocated = budget.reduce((sum, b) => sum + (b.allocated || 0), 0);
  const totalSpent = budget.reduce((sum, b) => sum + (b.spent || 0), 0);
  const pieData = [
    { name: "Spent", value: totalSpent },
    { name: "Remaining", value: Math.max(totalAllocated - totalSpent, 0) },
  ];
  const COLORS = ["#FF6384", "#36A2EB"]; // Spent pink, Remaining blue

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4">
      {/* User Profile */}
      <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
        <img
          src={user.photoURL}
          alt={user.displayName}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-pink-600">
          {user.displayName}
        </h2>
        <p className="text-gray-500">{user.email}</p>
      </div>

      {/* Wedding Details */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-pink-600 mb-2">
          Wedding Details
        </h2>
        <p>Date: {wedding.date}</p>
        <p>Venue: {wedding.venue}</p>
        <p>Guests: {wedding.guests}</p>
        <p>Theme: {wedding.theme}</p>
        <p className="mt-2 font-semibold">Countdown: {daysLeft} days left</p>
      </div>

      {/* Budget Summary */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-pink-600 mb-4">
          Budget Overview
        </h2>
        {budget.map((b) => (
          <div key={b.id} className="mb-3">
            <p className="font-medium">{b.name}</p>
            <p className="text-gray-600">
              Allocated: ₹{b.allocated || 0} | Spent: ₹{b.spent || 0}
            </p>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
              <div
                className="bg-pink-500 h-2 rounded-full"
                style={{
                  width: `${b.allocated ? (b.spent / b.allocated) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}

        {/* Pie Chart */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-pink-600 mb-2">
            Total Budget Chart
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-pink-600 mb-2">Tasks</h2>
        <ul className="list-disc list-inside space-y-1">
          {tasks.map((t) => (
            <li
              key={t.id}
              className={t.completed ? "line-through text-gray-400" : ""}
            >
              {t.task}
            </li>
          ))}
        </ul>
      </div>

      {/* Vendors */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-pink-600 mb-2">Vendors</h2>
        <ul className="space-y-1">
          {vendors.map((v) => (
            <li key={v.id}>
              <strong>{v.type}:</strong> {v.name} ({v.contact})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
