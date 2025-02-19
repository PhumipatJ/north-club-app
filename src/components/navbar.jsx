import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import supabase from "../../supabaseClient";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    getSession();

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full transition-all duration-300 z-10 h-18 font-prompt ${isScrolled ? "opacity-95" : "p-3"}`}>
      <div className="bg-white shadow-md max-w-6xl mx-auto px-6 flex justify-between items-center h-14 my-2 rounded-full">
        {/* LOGO */}
        <h1 className="text-xl text-[#FF7E69] font-bold pt-2">North's Club</h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#FF7E69] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-[#FF7E69]">
          <Link to="/" className="hover:underline hover:text-[#7CE9BF] pt-1.5">หน้าหลัก</Link>
          <Link to="/clubs" className="hover:underline hover:text-[#7CE9BF] pt-1.5">ชมรม</Link>
          <Link to="/docs" className="hover:underline hover:text-[#7CE9BF] pt-1.5">เอกสาร</Link>
          <Link to="/stats" className="hover:underline hover:text-[#7CE9BF] pt-1.5">สถิติ</Link>
          
          {session ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
              }}
              className="bg-[#7CE9BF] text-black font-bold px-4 py-1 rounded-full hover:bg-emerald-400"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-[#7CE9BF] text-black font-bold px-4 py-1 rounded-full hover:bg-emerald-400">
              Login
            </Link>
          )}

        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md rounded-lg p-4 flex flex-col space-y-4 text-[#FF7E69] text-center mt-2 mx-4">
          <Link to="/" className="hover:underline hover:text-[#7CE9BF]">หน้าหลัก</Link>
          <Link to="/clubs" className="hover:underline hover:text-[#7CE9BF]">ชมรม</Link>
          <Link to="/docs" className="hover:underline hover:text-[#7CE9BF]">เอกสาร</Link>
          <Link to="/stats" className="hover:underline hover:text-[#7CE9BF]">สถิติ</Link>
          <Link to="/login" className="bg-[#7CE9BF] text-black font-bold px-4 py-1 rounded-full hover:bg-emerald-400">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
