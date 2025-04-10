import { useState } from 'react'
import {
  Box,
  Grid,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from '@mui/material'

const GameRules = () => {
  const [count, setCount] = useState(0)

  const steps = [
    'Pool created',
    'Awaiting 10 players',
    'Detect winner',
  ]

  return (
    <Box className='rules-page'>
      <Typography variant='h4'>Game rules</Typography>

      <Stepper activeStep={1} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ width: '80vw' }}>
        <img src='/icons/pool_scheme.png' style={{ width: '80vw' }}/>

        <Typography variant='body2'>
          Players make stakes of same amount into pool. When pool filled with 10 stakes, smart contract automatically detects
          random winner<br/> and sends him 90% of pool. 10% is going as reward for developers. Round finished and pool is 
          getting cleared.
        </Typography>
        <br/>
        <Typography variant='body2'>
          Each stake has 10% chance to win. User can make <b>up to 5 stakes</b> from same wallet address in one pool.<br/>So winning
          possibility can be up to 50% for one wallet address.
        </Typography>
        <br/>
        <Typography variant='body2'>
          If you have sent stake but missed last spot in pool, it's not a problem. Your stake will be in pool on next round.
        </Typography>
        <br/>
        <Typography variant='h3'>
          Source code of detectWinner method:
        </Typography>
        <img src='/icons/code-random.png' style={{ width: '70vw' }} />
        <br/>
      </Box>
    </Box>
  )
}

export default GameRules