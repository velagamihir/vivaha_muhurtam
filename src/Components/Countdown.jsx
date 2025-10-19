// src/Components/Countdown.jsx
import React, { useEffect, useState } from "react";

const Countdown = ({ weddingDate }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(weddingDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(weddingDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  function getTimeLeft(date) {
    if (!date) return null;
    const now = new Date();
    const wedding = new Date(date);
    const diff = wedding - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  }

  if (!timeLeft)
    return <p className="text-gray-500">The wedding has started!</p>;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 text-center max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-pink-600 mb-4">
        Wedding Countdown
      </h2>
      <div className="flex justify-center gap-4 text-gray-700">
        <div>
          <p className="text-2xl font-bold">{timeLeft.days}</p>
          <p className="text-sm">Days</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{timeLeft.hours}</p>
          <p className="text-sm">Hours</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{timeLeft.minutes}</p>
          <p className="text-sm">Minutes</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{timeLeft.seconds}</p>
          <p className="text-sm">Seconds</p>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
