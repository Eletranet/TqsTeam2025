import React, { useEffect } from "react";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Container,
  Typography
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import {APIProvider} from '@vis.gl/react-google-maps';
import CustomModal from "../components/CustomModal"
function Home(){
  const [open, setOpen] = React.useState(false);

  const abrirModal = () => setOpen(true);
  const fecharModal = () => setOpen(false);



  
 const navigate = useNavigate();

      useEffect(() => {
        const token = localStorage.getItem("TokenEletraNet");
        if (!token) {
        
          navigate("/loguin");

        }
      }, [navigate]);

    return(

    <Container>
     <Box sx={{ 
           minHeight: '100vh',
           p: 5
         }}>


    </Box>
    
    </Container>
    )
}
export default Home