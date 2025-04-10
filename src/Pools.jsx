import { useState, useEffect } from 'react'
import {
  Box,
  CircularProgress,
  Button,
  Typography,
  useMediaQuery,
  Stack,
} from '@mui/material'
import { useSDK } from '@metamask/sdk-react'
import ConnectWallet from '/src/components/ConnectWallet'
import PoolCard from '/src/components/PoolCard'
import { shortAddr, rewards } from '/src/helpers/utils'
import WinnersTable from '/src/components/Winners'

const List = ({ mode, title }) => {
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
    const functionSignature = '0xaa2e2e63'

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
    const req = await fetch(`/data/pools.json?date=${tm}`)
    if (!req.ok) return false

    const data = await req.json()
    if (data && data[mode]) {
      setPools(data[mode])
    }
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
    if (wallet) {
      setTimeout(loadPools, 1000)
    }
  }, [wallet])

  if (!wallet) {
    return (<ConnectWallet mode={mode} onConnected={setWallet} />)
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
