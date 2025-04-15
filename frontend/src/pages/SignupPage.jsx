import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const SignupPage = () => {
  const { loginWithGoogle, registerWithLocal, isAuthenticated } = useAppContext();
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sign Up for MEMS</h1>
        <p className="text-gray-600 mb-8">
          Join us and explore the latest events and features.
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

        <div className="flex items-center justify-center my-4 text-gray-600">
          <span className="w-1/3 border-b border-gray-300"></span>
          <span className="mx-2">or</span>
          <span className="w-1/3 border-b border-gray-300"></span>
        </div>

        <button
          onClick={loginWithGoogle}
          className="bg-white border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300 shadow-md w-full flex items-center justify-center gap-2 mb-4"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{ display: "block", width: "20px", height: "20px" }}
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          <span className="text-gray-700 font-semibold">Sign Up with Google</span>
        </button>

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
