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
import { useContext, useEffect, useState } from 'react';
import SwapDetails from '../SwapDetails';
import {VaultsContext} from '../../../context/vaults'
import { Vault } from 'intu-sdk/lib/src/models/models';
import { WalletContext } from '@/app/context/wallet';

const SwapRequests = () => {

    const [isOpen, setIsOpen] = useState(false); 
    const {vaults} = useContext(VaultsContext); 
    const {wallet} = useContext(WalletContext); 
    const [currVault, setCurrVault] = useState<Vault|null>(null); 

    const handleViewDetails = (vault:Vault) => {
        setCurrVault(vault); 
        setIsOpen(true);
    }

    useEffect(() => {
        console.log(vaults); 
    },[vaults, wallet]); 

    return (
        <div>
            <SwapDetails isOpen={isOpen} onClose={() => setIsOpen(false)} vault={currVault}></SwapDetails>
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
                      {vaults.map((vault:Vault,idx:number) => {
                        return <Tr key={idx}>
                            <Td textAlign='center'>FEI-RARI</Td>
                            <Td textAlign='center'>{vault.users[0].address.substring(0,10)+'...'}</Td>
                            <Td textAlign='center'>{vault.users[1].address.substring(0,10)+'...'}</Td>
                            <Td textAlign='center'><Button disabled variant='ghost' color='yellow.400'>In Progress</Button></Td>
                            <Td textAlign='center'><Button onClick={() => handleViewDetails(vault)}>View Details</Button>
                            </Td>
                        </Tr>
                        })}  
                    </Tbody>
                </Table>    
        </TableContainer>
    </div>
    );
}

export default SwapRequests; 