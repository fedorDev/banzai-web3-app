import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CircularProgress,
  Button,
  Typography,
  useMediaQuery,
  Stack,
} from '@mui/material'
import { useSDK } from '@metamask/sdk-react'
import ConnectWallet from '/src/components/ConnectWallet'
import { shortAddr, rewards } from '/src/helpers/utils'
import WinnersTable from '/src/components/Winners'
import PoolCard from '/src/components/PoolCard'
import PoolsConfig from '/src/data/pools.json'
import PoolListItem from '/src/components/PoolListItem'

// for manual mode:
const AllPools = ({ mode }) => (
  <Box className='pools-page'>
    <Typography variant='h5'>Pools list (Manual mode)</Typography>

    <Stack>
      {PoolsConfig[mode].map((pool) => (
        <PoolListItem data={pool} mode={mode} />
      ))}

      <Box sx={{ padding: '20px', textAlign: 'center' }}>
        <span>
          You can copy address of pool and send amount of tokens by yourself from any wallet.
          <br/><br/>
          <strong>IMPORTANT: Do NOT send coins from Exchange account</strong>
        </span>
      </Box>
    </Stack>

  </Box>
)

const List = ({ mode }) => {
  const { sdk, connected, connecting, provider, chainId } = useSDK()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [wallet, setWallet] = useState(false)
  const [balance, setBalance] = useState(0)
  const [pools, setPools] = useState([])
  const [winners, setWinners] = useState([])

  const checkBalance = () => {
    setBalance(3.5)
  }

  const loadWinners = async () => {    
    const functionSignature = '0xaa2e2e63' // showWinners() function signature

    window.gtag('event', 'load_winners', {
      'chain': mode,
    })

    let list = []

    for (const pool of pools) {
      const result = await provider.request({
        method: "eth_call",
        params: [{
          to: pool.address,
          data: functionSignature,
        }],
      }).catch((err) => {
        enqueueSnackbar(JSON.stringify(err), { variant: 'error' })
      })

      const score = {}

      const data = result.substring(130)
      const poolWinners = data.split('000000000000000000000000')
      poolWinners.forEach((item) => {
        if (item.length > 3) {
          const you = wallet.includes(item)
          if (score[item]) {
            score[item].win += pool.stake*9
            score[item].rounds++
          } else {
            score[item] = {
              stake: pool.stake,
              address: '0x'+item,
              win: pool.stake*9,
              pool: pool.title,
              you,
              rounds: 1,
            }
          }
        }
      })

      Object.values(score).forEach((item) => list.push(item))
    }
    setWinners(list)
  }  

  const loadPools = async () => {
    const tm = new Date().getTime()
    setPools(PoolsConfig[mode])
  }

  const handleDisconnect = () => {
    sdk?.disconnect()
    setWallet(false)
    window.location = '/'
  }

  useEffect(() => {
    if (pools && pools.length > 0) loadWinners()
  }, [pools])

  useEffect(() => {
    if (!connected) setWallet(false)
  }, [connected])

  useEffect(() => {
    if (wallet && wallet != 'manual') {
      setTimeout(loadPools, 1000)
    }
  }, [wallet])

  if (!wallet) {
    return (<ConnectWallet mode={mode} onConnected={setWallet} />)
  }

  if (wallet == 'manual') {
    return (<AllPools mode={mode} />)
  }

  return (
    <Box className='pools-page'>
      <Box>
        Your wallet: {shortAddr(wallet)} {/* (balance: {balance} {mode}) */} <Button onClick={handleDisconnect}>Disconnect</Button>
      </Box>

      {pools.length < 1 && (
        <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        {pools.map((pool) => (<PoolCard data={pool} mode={mode} address={wallet} key={pool.title} />))}
      </Box>

      <WinnersTable data={winners} mode={mode} />
      <br/>
    </Box>
  )
}
export default List
