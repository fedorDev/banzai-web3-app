import { useState, useEffect } from 'react'
import { useSDK } from '@metamask/sdk-react'
import {
  Button,
  Box,
  Stack,
  Tooltip,
  Typography,
  IconButton,
} from '@mui/material'

import { Gauge } from '@mui/x-charts/Gauge'
import { useSnackbar } from 'notistack'
import { shortAddr, rewards } from '/src/helpers/utils'

let playerCnt = 0
const creator = '90fe1986092Ec963C4e9368837D02CB297f545Fe'

const PoolCard = ({ data, mode, address }) => {
  const { sdk, connected, connecting, provider, chainId, account } = useSDK()
  const { enqueueSnackbar } = useSnackbar()
  const [players, setPlayers] = useState(0)
  const [chance, setChance] = useState(0)
  const [lastWinner, setLastWinner] = useState(false)

  const progress = players * 10

  const getLastWinner = async () => {
    const result = await provider.request({
      method: "eth_call",
      params: [{
        to: data.address,
        data: '0xfe188184',
      }],
    }).catch((err) => {
      enqueueSnackbar(JSON.stringify(err), { variant: 'error' })
    })

    if (Number(result) > 0) {
      const p = result.substring(26)
      setLastWinner(address.includes(p) ? 'You!' : shortAddr(p, '0x'))
    }
  }

  const detectWinner = async () => {
    const txHash = await provider.request({
      method: "eth_sendTransaction",
      params: [{
        from: address,
        to: data.address,
        data: '0xaf3c9584', // detectWinner() function signature
        value: '1',
      }],
    })

    if (txHash) {
      enqueueSnackbar(`Called smartcontract, detecting winner...`, { variant: 'success' })
      setTimeout(loadPoolData, 2000)
    }
  }

  const claimRewards = async () => {
    const txHash = await provider.request({
      method: "eth_sendTransaction",
      params: [{
        from: account,
        to: data.address,
        data: '0xb88a802f', // claimReward() function signature
        value: '1',
      }],
    })

    if (txHash) {
      enqueueSnackbar(`Claiming reward...`, { variant: 'success' })
      setTimeout(loadPoolData, 2000)
    }
  }

  const loadPoolData = async () => {    
    const functionSignature = '0xed462bfd'; // showPool() function signature

    const result = await provider.request({
      method: "eth_call",
      params: [{
        to: data.address,
        data: functionSignature // + encodedAddress,
      }],
    }).catch((err) => {
      enqueueSnackbar(JSON.stringify(err), { variant: 'error' })
    })

    const p = result.substring(120, 130)
    const c = Number('0x'+p)
    // console.log('pool', result, c)
    playerCnt = c
    setPlayers(c)

    const short = address.substring(2)
    const regex = new RegExp(short, "g")
    const count = (result.match(regex) || []).length
    setChance(count*10)
  }

  const addStake = () => {
    provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: address,
          to: data.address,
          value: data.stakeWei,
        },
      ],
    })
    .then((txHash) => {
      enqueueSnackbar(`Your stake ${data.stake} added!`, { variant: 'success' })
      // reload pool data
      window.gtag('event', 'add_stake', {
        'chain': mode,
        'pool': data.title,
      })

      setTimeout(loadPoolData, 2000)
      setTimeout(loadPoolData, 6000)
    })
    .catch((err) => {
      enqueueSnackbar(`Failed to add stake!`, { variant: 'error' })      
    })
  }

  useEffect(() => {
    loadPoolData()
    getLastWinner()
  }, [provider])

  const getLink = () => {
    if (mode == 'bsc') return `https://bscscan.com/address/${data.address}`

    return `https://etherscan.io/address/${data.address}`
  }

  const isCreator = address.includes(creator.toLowerCase())

  return (
    <Box sx={{ padding: '40px' }} key={data.title}>
      <Box className='pool-card'>
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
        <br/>
        <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center' }}>
          Pool prize: {data.stake * 9}
          <img className='pool-coin-big' src={`/icons/coins/${mode}.png`} />
        </Typography>
        {lastWinner ? (
          <b>Last winner: <span style={{ color: 'red' }}>{lastWinner}</span></b>
        ) : (
          <b>No winner yet</b>
        )}
        
        <Box sx={{ height: '150px' }}>
          <Gauge
            width={240}
            // height={140}
            value={progress}
            startAngle={-90}
            endAngle={90}
            text={({ value, valueMax }) => `${players} / 10`}
          />
        </Box>
        Your chance: {chance}%

        <Stack direction='row' spacing={2}>
          {players > 9 && (
            <Button variant='contained' color='secondary' onClick={detectWinner}>Detect winner</Button>
          )}
          {players < 10 && (
            <Button variant='contained' onClick={addStake}>Stake {data.stake} {mode}</Button>
          )}
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
          {isCreator && (
            <Button variant='contained' color='secondary' onClick={claimRewards}>Rewards</Button>            
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default PoolCard
