import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Prompt, sans-serif", // ใช้ฟอนต์ Kanit ทั่วทั้ง MUI
    button: {
      textTransform: "none", // เอา Uppercase ออก
      fontWeight: "regular",
    },

  },
 
});

export default theme;