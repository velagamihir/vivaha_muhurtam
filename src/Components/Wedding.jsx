// src/Components/WeddingDetails.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../Supabase";

const WeddingDetails = ({ user }) => {
  const [details, setDetails] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, []);

  // Fetch wedding details for the current user
  const fetchDetails = async () => {
    const { data, error } = await supabase
      .from("wedding_details")
      .select("*")
      .eq("user_id", user.uid)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Failed to fetch details:", error.message);
    }
    if (data) setDetails(data);
  };

  // Save or update wedding details
  const saveDetails = async () => {
    if (!details.date || !details.venue || !details.guests) {
      alert("Please fill at least Date, Venue, and Guests.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("wedding_details").upsert(
      { ...details, user_id: user.uid },
      { onConflict: "user_id" } // ensures update if user_id exists
    );

    setLoading(false);

    if (error) {
      console.error("Failed to save:", error.message);
      alert("Failed to save details. Check console for errors.");
      return;
    }

    fetchDetails();
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-pink-600">Wedding Details</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="text-pink-500 hover:text-pink-600 font-medium"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {editing ? (
        <div className="space-y-3">
          <input
            type="date"
            value={details.date || ""}
            onChange={(e) => setDetails({ ...details, date: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Venue"
            value={details.venue || ""}
            onChange={(e) => setDetails({ ...details, venue: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="number"
            placeholder="Guests (count)"
            value={details.guests || ""}
            onChange={(e) => setDetails({ ...details, guests: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Theme (if there is none, enter 'Genera'"
            value={details.theme || ""}
            onChange={(e) => setDetails({ ...details, theme: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <button
            onClick={saveDetails}
            disabled={loading}
            className={`mt-2 px-4 py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          <p>
            <strong>Date:</strong> {details.date || "Not set"}
          </p>
          <p>
            <strong>Venue:</strong> {details.venue || "Not set"}
          </p>
          <p>
            <strong>Guests:</strong> {details.guests || "Not set"}
          </p>
          <p>
            <strong>Theme:</strong> {details.theme || "Not set"}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeddingDetails;
