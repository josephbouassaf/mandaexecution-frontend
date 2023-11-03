import {Button, Container, Flex, Spinner, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import {IoIosAddCircleOutline, IoIosRemoveCircleOutline} from 'react-icons/io';
import {BsArrowRightCircle} from 'react-icons/bs'
import NumberSlider from "./NumberSlider";
import { Asset, VaultWithKeys } from "@/app/type";
import { createVaultScript } from "@/app/functions/intu/scripts";
import { useEffect, useState } from "react";
import { useSigner } from "@thirdweb-dev/react";

interface Props {
    display:string; 
    setDisplay:(displayArr:string[]) => void; 
    protectList: Asset[]; 
    setProtectList: (lst:Asset[]) => void; 
    setVault: (vault:VaultWithKeys) => void; 
}

const ProtectList = (props: Props) => {

    const {display, setDisplay, protectList, setProtectList, setVault} = props;
    // placeholder for the complete list of assets
    const [assets, setAssets] = useState(protectList); 

    const [isLoading, setIsLoading] = useState(false); 

    const signer = useSigner(); 
    
    const handleAddProtectList = (address:string, amount:string) => {
        const temp = protectList.map(el => el);
        const idx = assets.findIndex(ass => ass.address === address); 
        const asset = assets[idx]; 
        asset.amount = amount; 
        temp.push(asset);  
        setProtectList(temp); 
    }

    const handleRemoveProtectList = (address:string) => {
        const temp = protectList.filter(el => el.address !== address);
        setProtectList(temp); 
    }


    const handleClickNext = async () => { // hide that component, and show the next one
        if(signer) {
            // create the vault
            setIsLoading(true); 
            const vaultWithKeys:VaultWithKeys = await createVaultScript(signer); 
            console.log(vaultWithKeys); 
            // save it
            setVault(vaultWithKeys); 
            // hide the component
            setIsLoading(false); 
            setDisplay(['none','block','none']); 
        }
    }

    useEffect(() => {
        if(assets.length === 0) {// should only populate this once after the wallet is scanned
            setAssets(protectList.map(el=>el)); 
        }
    }, [protectList, isLoading]); 

    return (
        <Container display={display}>
            <Flex flexDirection={'column'} justifyContent={'flex-start'}>
                <Text>Step 1.</Text>
                <Text marginBottom={'10px'} fontWeight={'900'}>Select the assets you want to protect.</Text>
            </Flex>
            {!isLoading ? <div>
                <TableContainer borderRadius={5} borderColor={'black'} borderWidth={'2px'} boxShadow="xl" marginBottom={'20px'}>
                <Table colorScheme={'blackAlpha'} variant='simple'>
                    <TableCaption>Wallet Scan Results</TableCaption>
                    <Thead>
                        <Tr>
                            <Th textAlign='center'>Assets</Th>
                            <Th textAlign='center'>Amount</Th>
                            <Th textAlign='center'></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {assets && protectList && assets.map((ass) => {
                            return  <Tr key={ass.address}>
                            <Td textAlign={'center'}>{ass.symbol}</Td>
                            <Td textAlign={'center'}><NumberSlider maxValue={protectList.find(el => el.address === ass.address) ? protectList.find(el => el.address === ass.address)!.amount : ass.amount}/></Td>     
                            <Td textAlign={'center'}>
                                <Button variant={'unstyled'} display={protectList.find(el => el.address === ass.address) ? 'none' : 'block'} onClick={() => handleAddProtectList(ass.address,ass.amount)}>
                                    <IoIosAddCircleOutline color={'green'} />
                                </Button>
                                <Button variant={'unstyled'} display={protectList.find(el => el.address === ass.address) ? 'block' : 'none'} onClick={() => handleRemoveProtectList(ass.address)}>
                                    <IoIosRemoveCircleOutline color={'red'}/>
                                </Button>
                            </Td>          
                        </Tr>
                        })}
                    </Tbody>
                </Table>    
            </TableContainer>
        <Flex flexDirection={'row'} justifyContent={'center'} marginBottom={'5px'}>
        <Button rightIcon={<BsArrowRightCircle fontWeight={'bold'} size={'25'}/>} onClick={handleClickNext} variant={'unstyled'}>Create Vault</Button>
    </Flex></div>: <Flex justifyContent={'center'}><Spinner speed={'1s'} size='xl' colorScheme='telegram' thickness={'5px'}></Spinner></Flex>}
        </Container>
    ); 
}

export default ProtectList; 
