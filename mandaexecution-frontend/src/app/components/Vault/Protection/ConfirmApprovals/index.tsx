import { MANAGER_CONTRACT_ADDRESS } from "@/app/functions/ethereum/contants";
import { registerBackupVault } from "@/app/functions/ethereum/contracts/functions";
import { allowVaultToSpend, hasAllowance } from "@/app/functions/ethereum/contracts/helpers";
import { Asset, VaultWithKeys } from "@/app/type";
import { Button, Container, Flex, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useSigner } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { BsArrowRightCircle } from "react-icons/bs";

interface Props {
    display:string; 
    setDisplay:(displayArr:string[]) => void; 
    protectList: Asset[]; 
    vaultWithKeys: VaultWithKeys; 
}

/**
 * TODO: screen to request approval of every asset
 * @returns 
 */
const ConfirmApprovals = (props: Props) => {

    const {display, setDisplay, protectList, vaultWithKeys} = props; 

    const signer = useSigner(); 

    const [counter, setCounter] = useState(0); 

    const [isLoading, setIsLoading] = useState(false); 

    const handleRequestApproval = async () => {
        if(counter < protectList.length && signer) {
            setIsLoading(true); 
            await allowVaultToSpend(MANAGER_CONTRACT_ADDRESS, protectList[counter].address, String(protectList[counter].amount),signer); 
            // check if allowance is set properly
            const userAddress = await signer.getAddress(); 
            const isAllowed = await hasAllowance(protectList[counter].address,userAddress,MANAGER_CONTRACT_ADDRESS); 
            if(isAllowed)
                setCounter(counter+1);
            setIsLoading(false); 
        }
    }

    const handleClickNext = async () => { // hide that component, and show the next one 
        console.log(vaultWithKeys,counter,protectList);
        if(vaultWithKeys && (counter >= protectList.length) && signer) { // if all assets have been protected, register the vault
            setIsLoading(true); 
            await registerBackupVault(
                vaultWithKeys.vaultMPK,
                protectList.map(asset => asset.address),
                vaultWithKeys.keys.map(wallet => wallet.address),
                vaultWithKeys.keys[vaultWithKeys.keys.length-1].privateKey,
                signer
                );
            setIsLoading(false); 
        }
        // hide the component
        setDisplay(['none','none','block']); 
    }

    useEffect(() => {
        console.log('I go here')
        console.log(counter, protectList.length); 
    },[counter])
        
    return (
        <Container display={display}>
            <Flex flexDirection={'column'} justifyContent={'flex-start'}>
                <Text>Step 2.</Text>
                <Text marginBottom={'10px'} fontWeight={'900'}>Your Backup Vault has been created, it now needs you to grant it access to your assets</Text>
            </Flex>
            <TableContainer borderRadius={5} borderColor={'black'} borderWidth={'2px'} boxShadow="xl" marginBottom={'20px'}>
                <Table colorScheme={'blackAlpha'} variant='simple'>
                    <TableCaption>Protect List</TableCaption>
                    <Thead>
                        <Tr>
                            <Th textAlign='center'>Assets</Th>
                            <Th textAlign='center'>Amount</Th>
                            <Th textAlign='center'></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {protectList && protectList.length > 0 && counter < protectList.length && <Tr key={protectList[counter].address}>
                            <Td textAlign={'center'}>{protectList[counter].symbol}</Td>
                            <Td textAlign={'center'}> {protectList[counter].amount}</Td>     
                            <Td textAlign={'center'}><Button isLoading={isLoading} color={'green.400'} onClick={handleRequestApproval}>Approve</Button></Td>          
                        </Tr>
                        }
                    </Tbody>
                </Table>    
        </TableContainer>
        <Flex flexDirection={'row'} justifyContent={'center'} marginBottom={'5px'}>
            <Button isLoading={isLoading && protectList && counter >= protectList.length} onClick={handleClickNext} isDisabled={counter < protectList.length} rightIcon={<BsArrowRightCircle fontWeight={'bold'} size={'25'}/>}>Register Vault</Button>
        </Flex>
        </Container>
    ); 
}


export default ConfirmApprovals