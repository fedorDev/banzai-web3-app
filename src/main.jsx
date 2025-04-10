import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from '/src/components/Header'
import Footer from '/src/components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router'
import { MetaMaskProvider } from '@metamask/sdk-react'
import { SnackbarProvider } from 'notistack'
import App from './App.jsx'
import Pools from './Pools'
import Rules from './RulesPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <SnackbarProvider>
      <MetaMaskProvider
        debug={false}
        sdkOptions={{
          dappMetadata: {
            name: 'Banzai GameFi',
            url: 'https://banzai.meme/',
          },
          infuraAPIKey: import.meta.env.INFURA_API_KEY,
          // Other options
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/eth" element={<Pools title='Ethereum' mode='eth' />} />
            <Route path="/bsc" element={<Pools title='Binance Smart Chain' mode='bsc' />} />
            <Route path="/sol" element={<Pools title='Solana' mode='sol' />} />
            <Route path="/rules" element={<Rules />} />          
          </Routes>
        </BrowserRouter>
      </MetaMaskProvider>
    </SnackbarProvider>
    <Footer />
  </StrictMode>,
)
