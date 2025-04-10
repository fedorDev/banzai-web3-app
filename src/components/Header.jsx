import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material'

const Header = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px', flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button href='/'>
          <Typography variant="h6" sx={{ color: 'white', textTransform: 'none' }}>
            BANZAI
          </Typography>
        </Button>

        <Box>
          <Button href='/rules' sx={{ color: 'white', marginRight: '20px' }}>
            Rules
          </Button>
          <Button
            // variant='outlined'
            color='default'
            sx={{ color: 'white' }}
            target='_blank'
            href='https://four.meme/token/0xa28f31e578aa8cf563782073aaa53478ed5bce6b'
          >
            <img src={'/icons/banzai-token.svg'} className='token-logo' />
            <span>Token</span>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  </Box>
)

export default Header
