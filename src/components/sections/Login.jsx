import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormControl, InputLabel, OutlinedInput, Button } from "@mui/material";
import supabase from "../../../supabaseClient";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("โปรดกรอกอีเมลและรหัสผ่าน");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(error.message);
      setEmail("");
      setPassword("");
      return;
    }

    if (data) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Circle Background*/}
      <div className="absolute left-0 -bottom-50 w-lg h-lg bg-[#FF7E69] rounded-full transform translate-y-20 translate-x-20 " style={{width: '800px', height: '800px'}}> {/* Adjusted styling */}
      </div>
      
      <div className="flex flex-row items-center justify-between mx-6 max-w-6xl w-full z-0">
        {/* Left Section - Illustration */}
        <div className="flex flex-col">
          <div className="text-4xl font-bold">
            <p>ร่วมเป็นส่วนหนึ่งของการสร้างคอมมูนิตี้<br/>กับ</p>
          </div>
          <div>
            <img src="/assets/GroupLogin.svg" alt="gourpLogin" className="w-xl h-xl" />
          </div>
        </div>
        <div className="max-w-2xl w-md bg-white shadow-lg rounded-lg overflow-hidden z-10">
        {/* Right Section - Login Form */}
        <div className="flex-1 p-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">Login</h2>
          <div className="mb-4">
            <button className="flex items-center justify-center w-full border-1 border-gray-300 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              <FcGoogle className="mr-2" size={20} /> Sign in with Google
            </button>
          </div>
          <div className="relative text-center mb-4">
            <span className="absolute inset-x-0 top-1/2 border-t"></span>
            <span className="relative bg-white px-2 text-gray-500">or</span>
          </div>
          {message && <p className="text-red-500 text-sm text-center mb-4">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative"> {/* Added relative wrapper */}
              <input
                type="email"
                placeholder=""
                className="w-full p-2 outline-none border-b-1 border-[#7CE9BF] rounded-md ring-[#7CE9BF] focus:ring-1 peer" /* Added peer class */
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email" className="absolute left-2 top-1/2  -translate-y-1/2 pointer-events-none text-gray-400 transition-all 
              peer-focus:text-sm peer-focus:top-0 peer-focus:left-2 peer-focus:text-gray-300 peer-focus:bg-white peer-focus:px-1"> {/* Added label for positioning */}
                Enter Username
              </label>
            </div>
            <div className="relative"> {/* Added relative wrapper */}
              <input
                type="password"
                placeholder=""
                className="w-full p-2 outline-none border-b-1 border-[#7CE9BF] rounded-md ring-[#7CE9BF] focus:ring-1 peer" /* Added peer class */
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password" className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 transition-all 
              peer-focus:text-sm peer-focus:top-0  peer-focus:left-2 peer-focus:text-gray-300 peer-focus:bg-white peer-focus:px-1"> {/* Added label for positioning */}
                Enter Password
              </label>
            </div>
            <div className="flex flex-row text-right text-sm text-gray-600 items-center justify-between">
              <Link to="/forgot-password" className="hover:underline">Forgot password?</Link>
              <button
              type="submit"
              className="w-20 bg-[#7CE9BF] text-black font-bold py-2 rounded-md hover:bg-[#2AAE76]"
            >
              Login
            </button>
            </div>
            
          </form>
          <p className="text-center text-sm mt-4">
            Need an account? <Link to="/register" className="text-[#FF7E69] font-semibold hover:underline">SIGN UP</Link>
          </p>
        </div>
      </div>

      </div>
      
    </div>
  );
};

export default Login;
