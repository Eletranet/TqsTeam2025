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

function Home(){




  
 const navigate = useNavigate();

      useEffect(() => {
        const token = localStorage.getItem("TokenEletraNet");
        if (!token) {
        
          navigate("/loguin");

        }
      }, [navigate]);

    return(

        <>
        Home Page / tem que estar logado
        </>
    )
}
export default Home