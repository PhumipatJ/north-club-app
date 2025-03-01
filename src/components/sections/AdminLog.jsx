import { useState, useEffect ,} from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ThemeProvider,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";
import theme from "../Theme";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Loading from "../loading";
import AdmindatabaseBox from "./AdmindatabaseBox";
import {User,UserCog} from "lucide-react";
const AdminLog = () => {
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingClubs = async () => {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .in("role", ['club','student'])

      if (error) {
        console.error("Error fetching clubs:", error);
      } else {
        console.log(data)
        setPendingClubs(
          data.map((club) => ({
            ...club
          }))
        );
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    fetchPendingClubs();
  }, []);
  
  const CustomTableCell = styled(TableCell)({
    borderBottom: '2px solid #FF7E69',
    color: '#FF7E69',
    textAlign:'center',
  });
  if(loading){
    return <Loading/>
  }
  return (
    <ThemeProvider theme={theme}>
      <Container className="p-6 mt-24 min-h-[77vh] flex flex-col justify-center">
        <div className="flex max-w-6xl w-full">
          <div className=" w-full h-fit flex">
            <h1 className="text-4xl font-bold my-auto ">ผู้ใช้ทั้งหมด</h1>
            <div className="my-auto flex ml-auto w-fit gap-5">
              <div className="flex items-center ">
                <User className="text-[#7CE9BF]"/> : Student
              </div>
              <div className="flex items-center ">
                <UserCog className="text-[#FF7E69]"/> : Club's Staff
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between gap-10 h-[calc(100vh-184px)]">
          <AdmindatabaseBox/>
          <TableContainer
            component={Paper}
            sx={{
              overflowY:'auto',
              mt: 2,
              boxShadow:'none',
              "&::-webkit-scrollbar": {
                width: "1px",
                height:'1px',
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor:'#FF7E697D',
                borderRadius: "10px",
                transition: "background-color 1s ease" 
              },
              "&::-webkit-scrollbar-thumb:hover":{
                backgroundColor:'#FF7E69',
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <CustomTableCell>ตำแหน่ง</CustomTableCell>
                  <CustomTableCell>ชื่อ-นามสกุล</CustomTableCell>
                  <CustomTableCell>Gmail</CustomTableCell>
                  <CustomTableCell>ปี</CustomTableCell>
                  <CustomTableCell>คณะ</CustomTableCell>
                  <CustomTableCell>สาขา</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{overflowY:"auto"}}>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : pendingClubs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{borderColor:'#fff'}}>
                      ไม่มีชมรม
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingClubs.sort((a, b) => a.role.localeCompare(b.role)).map((club) => (
                    <TableRow key={club.id} sx={{'&:hover':{backgroundColor:'#f9f9f9' , cursor:'pointer'}}}>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff',display:'flex',justifyContent:'center'}}>
                        {club.role !== 'club'?(<User className="text-[#7CE9BF]"/>):(<UserCog className="text-[#FF7E69]"/>)}
                      </TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club?.name}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club?.email || "N/A"}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{new Date().getFullYear() + 543 - club?.admission_year || "N/A"}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club?.faculty || "N/A"}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club?.department}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default AdminLog;
