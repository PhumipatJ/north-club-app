import {
  Button,
} from "@mui/material";
import { useNavigate,useMatch} from "react-router-dom";
const AdmindatabaseBox =()=>{
  const navigate = useNavigate();
  const match = useMatch("/database/ReqDetail/*")
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
          bgcolor: location.pathname ==='/database/adminActivities'||location.pathname ==='/database/adminActivitiesReq'||match? '#FF7E69' : "white",
          color: location.pathname ==='/database/adminActivities'||location.pathname ==='/database/adminActivitiesReq' ||match? 'white' : "#1A1A1A",
          "&:hover": { bgcolor: "#FF7E69",boxShadow:"none"},
          borderRadius:"0",
        }}
        onClick={() => navigate("/database/adminActivities")}
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
          bgcolor: location.pathname ==='/database/adminLog'? '#FF7E69' : "white",
          color: location.pathname ==='/database/adminLog'? 'white' : "#1A1A1A",
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