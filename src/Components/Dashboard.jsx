// src/Components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, signOut } from "../firebase";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import Wedding from "./Wedding";
import Budget from "./Budget";
import Tasks from "./Tasks";
import Vendors from "./Vendors";
import Countdown from "./Countdown";
import Guests from "./Guests";
import { supabase } from "../Supabase";
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Profile");
  const navigate = useNavigate();
  const [wedding, setWedding] = useState({});

  useEffect(() => {
    const fetchWedding = async () => {
      const { data } = await supabase
        .from("wedding_details")
        .select("*")
        .eq("user_id", user.uid)
        .single();
      if (data) setWedding(data);
    };
    if (user) fetchWedding();
  }, [user]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return navigate("/");
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!user) return null;

  const renderTab = () => {
    switch (activeTab) {
      case "Profile":
        return <Profile user={user} />;
      case "Wedding":
        return <Wedding user={user} />;
      case "Budget":
        return <Budget user={user} />;
      case "Tasks":
        return <Tasks user={user} />;
      case "Vendors":
        return <Vendors user={user} />;
      case "Countdown":
        return <Countdown user={user} weddingDate={wedding.date} />;
      case "Guests":
        return <Guests user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-rose-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-6 space-y-6">
        <h1 className="text-2xl font-bold text-pink-600 text-center mb-6">
          Vivaha Muhurtam
        </h1>
        {[
          "Profile",
          "Wedding",
          "Budget",
          "Tasks",
          "Vendors",
          "Countdown",
          "Guests",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-left px-4 py-2 rounded-lg transition ${
              activeTab === tab
                ? "bg-pink-100 font-semibold text-pink-700"
                : "text-gray-600 hover:bg-pink-50"
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="mt-auto bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-full transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        {renderTab()}
      </main>
    </div>
  );
};

export default Dashboard;
