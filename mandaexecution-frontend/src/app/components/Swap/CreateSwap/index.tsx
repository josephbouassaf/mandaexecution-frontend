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

import {useEffect, useState } from 'react';
import { instantiateVault } from '@/app/functions/intu/intu';
import { ModalProps } from '../../common/ErrorModal/type';
import ErrorModal from '../../common/ErrorModal';
import {BiCandles} from 'react-icons/bi';
import {PiCoinVerticalLight} from "react-icons/pi";
import { RiSwapFill } from 'react-icons/ri';
import { AiOutlineSwap } from 'react-icons/ai';
import {LiaHandshakeSolid} from 'react-icons/lia';
import { isAddress } from 'ethers/lib/utils';
import { useSigner } from '@thirdweb-dev/react';
import { isStringNumeric } from '@/app/functions/utils/utils';

const CreateSwap = () => {

    const [isLoading, setIsLoading] = useState(false); 
    // input states
    const [counterparty,setCounterparty] = useState<string>('');
    const [numeraire, setNumeraire] = useState<string[]>(['','']); // save it in the name of the vault
    const [amounts, setAmounts] = useState<string[]>(['','']); // save it in the name of the vault
    // valid input states
    const [addressInvalid, setAddressInvalid] = useState<boolean>(false); 
    const [numeraireInvalid, setNumeraireInvalid] = useState<boolean>(false);
    const [cpartyNumeraireInvalid, setCpartyNumeraireInvalid] = useState<boolean>(false); 
    const [amountInvalid, setAmountInvalid] = useState<boolean>(false); 
    const [cpartyAmountInvalid, setCpartyAmountInvalid] = useState<boolean>(false);
    // button state
    const [disableCreateButton, setDisableCreateButton] = useState<boolean>(true); 
    // error state
    const [errorMessage, setErrorMessage] = useState<string|null>(null);  
    // signer
    const signer = useSigner(); 

    const errorProps:ModalProps = {errorMessage: errorMessage, onClose: () => setErrorMessage(null), isOpen: true}

    const isAnyInputEmpty = () => {
        return counterparty.length === 0 || numeraire[0].length === 0 || numeraire[1].length === 0 || amounts[0].length === 0 || amounts[1].length === 0; 
    }

    const areAllInputsValid = () => {
        return !addressInvalid && !amountInvalid && !cpartyAmountInvalid && !numeraireInvalid && !cpartyNumeraireInvalid; 
    }
    const updateCreateFormState = () => {
        if(isAnyInputEmpty()) { // check for initial states
            setDisableCreateButton(true); 
        } else if(areAllInputsValid()) { // check if all the inputs are valid
            setDisableCreateButton(false); 
        } else { 
            setDisableCreateButton(true); 
        }
    }
    
    const handleCounterpartyChange = (e:any) => {
        const address = e.target.value; 
        if(isAddress(address)) {
            setCounterparty(e.target.value);
            setAddressInvalid(false); 
        } else {
            setAddressInvalid(true); 
        }
    }

    const handleAmountChange = (e:any) => {
        const amount:string = e.target.value; 
        const placeholder = e.target.placeholder; // to identify the input button
        if(isStringNumeric(amount)) {
            const newArray = amounts; 
            if(Number(placeholder) === 100) {
                newArray[0] = amount;
                setAmountInvalid(false); 
            } else {
                newArray[1] = amount;
                setCpartyAmountInvalid(false);
            }
            setAmounts(newArray); 
        } else {
            Number(placeholder) === 100 ? setAmountInvalid(true) : setCpartyAmountInvalid(true);
        }
    }

    const handleNumeraireChange = (e:any) => {
        const num = e.target.value;
        const placeholder:string = e.target.placeholder; 
        if(placeholder.includes("your")) {
            if(isAddress(num)) {
                setNumeraireInvalid(false);
                const newArray = numeraire; 
                newArray[0] = num; 
                setNumeraire(newArray);  
            } else {
                setNumeraireInvalid(true); 
            }
        } else {
            if(isAddress(num)) {
                setCpartyNumeraireInvalid(false);
                const newArray = numeraire; 
                newArray[1] = num; 
                setNumeraire(newArray);  
            } else {
                setCpartyNumeraireInvalid(true); 
            }
        }
    }

    const handleCreateRequest = async () => {
        setIsLoading(true);
        if(signer) {
            const address = await signer.getAddress(); 
            const participants = [address, counterparty]; 
            const vaultName = `${amounts[0]}-${numeraire[0]}//${amounts[1]}-${numeraire[1]}`; // persist the swap details in the vault name
            // api call to instantiate the vault
            await instantiateVault(signer,participants,vaultName)
            .then(() => {
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                setErrorMessage(err.message);  
            })
        } 
    }

    useEffect(() => {
        updateCreateFormState();
    },[addressInvalid, amountInvalid, cpartyAmountInvalid, numeraireInvalid, cpartyNumeraireInvalid])

    return (
        <div>
            {errorMessage && <ErrorModal errorMessage={errorProps.errorMessage} onClose={errorProps.onClose} isOpen={errorProps.isOpen}></ErrorModal>}  
            <Card backgroundColor={"white"} width="100%" align='center'>
                <CardHeader>
                    <Text fontSize={'36px'} textAlign={'center'}>Create Your Own Swaps With <span style={{fontWeight:'999'}}>Manda.</span></Text>
                </CardHeader>
                <CardBody>
                <Stack spacing={4}>
                    <Flex flexDirection={'row'}justifyContent={'space-between'} gap={5}>
                        <InputGroup>
                            <Input isInvalid={numeraireInvalid} onChange={handleNumeraireChange} backgroundColor={'white'} borderWidth='2px' placeholder="Import your token address..." >
                            </Input>
                            <InputLeftElement>
                                <Icon as={PiCoinVerticalLight}></Icon>
                            </InputLeftElement>
                        </InputGroup>
                        <InputGroup>
                        <Input isInvalid={amountInvalid} onChange={handleAmountChange} backgroundColor={'white'} borderWidth='2px' placeholder="100" >
                            </Input>
                            <InputLeftElement>
                                <Icon as={BiCandles}></Icon>
                            </InputLeftElement>
                        </InputGroup>
                    </Flex>
                    <Icon alignSelf='center' color={'white'} boxSize={7} as={RiSwapFill}></Icon>
                    <Flex flexDirection={'row'}justifyContent={'space-between'} gap={5}>
                        <InputGroup>
                            <Input isInvalid={cpartyNumeraireInvalid} onChange={handleNumeraireChange} backgroundColor={'white'} borderWidth='2px' placeholder="Import the address of the token you want" >
                            </Input>
                            <InputLeftElement>
                                <Icon as={PiCoinVerticalLight}></Icon>
                            </InputLeftElement>
                        </InputGroup>
                        <InputGroup>
                        <Input isInvalid={cpartyAmountInvalid} onChange={handleAmountChange} backgroundColor={'white'} borderWidth='2px' placeholder="1000" >
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
                    <Button isDisabled={disableCreateButton} borderRadius={'full'} backgroundColor='black' color={"white"} onClick={handleCreateRequest} isLoading={isLoading} loadingText="Submitting Request">Create Swap Request</Button>
                </CardFooter>
            </Card>
        </div>
    ); 
}
export default CreateSwap; 