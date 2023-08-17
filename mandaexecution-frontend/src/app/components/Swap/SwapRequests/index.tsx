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
            <TableContainer boxShadow="xl" marginBottom={'20px'}>
                <Button variant={'unstyled'} bgColor={'white'} mt={'5px'} mr={'5px'} float={'right'} onClick={handleRefreshVaults}><Icon color={'black'} boxSize={7} as={MdRefresh}></Icon></Button>
                <Table colorScheme={'twitter'} variant='simple'>
                    <TableCaption>Swap Requests</TableCaption>
                    <Thead>
                        <Tr>
                            <Th textAlign='center'>Index</Th>
                            <Th display={{base: 'none', md: 'inline-block'}} textAlign='center'>Currency Pair</Th>
                            <Th display={{base: 'none', md: 'inline-block'}} textAlign='center'>Buyer</Th>
                            <Th display={{base: 'none', md: 'inline-block'}} textAlign='center'>Seller</Th>
                            <Th display={{base: 'none', md: 'inline-block'}} textAlign='center'>Status</Th>
                            <Th textAlign='center'>Details</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                      {vaults.map((vault:Vault,idx:number) => {
                        return <Tr key={idx}>
                            <Td textAlign='center'>{idx}</Td>
                            <Td display={{base: 'none', md: 'block'}} textAlign='center'>FEI-RARI</Td>
                            <Td display={{base: 'none', md: 'block'}} textAlign='center'>{vault.users[0].address.substring(0,5)+'...'+vault.users[0].address.slice(-5)}</Td>
                            <Td display={{base: 'none', md: 'block'}} textAlign='center'>{vault.users[1].address.substring(0,5)+'...'+vault.users[0].address.slice(-5)}</Td>
                            <Td display={{base: 'none', md: 'inline'}} textAlign='center'><Button disabled variant='ghost' color='yellow.400'>In Progress</Button></Td>
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