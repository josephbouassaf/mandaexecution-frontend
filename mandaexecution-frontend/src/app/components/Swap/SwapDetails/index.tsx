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
import { useContext, useEffect, useState } from "react";
import { Vault } from "intu-sdk/lib/src/models/models";
import { WalletContext } from "@/app/context/wallet";
import { combineSignatures, completeVaultRegistration, getPostRegState, getSwapState, getUserStatus, hasUserSigned, isUserPreregistered, isUserRegisteredStep1, isUserRegisteredStep2, isUserRegisteredStep3, preRegisterUser, registerUser, signTransaction } from "@/app/functions/intu/intu";
import { approveVaultAsSpender, hasAllowance, proposeEmptyTransaction } from "@/app/functions/ethereum/contracts/functions";
import { FEI_TOKEN_ADDRESS, RARI_TOKEN_ADDRESS, RegistrationState } from "@/app/functions/constants";
import { getActionText, getNextAction, getProgressBarValue } from "@/app/functions/utils/utils";

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

    const {wallet} = useContext(WalletContext);

    const refreshSwapState = async () => {
        if(vault) {
            // fetch states
            const address = await wallet.getAddress();  
            const swapState = await getSwapState(vault);
            const userStatus = await getUserStatus(swapState,vault.vaultAddress,address);
            // refresh states
            setUserTurn(userStatus);
            setSwapState(swapState);
            setProgressBarValue(getProgressBarValue(swapState)); 
            setIsLoading(false); 
        }
    }
       
    useEffect(() => {
        refreshSwapState(); 
    },[isOpen])

    const handleActionClick = async () => {
            if(vault && swapState) {
                setIsLoading(true);
                const action = getNextAction(swapState, vault, wallet); 
                if(action)
                    action()
                    .then(() => setTimeout(refreshSwapState, 1500)); 
                
            }
        }

    return (
        <>
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
                            <Text align='center'>100 FEI {<Icon boxSize={4} as={AiOutlineSwap}/>} 25 RARI</Text>
                            <Divider w='50%' alignSelf='center' border='2px solid #FOBD3F'></Divider>
                            <Text fontWeight='bold' align='center'> Swap Status </Text>
                            <Text align='center'><Button color={'green.400'} variant='ghost'>{swapState}</Button></Text>
                            <Divider w='50%' alignSelf='center' border='2px solid #FOBD3F'></Divider>
                            <Text fontWeight='bold' align='center'> Actions </Text>
                            <Button isLoading={isLoading} disabled={userTurn} color={'white'} backgroundColor={!userTurn ? '#3D0ACE' : 'red.400'} onClick={handleActionClick}>{getActionText(swapState,userTurn)}</Button>
                        </Stack>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    ); 
}

export default SwapDetails;