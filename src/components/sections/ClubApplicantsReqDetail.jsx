import { useState, useEffect ,} from "react";
import {
  Container,
  ThemeProvider,
  Button,
  Box
} from "@mui/material";
import { useNavigate ,useParams} from "react-router-dom";
import supabaseService from "../../service/supabaseService";
import theme from "../Theme";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Loading from "../loading";
import AdmindatabaseBox from "./AdmindatabaseBox";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import {MapPin,Calendar,File} from "lucide-react";
import ConfirmCard from "../confirmCard";

const ClubApplicantsReqDetail = () => {
  const { applicantId } = useParams();
  const [eventDetail, setEventDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason,setReason] = useState('');
  const [doc,setdoc] = useState('');
  const [isConfirmOpen,setopen] = useState(false);
  const navigate = useNavigate(0);
  const supabase = supabaseService.getClient();

  return (
    <h1 className="text-4xl font-bold my-auto ">{applicantId}</h1>
  );
};

export default ClubApplicantsReqDetail;
