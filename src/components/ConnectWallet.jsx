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
      title: 'Skip (Manual mode)',
      icon: 'no-wallet.svg',
      action: () => {
        onConnected('manual')
      },
    },
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
    if (mode !== 'sol' && connected) {
      // allWallets[1].action()
    }
  }

  useEffect(() => {
    setWallets([ allWallets[ mode === 'sol' ? 2 : 1 ], allWallets[0] ])

    checkConnected()
  }, [mode])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <h3>Please, connect Web3 wallet:</h3>

      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        {wallets.map((item) => (
          <Box sx={{ padding: isMobile ? '20px' : '40px', cursor: 'pointer' }} key={item.title}>
            <Box className={isMobile ? 'wallets-block-mob' : 'wallets-block'} onClick={item.action}>
              <img src={`/icons/${item.icon}`} />
              <Typography>{item.title}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ConnectWallet
