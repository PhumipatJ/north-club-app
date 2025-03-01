import {
  Button,
} from "@mui/material";
import { useNavigate} from "react-router-dom";
const AdmindatabaseBox =()=>{
  const navigate = useNavigate();
  return(
  <div className="bg-[#fff] mt-10 rounded-[5px] w-[13dvw] h-fit sticky" style={{boxShadow:'0px 0px 2px rgba(26,26,26,0.25'}}>
  <Button
        variant="contained"
        color="primary"
        sx={{
          boxShadow: "none",
          width:'100%',
          bgcolor: location.pathname ==='/database/adminRespond'|| location.pathname ==='/database'|| location.pathname==='/database/approvalHistory'? '#FF7E69' : "white",
          color: location.pathname ==='/database/adminRespond' || location.pathname ==='/database' || location.pathname==='/database/approvalHistory'? 'white' : "#1A1A1A",
          "&:hover": { bgcolor: "#FF7E69",boxShadow:"none"},
          borderRadius:"5px 5px 0 0",
        }}
        onClick={() => navigate("/database")}
      >
        รายชื่อชมรม
      </Button>
      
      <Button
        variant="contained"
        color="primary"
        sx={{
          boxShadow: "none",
          width:'100%',
          bgcolor: "white",
          color: "#1A1A1A",
          "&:hover": { bgcolor: "#FF7E69",boxShadow:"none"},
          borderRadius:"0",
        }}
        onClick={() => navigate("/approvalHistory")}
      >
        กิจกรรม
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{
          boxShadow: "none",
          width:'100%',
          bgcolor: location.pathname ==='/database/adminUserPreview'? '#FF7E69' : "white",
          color: location.pathname ==='/database/adminUserPreview'? 'white' : "#1A1A1A",
          "&:hover": { bgcolor: "#FF7E69",boxShadow:"none"},
          borderRadius:"0",
        }}
        onClick={() => navigate("/database/adminUserPreview")}
      >
        ผู้ใช้ทั้งหมด
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{
          boxShadow: "none",
          width:'100%',
          bgcolor: "white",
          color: "#1A1A1A",
          "&:hover": { bgcolor: "#FF7E69",boxShadow:"none"},
          borderRadius:"0 0 5px 5px",
        }}
        onClick={() => navigate("/database/adminLog")}
      >
        Log การใช้งาน
      </Button>
  </div>
  )
}
export default AdmindatabaseBox;