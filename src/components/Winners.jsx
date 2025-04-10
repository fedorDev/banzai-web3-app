import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@mui/material'
import { shortAddr, rewards } from '/src/helpers/utils'
import { styled } from '@mui/material/styles'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}))

const Winners = ({ data, mode }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (!data || data.length < 1) return <></>

  return (
    <Box>
      <Typography>Last winners (summary):</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <TableContainer component={Paper} sx={{ width: isMobile ? '94vw' : '600px' }}>
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell align="right">Amount {rewards[mode]}</TableCell>
                <TableCell align='right'>Pool</TableCell>
                {!isMobile && (
                  <TableCell align="right">Rounds</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.reverse().map((row, ind) => (
                <StyledTableRow
                  key={`winner_${ind}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {shortAddr(row.address)}
                    {row.you ? (<b>&nbsp;&nbsp;{'(you)'}</b>) : ''}
                  </TableCell>
                  <TableCell align="right">{row.win} </TableCell>
                  <TableCell align='right'>{row.pool}</TableCell>
                  {!isMobile && (
                    <TableCell align='right'>{row.rounds}</TableCell>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default Winners
