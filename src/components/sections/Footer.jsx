const Footer = () => {
    return (
      <footer className="bg-[#FF7E69] text-white text-sm px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 ">
          <img src="/assets/Reflecting.svg" alt="Student Illustration"  className="h-18 w-36 pl-2 object-cover "/>
          <div>
            <p>สงวนลิขสิทธิ์ © 2025 กองกิจการนักศึกษา มจพ.</p>
            <p>จัดทำโดย คณะวิทยาศาสตร์ประยุกต์ ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ</p>
          </div>
        </div>
        <div className="text-center md:text-left mt-4 md:mt-0">
          <a href="#" className="underline">นโยบายการใช้งาน</a>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <p>ติดต่อแจ้งปัญหา <a href="mailto:Support@northclub.kmutnb.ac.th" className="underline">Support@northclub.kmutnb.ac.th</a></p>
          <p>หรือโทร 021-111-111</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;