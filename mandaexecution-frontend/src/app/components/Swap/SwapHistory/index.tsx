 'use client'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
  } from '@chakra-ui/react'

const SwapHistory = () => {
    return (
        <TableContainer boxShadow="sm">
            <Table variant='simple'>
                <TableCaption>Swap History</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Currency Pair</Th>
                        <Th>Buyer</Th>
                        <Th>Seller</Th>
                        <Th>Status</Th>
                        <Th>Details</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>ETH-BTC</Td>
                        <Td>0x0827392739137293729</Td>
                        <Td>0x0827392739137293729</Td>
                        <Td>Done</Td>
                        <Td><Button>View Details</Button></Td>
                    </Tr>
                    <Tr>
                        <Td>ETH-BTC</Td>
                        <Td>0x0827392739137293729</Td>
                        <Td>0x0827392739137293729</Td>
                        <Td>Done</Td>
                        <Td><Button>View Details</Button></Td>
                    </Tr>
                    <Tr>
                        <Td>ETH-BTC</Td>
                        <Td>0x0827392739137293729</Td>
                        <Td>0x0827392739137293729</Td>
                        <Td>Done</Td>
                        <Td><Button>View Details</Button></Td>
                    </Tr>
                </Tbody>
            </Table>    
    </TableContainer>
    ); 
}

export default SwapHistory; 