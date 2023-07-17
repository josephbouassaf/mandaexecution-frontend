import { Card, 
    CardHeader,  
    CardBody, 
    CardFooter,
    Button,
    Text,
    Stack,
    Input,
} from '@chakra-ui/react'

import {TriangleDownIcon} from "@chakra-ui/icons"
import { useContext, useState } from 'react';
import { WalletContext } from '@/app/context/wallet';
import { getUserVaults, instantiateVault, preRegisterUser } from '@/app/functions/intu/intu';
import { ModalProps } from '../../common/ErrorModal/type';
import ErrorModal from '../../common/ErrorModal';
import { VaultsContext } from '@/app/context/vaults';

const CreateSwap = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [creationComplete, setCreationComplete] = useState(false); 
    const [counterparty,setCounterparty] = useState<string|null>(null)
    const [errorMessage, setErrorMessage] = useState<string>('');  
    const {wallet} = useContext(WalletContext); 
    const {fetchVaults} = useContext(VaultsContext); 

    const errorProps:ModalProps = {errorMessage: errorMessage, onClose: () => setErrorMessage(''), isOpen: true}

    const handleCounterpartyChange = (e:any) => {
        setCounterparty(e.target.value); 
    }

    
    const handleArrowClick = () => {
        // redirect to swap requests table
        setCreationComplete(false);
        // set the redirect state to true so that the newly added swap is highlighted
        
    }

    const handleCreateRequest = async () => {
        setIsLoading(true);

        const address = await wallet.getAddress(); 
        const participants = [address, counterparty]; 
        // api call 
        await instantiateVault(wallet,participants)
        .catch((err) => {
            setIsLoading(false);
            setErrorMessage(err.message); 
        })
        
        const func = async () => {
            const vaults = (await getUserVaults(address));
     
            await preRegisterUser(vaults[vaults.length-1].vaultAddress, wallet)
            .then(() => {
                setIsLoading(false);
                setCreationComplete(true); 
            })
            .catch((err) => {
                setIsLoading(false);
                setErrorMessage(err.message); 
            })
        }

        setTimeout(func,1000); 
        // trigger vaults refetch
        await fetchVaults(); 
    }

    return (
        <div>
            {errorMessage && <ErrorModal errorMessage={errorProps.errorMessage} onClose={errorProps.onClose} isOpen={errorProps.isOpen}></ErrorModal>}  
            <Card backgroundColor='#010D50' width="100%" align='center'>
                <CardHeader>
                    <Text fontWeight={'bold'} color={'white'} fontSize={'36px'}>Create Your Own Swaps With Manda</Text>
                </CardHeader>
                <CardBody>
                <Stack spacing={4}>
                        <Input backgroundColor={'white'} borderWidth='2px' placeholder="I have 0x..." ></Input>
                        <Input backgroundColor={'white'} borderWidth='2px' placeholder="I want 0x..." ></Input>
                        <Input onChange={handleCounterpartyChange} backgroundColor={'white'} borderWidth='2px' placeholder="I want to trade with 0x.." ></Input>
                </Stack>
                </CardBody>
                <CardFooter>
                    {!creationComplete ? <Button backgroundColor='#3D0ACE' onClick={handleCreateRequest} isLoading={isLoading} loadingText="Submitting Request" colorScheme='blue'>Create Swap Request</Button>
                    : <a href='#testAnchor'><Button onClick={handleArrowClick}><TriangleDownIcon></TriangleDownIcon></Button></a>}
                </CardFooter>
            </Card>
        </div>
    ); 
}
export default CreateSwap; 