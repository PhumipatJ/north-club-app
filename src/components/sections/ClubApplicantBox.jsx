import {
    Button,
  } from "@mui/material";
  import { useNavigate,useMatch} from "react-router-dom";
  const ClubApplicantsBox = ({ clubId }) => {
    const navigate = useNavigate();
    
    return(
    <div className="bg-[#fff] mt-10 rounded-[5px] w-[13dvw] h-fit sticky" style={{boxShadow:'0px 0px 2px rgba(26,26,26,0.25'}}>
    <Button
          variant="contained"
          color="primary"
          sx={{
            boxShadow: "none",
            width:'100%',
            bgcolor: location.pathname ===`/clubmanage/${clubId}/ClubApplicantsList`|| location.pathname ==='/clubmanage'? '#FF7E69' : "white",
            color: location.pathname ===`/clubmanage/${clubId}/ClubApplicantsList` || location.pathname ==='/clubmanage' ? 'white' : "#1A1A1A",
            "&:hover": { bgcolor: "#FF7E69",boxShadow:"none"},
            borderRadius:"5px 5px 0 0",
          }}
          onClick={() => navigate(`/clubmanage/${clubId}/ClubApplicantsList`)}
        >
          รายชื่อผู้สมัคร
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            boxShadow: "none",
            width:'100%',
            bgcolor: location.pathname ===`/clubmanage/${clubId}/ClubAllApplicants`|| location.pathname ==='/clubmanage'? '#FF7E69' : "white",
            color: location.pathname ===`/clubmanage/${clubId}/ClubAllApplicants`|| location.pathname ==='/clubmanage'? 'white' : "#1A1A1A",
            "&:hover": { bgcolor: "#FF7E69",boxShadow:"none"},
            borderRadius:"0",
          }}
          onClick={() => navigate(`/clubmanage/${clubId}/ClubAllApplicants`)}
        >
          สมาชิกทั้งหมด
        </Button>
    </div>
    )
  }
  export default ClubApplicantsBox;