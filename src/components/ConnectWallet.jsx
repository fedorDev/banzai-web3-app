import { useState, useEffect } from 'react'
import { useSDK } from '@metamask/sdk-react'
import { Box, Stack, Typography, useMediaQuery } from '@mui/material'
import { useSnackbar } from 'notistack'

const ConnectWallet = ({ mode, onConnected }) => {
  const { sdk, connected, connecting, provider, chainId, account } = useSDK()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { enqueueSnackbar } = useSnackbar()
  const [wallets, setWallets] = useState([])

  const allWallets = [
    {
      title: 'Metamask',
      icon: 'metamask.png',
      action: async () => {
        const accounts = await sdk?.connect()
        console.log('got accounts', accounts)
        if (provider) {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: mode == 'eth' ? '0x1' : '0x38' }]
          })
        }

        if (accounts && accounts.length > 0)
          onConnected(accounts[0])
      },
    },
    {
      title: 'Phantom *COMING SOON*',
      icon: 'phantom.png',
      action: async () => true,
    },
  ]

  const checkConnected = () => {
    console.log('check connected', sdk)
    if (mode !== 'sol' && connected) {
      allWallets[0].action()
    }
  }

  useEffect(() => {
    setWallets([ allWallets[ mode === 'sol' ? 1 : 0 ] ])

    checkConnected()
  }, [mode])

  /*
  if (isMobile && !window.ethereum) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <h3>Please, open MetaMask mobile app</h3>

        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {wallets.map((item) => (
            <Box sx={{ padding: '40px', cursor: 'pointer' }} key={item.title}>
              <Box className='wallets-block' onClick={() =>{
                window.location = 'https://metamask.app.link/dapp/banzai.meme/'+mode
              }}>
                <img src={`/icons/${item.icon}`} height='240' width='240' />
                <Typography>{item.title}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>      
    )
  } */

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <h3>Please, connect Web3 wallet:</h3>

      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        {wallets.map((item) => (
          <Box sx={{ padding: '40px', cursor: 'pointer' }} key={item.title}>
            <Box className='wallets-block' onClick={item.action}>
              <img src={`/icons/${item.icon}`} height='240' width='240' />
              <Typography>{item.title}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ConnectWallet
