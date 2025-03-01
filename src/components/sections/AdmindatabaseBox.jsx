import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Avatar,
  ThemeProvider,
  Box,
} from "@mui/material";
import {SquareChartGantt} from "lucide-react";
import { useNavigate ,useLocation} from "react-router-dom";
import supabase from "../../../supabaseClient";
import theme from "../Theme";
import Loading from "../loading";
import {styled} from "@mui/system";
import ApprovalPopup from "./ApprovalPopup";
import ConfirmCard from "../confirmCard";
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
          bgcolor: location.pathname ==='/database/adminRespond'|| location.pathname ==='/database'? '#FF7E69' : "white",
          color: location.pathname ==='/database/adminRespond' || location.pathname ==='/database'? 'white' : "#1A1A1A",
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
        onClick={() => setopen(true)}
      >
        สิทธิ์ผู้ดูแล
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
        onClick={() => navigate("/approvalHistory")}
      >
        กิจกรรม
      </Button>
  </div>
  )
}
export default AdmindatabaseBox;