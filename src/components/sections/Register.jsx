import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../navbar";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("โปรดกรอกอีเมลและรหัสผ่าน");
      return;
    }

    console.log("Logging in with:", { email, password });
    // authentication logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            ลงทะเบียน
          </h2>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                <input
                  type="email"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                <input
                  type="password"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#FF7E69] text-white p-2 rounded-md hover:bg-[#ba5c4c] duration-200 active:bg-[#874337]"
              >
                เข้าสู่ระบบ
              </button>
              <p className="text-center">
              Already have account? <Link to="/login" className="underline">LOG IN</Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
