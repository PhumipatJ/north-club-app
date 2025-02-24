import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { FcGoogle } from "react-icons/fc";
import authService from "../../service/AuthService";
// sho comment
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: '#757575',
  },
  '& .MuiInputLabel-shrink': {
    color: '#333',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderBottom: '1px solid #7CE9BF', // Initial bottom border
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
    },
    '&:hover fieldset': {
      borderBottom: '2px solid #7CE9BF', // Maintain bottom border on hover
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#7CE9BF', // All-around border when focused
      borderWidth: '1px',
      borderBottom: '2px solid #7CE9BF', // Maintain bottom border on hover
      borderTop: '1px solid #7CE9BF',
      borderLeft: '1px solid #7CE9BF',
      borderRight: '1px solid #7CE9BF',
    },
    '& input': {
      padding: '8px',
    },
  },
}));

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

    const { data, error } = await authService.login(email, password);
    /* const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    }); */

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
    <div className="flex items-center justify-center bg-gray-50 relative min-h-screen overflow-hidden">
  
      <div className="flex flex-col lg:flex-row items-center justify-between mt-16 p-4 max-w-6xl w-full z-0 relative">
        {/* Left Section - Text + Semicircle */}
        <div className="relative flex flex-col items-center text-center lg:text-left lg:pl-8 mb-8 lg:mb-0">
          {/* Topic Text Above Semicircle */}
          <div className="relative text-3xl sm:text-4xl font-bold lg:-translate-y-1/2 z-10">
            <p className="">ร่วมเป็นส่วนหนึ่งของการสร้างคอมมูนิตี้<br/>กับ</p>
            <p className="text-sm mt-2 text-gray-600 lg:text-right lg:-translate-x-2/7 lg:-translate-y-10 lg:block ">More Creativity Better Community</p>
            <p className="text-5xl mt-2 text-[#7CE9BF] lg:text-right lg:-translate-x-2/7 lg:-translate-y-13 lg:block ">NORTH'S CLUB</p>
          </div>

          {/* Semicircle Background */}
          <div 
            className="absolute hidden lg:flex left-1/8 bottom-0 -translate-x-1/2 bg-[#FF7E69] rounded-t-full justify-center items-center z-0"
            style={{ width: '100vh', height: '50vh', transform: 'translateX(25%) translateY(75%)' }}
          >
            <img src="/assets/GroupLogin.svg" alt="groupLogin" className="relative w-full h-full object-contain translate-y-3.5" />
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="max-w-2xl w-md bg-white shadow-lg rounded-lg overflow-hidden z-10">
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
      <div className="relative border-none">
        <StyledTextField
          fullWidth
          label="Enter Username"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="relative">
        <StyledTextField
          fullWidth
          label="Enter Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-row text-right text-sm text-gray-600 items-center justify-between">
        <Link to="/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
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
