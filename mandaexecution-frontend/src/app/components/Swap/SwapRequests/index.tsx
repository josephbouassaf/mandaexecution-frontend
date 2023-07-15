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
import { useState } from 'react';
import SwapDetails from '../SwapDetails';

const SwapRequests = () => {

    const [isOpen, setIsOpen] = useState(false); 

    return (
        <div>
            <SwapDetails isOpen={isOpen} onClose={() => setIsOpen(false)}></SwapDetails>
            <TableContainer boxShadow="xl" marginBottom={'20px'}>
                <Table variant='simple'>
                    <TableCaption>Swap Requests</TableCaption>
                    <Thead>
                        <Tr>
                            <Th textAlign='center'>Currency Pair</Th>
                            <Th textAlign='center'>Buyer</Th>
                            <Th textAlign='center'>Seller</Th>
                            <Th textAlign='center'>Status</Th>
                            <Th textAlign='center'>Details</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td textAlign='center'>ETH-BTC</Td>
                            <Td textAlign='center'>0x0827392739137293729</Td>
                            <Td textAlign='center'>0x0827392739137293729</Td>
                            <Td textAlign='center'><Button disabled variant='ghost' color='green.400'>Processed</Button></Td>
                            <Td textAlign='center'><Button onClick={() => setIsOpen(true)}>View Details</Button></Td>
                        </Tr>
                        <Tr>
                        <Td textAlign='center'>ETH-BTC</Td>
                            <Td textAlign='center'>0x0827392739137293729</Td>
                            <Td textAlign='center'>0x0827392739137293729</Td>
                            <Td textAlign='center'><Button disabled variant='ghost' color='green.400'>Processed</Button></Td>
                            <Td textAlign='center'><Button backgroundColor='#3D0ACE' color='white' id="testAnchor" onClick={() => setIsOpen(true)}>View Details</Button></Td>
                        </Tr>
                        <Tr>
                        <Td textAlign='center'>ETH-BTC</Td>
                            <Td textAlign='center'>0x0827392739137293729</Td>
                            <Td textAlign='center'>0x0827392739137293729</Td>
                            <Td textAlign='center'><Button disabled variant='ghost' color='red.400'>Cancelled</Button></Td>
                            <Td textAlign='center'><Button onClick={() => setIsOpen(true)}>View Details</Button></Td>
                        </Tr>
                    </Tbody>
                </Table>    
        </TableContainer>
    </div>
    );
}

export default SwapRequests; 