import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../output.css";
import { supabase } from "../Supabase";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Firebase Google Login Successful! User:", user);

      await saveUserToSupabase(user);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Firebase Google Login Failed:", errorCode, errorMessage);
      alert(`Login failed (${errorCode}): ${errorMessage}.`);
    } finally {
      setLoading(false);
    }
  };

  const saveUserToSupabase = async (user) => {
    if (!user) return;
    const { error } = await supabase.from("users").upsert(
      {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photourl: user.photoURL,
      },
      { onConflict: "id" }
    );
    if (error) console.error("Failed to save user:", error.message);
    else console.log("User saved successfully in Supabase");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-yellow-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-6 sm:p-10 w-full max-w-sm sm:max-w-md text-center border border-pink-200">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-2">
            💍 Vivaha Muhurtam
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Plan your dream wedding with ease and elegance.
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 sm:gap-3 bg-pink-500 hover:bg-pink-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full w-full font-medium transition-all shadow-md hover:shadow-lg"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
          Sign in with Google
        </button>

        <p className="text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6 px-2 sm:px-0">
          By signing in, you agree to our{" "}
          <span className="text-pink-600 underline cursor-pointer hover:text-pink-700">
            Terms of Service
          </span>{" "}
          &{" "}
          <span className="text-pink-600 underline cursor-pointer hover:text-pink-700">
            Privacy Policy
          </span>
          .
        </p>
      </div>

      <footer className="mt-6 sm:mt-10 text-gray-500 text-xs sm:text-sm text-center px-2 sm:px-0">
        © 2025 Vivaha Muhurtam | Crafted with 💗 and devotion by Dakshina
      </footer>
    </div>
  );
};

export default Home;
