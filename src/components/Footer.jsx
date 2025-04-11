import { Link, Box, IconButton, Typography } from '@mui/material'

const Footer = () => (
  <Box sx={{ textAlign: 'center' }}>
    <Box className='footer'>
      Copyright &copy; 2025 BANZAI GameFi ecosystem. Follow us on 
      <IconButton size='small' target='_blank' href='https://x.com/Banzai_GameFi'>
        <img src='/icons/x.png' style={{ width: '24px', height: '24px' }} />
      </IconButton>
    </Box>
  </Box>
)

export default Footer
