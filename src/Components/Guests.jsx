// src/Components/Guests.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../Supabase";

const Guests = ({ user }) => {
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({
    name: "",
    members: 1,
    attending: false,
  });

  // Fetch guests
  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("user_id", user.uid)
      .order("name", { ascending: true });
    if (error) console.error("Error fetching guests:", error);
    else setGuests(data || []);
  };

  useEffect(() => {
    if (user) fetchGuests();
  }, [user]);

  // Add new guest
  const addGuest = async () => {
    if (!newGuest.name.trim() || !newGuest.members) return;

    try {
      const { data, error } = await supabase
        .from("guests")
        .insert([
          {
            name: newGuest.name.trim(),
            contact: newGuest.contact,
            members: newGuest.members,
            attending: false,
            user_id: user.uid,
          },
        ])
        .select();
      if (error) throw error;
      setNewGuest({ name: "", members: 1, attending: false });
      setGuests((prev) => [...prev, ...data]);
    } catch (err) {
      console.error("Error adding guest:", err.message);
    }
  };

  // Toggle RSVP
  const toggleRSVP = async (guest) => {
    const { error } = await supabase
      .from("guests")
      .update({ attending: !guest.attending })
      .eq("id", guest.id);
    if (error) console.error("Error updating RSVP:", error);
    else fetchGuests();
  };

  // Delete guest
  const deleteGuest = async (id) => {
    const { error } = await supabase.from("guests").delete().eq("id", id);
    if (error) console.error("Error deleting guest:", error);
    else fetchGuests();
  };

  const totalAttendees = guests
    .filter((g) => g.attending)
    .reduce((sum, g) => sum + (g.members || 1), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Total attendees */}
      <div className="text-lg font-semibold text-gray-700">
        Total Attendees: {totalAttendees}
      </div>

      {/* Add New Guest */}
      <div className="bg-white rounded-3xl shadow-lg p-4">
        <h2 className="text-xl font-semibold text-pink-600 mb-2">Add Guest</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Head of Family"
            value={newGuest.name}
            onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
            className="border px-2 py-1 rounded-lg"
          />
          <input
            type="text"
            placeholder="Contact Number"
            value={newGuest.contact}
            onChange={(e) =>
              setNewGuest({ ...newGuest, contact: e.target.value })
            }
            className="border px-2 py-1 rounded-lg"
          />
          <input
            type="number"
            placeholder="Number of Members"
            min={1}
            value={newGuest.members}
            onChange={(e) =>
              setNewGuest({ ...newGuest, members: parseInt(e.target.value) })
            }
            className="border px-2 py-1 rounded-lg"
          />
          <button
            onClick={addGuest}
            className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 col-span-1"
          >
            Add
          </button>
        </div>
      </div>

      {/* Guest List */}
      <div className="bg-white rounded-3xl shadow-lg p-4">
        <h2 className="text-xl font-semibold text-pink-600 mb-2">Guest List</h2>
        {guests.length === 0 ? (
          <p className="text-gray-500">No guests added yet.</p>
        ) : (
          <ul className="space-y-2">
            {guests.map((guest) => (
              <li
                key={guest.id}
                className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
              >
                <div>
                  <p className="font-medium">{guest.name}</p>
                  <p className="text-gray-500">Members: {guest.members || 1}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => toggleRSVP(guest)}
                    className={`px-3 py-1 rounded-full text-white ${
                      guest.attending
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {guest.attending ? "Attending" : "Not Attending"}
                  </button>
                  <button
                    onClick={() => deleteGuest(guest.id)}
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Guests;
