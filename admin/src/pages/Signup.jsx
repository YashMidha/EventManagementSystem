import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const SignupPage = () => {
  const { registerWithLocal, isAuthenticated } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    await registerWithLocal(email, password, name);
    if (isAuthenticated) navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center w-96">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sign Up</h1>
        <p className="text-gray-600 mb-8">
          Join the admin panel to manage events and users.
        </p>

        <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md w-full"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:underline hover:text-blue-600"
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
