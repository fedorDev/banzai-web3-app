import { useState } from 'react'
import { Box, Grid, Stack, Typography, useMediaQuery } from '@mui/material'

const ChainCardMob = ({ data, onPicked }) => (
  <Box className='chain-block-mob' onClick={() => onPicked(data.id)}>
    <img src={`/icons/${data.id}-logo.png`} height='60' width='60' />
    <Typography>{data.title}</Typography>
  </Box>
)

const ChainCard = ({ data, onPicked }) => (
  <Box sx={{ padding: '40px', cursor: 'pointer' }}>
    <Box className='chain-block' onClick={() => onPicked(data.id)}>
      <img src={`/icons/${data.id}-logo.png`} height='240' width='240' />
      <Typography>{data.title}</Typography>
    </Box>
  </Box>
)

const App = ({ onPicked }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const chains = [
    {
      id: 'eth',
      title: 'Ethereum',
    },
    {
      id: 'bsc',
      title: 'Binance Smart Chain',
    },
    {
      id: 'sol',
      title: 'Solana',
    }
  ]

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <h3>Please, select chain:</h3>

      <Stack spacing={2} direction={ isMobile ? 'column' : 'row' }>
        {chains.map((chain) => isMobile
          ? <ChainCardMob data={chain} onPicked={onPicked} key={chain.id} />
          : <ChainCard data={chain} onPicked={onPicked} key={chain.id} />
        )}
      </Stack>

      <Typography variant='h5' sx={{ marginTop: '40px', width: '60vw', textAlign: 'center' }}>
        Play and earn up to 900% in BNB, Sol or Eth! GameFi Ecosystem linked with 
        $BANZAI memecoin, so rewards will be used to token buyback.
      </Typography>

    </Box>
  )
}

export default App
