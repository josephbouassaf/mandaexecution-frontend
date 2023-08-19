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
    Icon,
  } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react';
import SwapDetails from '../SwapDetails';
import {VaultsContext} from '../../../context/vaults'
import { Vault } from 'intu-sdk/lib/src/models/models';
import { WalletContext } from '@/app/context/wallet';
import {MdRefresh} from 'react-icons/md'

const SwapRequests = () => {

    const [isOpen, setIsOpen] = useState(false); 
    const {vaults, fetchVaults} = useContext(VaultsContext); 
    const {wallet} = useContext(WalletContext); 
    const [currVault, setCurrVault] = useState<Vault|null>(null); 

    const handleViewDetails = (vault:Vault) => {
        setCurrVault(vault); 
        setIsOpen(true);
    }

    const handleRefreshVaults = async () => {
        await fetchVaults(); 
    }

    useEffect(() => {
        console.log(vaults); 
    },[vaults, wallet]); 

    return (
        <div>
            <SwapDetails isOpen={isOpen} onClose={() => setIsOpen(false)} vault={currVault}></SwapDetails>
            <TableContainer borderRadius={5} display={{base: 'none', md:'block'}} boxShadow="xl" marginBottom={'20px'}>
                <Button bgColor={'white'} mt={'5px'} mr={'5px'} float={'right'} onClick={handleRefreshVaults}><Icon color={'black'} boxSize={7} as={MdRefresh}></Icon></Button>
                <Table colorScheme={'blackAlpha'} variant='simple'>
                    <TableCaption>Swap Requests</TableCaption>
                    <Thead>
                        <Tr>
                            <Th textAlign='center'>Index</Th>
                            <Th textAlign='center'>Buyer</Th>
                            <Th textAlign='center'>Seller</Th>
                            <Th textAlign='center'>Status</Th>
                            <Th textAlign='center'>Details</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                      {vaults.map((vault:Vault,idx:number) => {
                        return <Tr key={idx}>
                            <Td textAlign='center'>{idx}</Td>
                            <Td textAlign='center'>{vault.users[0].address.substring(0,5)+'...'+vault.users[0].address.slice(-5)}</Td>
                            <Td textAlign='center'>{vault.users[1].address.substring(0,5)+'...'+vault.users[0].address.slice(-5)}</Td>
                            <Td textAlign='center'><Button disabled variant={"unstyled"} color='yellow.400'>In Progress</Button></Td>
                            <Td textAlign='center'><Button onClick={() => handleViewDetails(vault)}>View Details</Button></Td>
                        </Tr>
                        })}  
                    </Tbody>
                </Table>    
        </TableContainer>
    </div>
    );
}

export default SwapRequests; 