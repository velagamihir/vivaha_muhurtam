import React from "react";
import { auth, provider, signInWithPopup } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../output.css";
import { supabase } from "../Supabase";
const Home = () => {
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = auth.currentUser;
      const { error } = await supabase.from("users").upsert(
        {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photourl: user.photoURL,
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("Failed to save user:", error.message);
      } else {
        console.log("User saved successfully in Supabase");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-yellow-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-md text-center border border-pink-200">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">
            💍 Vivaha Muhurtam
          </h1>
          <p className="text-gray-600">
            Plan your dream wedding with ease and elegance.
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-full w-full font-medium transition-all shadow-md hover:shadow-lg"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-6 h-6"
          />
          Sign in with Google
        </button>

        <p className="text-gray-500 text-sm mt-6">
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

      <footer className="mt-10 text-gray-500 text-sm">
        © 2025 Vivaha Muhurtam | Crafted with 💗 and devotion by Dakshina
      </footer>
    </div>
  );
};

export default Home;
