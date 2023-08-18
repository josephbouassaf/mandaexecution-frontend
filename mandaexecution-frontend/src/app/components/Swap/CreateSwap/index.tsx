'use client'
import { Card, 
    CardHeader,  
    CardBody, 
    CardFooter,
    Button,
    Text,
    Stack,
    Input,
    Flex,
    InputLeftElement,
    InputGroup,
    Icon,
} from '@chakra-ui/react'

import { useContext, useState } from 'react';
import { WalletContext } from '@/app/context/wallet';
import { instantiateVault, preRegisterUser } from '@/app/functions/intu/intu';
import { ModalProps } from '../../common/ErrorModal/type';
import ErrorModal from '../../common/ErrorModal';
import { VaultsContext } from '@/app/context/vaults';
import {BiCandles} from 'react-icons/bi';
import {PiCoinVerticalLight} from "react-icons/pi";
import { RiSwapFill } from 'react-icons/ri';
import { AiOutlineSwap } from 'react-icons/ai';
import {LiaHandshakeSolid} from 'react-icons/lia';
import { isAddress } from 'ethers/lib/utils';

const CreateSwap = () => {

    const [isLoading, setIsLoading] = useState(false); 
    const [counterparty,setCounterparty] = useState<string|null>(null);
    const [addressInvalid, setAddressInvalid] = useState<boolean>(false); 
    const [errorMessage, setErrorMessage] = useState<string|null>(null);  
    const {wallet} = useContext(WalletContext); 
    const {fetchVaults, vaults} = useContext(VaultsContext); 

    const errorProps:ModalProps = {errorMessage: errorMessage, onClose: () => setErrorMessage(null), isOpen: true}

    const handleCounterpartyChange = (e:any) => {
        const address = e.target.value; 
        if(isAddress(address)) {
            setCounterparty(e.target.value);
            setAddressInvalid(false); 
        } else {
            setAddressInvalid(true); 
        }
    }

    const handleCreateRequest = async () => {
        setIsLoading(true);

        const address = await wallet.getAddress(); 
        const participants = [address, counterparty]; 
        // api call to instantiate the vault
        await instantiateVault(wallet,participants)
        .then(() => {
            setIsLoading(false);
        })
        .catch((err) => {
            setIsLoading(false);
            setErrorMessage(err.message);  
        })
    }

    return (
        <div>
            {errorMessage && <ErrorModal errorMessage={errorProps.errorMessage} onClose={errorProps.onClose} isOpen={errorProps.isOpen}></ErrorModal>}  
            <Card backgroundColor={"white"} width="100%" align='center'>
                <CardHeader>
                    <Text fontWeight={'bold'} fontSize={'36px'} textAlign={'center'}>Create Your Own Swaps With Manda.</Text>
                </CardHeader>
                <CardBody>
                <Stack spacing={4}>
                    <Flex flexDirection={'row'}justifyContent={'space-between'} gap={5}>
                        <InputGroup>
                            <Input backgroundColor={'white'} borderWidth='2px' placeholder="I have 0x..." >
                            </Input>
                            <InputLeftElement>
                                <Icon as={PiCoinVerticalLight}></Icon>
                            </InputLeftElement>
                        </InputGroup>
                        <InputGroup>
                        <Input backgroundColor={'white'} borderWidth='2px' placeholder="Amount" >
                            </Input>
                            <InputLeftElement>
                                <Icon as={BiCandles}></Icon>
                            </InputLeftElement>
                        </InputGroup>
                    </Flex>
                    <Icon alignSelf='center' color={'white'} boxSize={7} as={RiSwapFill}></Icon>
                    <Flex flexDirection={'row'}justifyContent={'space-between'} gap={5}>
                        <InputGroup>
                            <Input backgroundColor={'white'} borderWidth='2px' placeholder="I want 0x..." >
                            </Input>
                            <InputLeftElement>
                                <Icon as={PiCoinVerticalLight}></Icon>
                            </InputLeftElement>
                        </InputGroup>
                        <InputGroup>
                        <Input backgroundColor={'white'} borderWidth='2px' placeholder="Amount" >
                            </Input>
                            <InputLeftElement>
                                <Icon as={BiCandles}></Icon>
                            </InputLeftElement>
                        </InputGroup>
                    </Flex>
                    <Icon alignSelf='center' color={'white'} boxSize={7} as={AiOutlineSwap}></Icon>
                    <InputGroup>
                        <Input isInvalid={addressInvalid} onChange={handleCounterpartyChange} backgroundColor={'white'} borderWidth='2px' placeholder="I want to trade with 0x.." ></Input>
                        <InputLeftElement>
                            <Icon as={LiaHandshakeSolid}></Icon>
                        </InputLeftElement>
                    </InputGroup>
                </Stack>
                </CardBody>
                <CardFooter>
                    <Button borderRadius={'full'} backgroundColor='black' color={"white"} onClick={handleCreateRequest} isLoading={isLoading} loadingText="Submitting Request">Create Swap Request</Button>
                </CardFooter>
            </Card>
        </div>
    ); 
}
export default CreateSwap; 