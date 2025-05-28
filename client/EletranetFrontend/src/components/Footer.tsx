import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 4,
        px: 4,
        mt: 'auto',
        color: '#fff',
        backgroundColor:"#222",
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} ElectraNet. Todos os direitos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;
