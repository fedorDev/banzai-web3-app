import { useState, useEffect } from 'react'
import {
  Button,
  Box,
  Stack,
  Grid,
  Tooltip,
  Typography,
  TextField,
  IconButton,
  useMediaQuery,
} from '@mui/material'

import { useSnackbar } from 'notistack'
import { shortAddr, rewards } from '/src/helpers/utils'

let playerCnt = 0

const PoolListItem = ({ data, mode, address }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { enqueueSnackbar } = useSnackbar()
  const [players, setPlayers] = useState(0)
  const [chance, setChance] = useState(0)
  const [lastWinner, setLastWinner] = useState(false)

  const progress = players * 10

  const getLink = () => {
    if (mode == 'bsc') return `https://bscscan.com/address/${data.address}`

    return `https://etherscan.io/address/${data.address}`
  }

  return (
    <Box className='pools-page' key={data.title}>
      <Box className={isMobile ? 'pool-item-mob' : 'pool-item'}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '40px',
          display: 'flex',
          paddingLeft: '30px',
          paddingRight: '20px',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgb(25, 118, 210)',
          color: 'white',
        }}>
          <Typography>{data.title}</Typography>
          <Tooltip title='Open in chain explorer'>
            <IconButton href={getLink()} target='_blank'>
              <img src='/icons/block-explorer.png' style={{ width: '36px', height: '36px' }}/>
            </IconButton>
          </Tooltip>
        </Box>
        <Grid container sx={{ marginTop: '30px' }}>
          <Grid item xs={6} className='pool-item-block-left'>
            Stake: {data.stake} <img className='pool-coin' src={`/icons/coins/${mode}.png`} />
          </Grid>
          <Grid item xs={6} className='pool-item-block-right'>
            Pool prize: {data.stake * 9} <img className='pool-coin' src={`/icons/coins/${mode}.png`} />
          </Grid>
        </Grid>

        <Stack direction='row' spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
          <TextField
            id='read-only-input'
            label='Contract address'
            size='small'
            fullWidth
            defaultValue={isMobile ? shortAddr(data.address) : data.address}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
          <Button
            variant='contained'
            sx={{ bgcolor: 'primary.light' }}
            onClick={() => {
            navigator.clipboard.writeText(data.address)
            enqueueSnackbar('Copied address of contract', { variant: 'success' })
          }}
          >
            <img src='/icons/copy.svg' style={{ width: '24px', height: '24px' }}/>
          </Button>
        </Stack>

      </Box>
    </Box>
  )
}

export default PoolListItem
