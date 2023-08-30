'use client'; 
import {
    Modal,
    Button, 
    ModalHeader, 
    ModalBody, 
    ModalOverlay,
    ModalContent,
    Text,
    Flex,
    Divider,
    Stack, 
    Icon,
    Progress
} from "@chakra-ui/react"

import {RiSwapFill} from 'react-icons/ri'
import {AiOutlineSwap} from 'react-icons/ai'
import {useEffect, useState } from "react";
import { Vault } from "intu-sdk/lib/src/models/models";
import {getSwapState, getUserStatus } from "@/app/functions/intu/intu";
import { 
    deconstructVaultName, 
    getActionText, 
    getNextAction, 
    getProgressBarValue } from "@/app/functions/utils/utils";
import ErrorModal from "../../common/ErrorModal";
import { ModalProps } from '../../common/ErrorModal/type';
import { useSigner } from "@thirdweb-dev/react";
import { getTokenSymbol } from "@/app/functions/ethereum/contracts/functions";

interface SwapDetailsProps {
    isOpen: boolean,
    onClose: () => void; 
    vault:Vault|null
}

const SwapDetails = ({
    isOpen,
    onClose,
    vault
}: SwapDetailsProps) => {

    const [isLoading, setIsLoading] = useState(false); 
    const [swapState, setSwapState] = useState<string|undefined>(undefined); 
    const [userTurn, setUserTurn] = useState<boolean|undefined>(false);
    const [progressBarValue, setProgressBarValue] = useState(0); 
    const [errorMessage, setErrorMessage] = useState<string|null>(null); 

    const details = deconstructVaultName(vault?.name); 

    const signer = useSigner(); 

    const errorProps:ModalProps = {errorMessage: errorMessage, onClose: () => setErrorMessage(null), isOpen: true}


    const refreshSwapState = async () => {
        if(vault && signer) {
            // fetch states
            const address = await signer.getAddress();  
            const swapState = await getSwapState(vault);
            const turn = await getUserStatus(swapState,vault,address);
            // refresh states
            setUserTurn(turn);
            setSwapState(swapState);
            setProgressBarValue(getProgressBarValue(swapState)); 
            setIsLoading(false); 
        }
    }
       
    useEffect(() => {
        console.log(vault); 
        refreshSwapState(); 
    },[isOpen])

    const handleActionClick = async () => {
            if(vault && swapState && signer) {
                setIsLoading(true);
                const action = getNextAction(swapState, vault, signer); 
                if(action) {
                    action()
                    .then(() => refreshSwapState())
                    .catch(err => {
                        setErrorMessage(err.message);
                        refreshSwapState();
                    }); 
                }
            }
        }

    return (
        <>
        {errorMessage && <ErrorModal errorMessage={errorProps.errorMessage} onClose={errorProps.onClose} isOpen={errorProps.isOpen}></ErrorModal>}  
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Flex w='100%' justify='space-between'>
                    <Text fontWeight='bold'>Swap Summary</Text>
                    <Button onClick={onClose} variant='close'>Close</Button>
                    </Flex>
                    <Divider border='2px solid #FOBD3F'></Divider>
                    <Progress value={progressBarValue} size='xs' colorScheme='green' />
                </ModalHeader>
                    <ModalBody>
                    <Flex w='100%' direction='column'>
                        <Stack spacing='20px'>
                            <Text align='center'>From: {vault && vault.users[0].address}</Text>
                            <Icon alignSelf='center' boxSize={7} as={RiSwapFill}></Icon>
                            <Text align='center'>To: {vault && vault.users[1].address}</Text>
                            <Divider w='50%' alignSelf='center' border='2px solid #FOBD3F'></Divider>
                            <Text fontWeight='bold' align='center'> Swap Details </Text>
                            <Text align='center'>{details ? details[0] : 'NA'} {details && getTokenSymbol(details[1])} {<Icon boxSize={4} as={AiOutlineSwap}/>} {details ? details[2] : 'NA'} {details && getTokenSymbol(details[3])}</Text>
                            <Divider w='50%' alignSelf='center' border='2px solid #FOBD3F'></Divider>
                            <Text fontWeight='bold' align='center'> Swap Status </Text>
                            <Text align='center'><Button disabled color={'green.400'} variant='unstyled'>{swapState}</Button></Text>
                            <Divider w='50%' alignSelf='center' border='2px solid #FOBD3F'></Divider>
                            <Text fontWeight='bold' align='center'> Actions </Text>
                            <Button borderRadius={'full'} isLoading={isLoading} disabled={userTurn} color={'white'} backgroundColor={!userTurn ? '#3D0ACE' : 'grey'} onClick={handleActionClick}>{getActionText(swapState,userTurn)}</Button>
                        </Stack>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    ); 
}

export default SwapDetails;