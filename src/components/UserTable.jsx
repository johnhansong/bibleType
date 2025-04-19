import React from 'react'
import { Table, TableContainer, TableBody, TableHead, TableRow, TableCell } from '@mui/material'
import { useTheme } from '../context/themeContext'

const UserTable = ({data}) => {
  const { theme } = useTheme();
  const tableStyles = {color: theme.textColor, textAlign: 'center'}

  return (
    <div className='table'>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={tableStyles}>
                WPM
              </TableCell>
              <TableCell style={tableStyles}>
                Accuracy
              </TableCell>
              <TableCell style={tableStyles}>
                Date
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              data?.map((i) => (
                <TableRow>
                  <TableCell style={tableStyles}>
                    {i.wpm}
                  </TableCell>
                  <TableCell style={tableStyles}>
                    {i.accuracy}
                  </TableCell>
                  <TableCell style={tableStyles}>
                    {i.timeStamp.toDate().toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UserTable
