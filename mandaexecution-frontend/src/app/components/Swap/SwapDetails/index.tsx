'use client'; 
import {
    Modal,
    Button, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
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
import { combineSignatures, completeVaultRegistration, getPostRegState, getRegistrationState, hasUserSigned, isUserPreregistered, isUserRegisteredStep1, isUserRegisteredStep2, isUserRegisteredStep3, preRegisterUser, registerUser, signTransaction } from "@/app/functions/intu/intu";
import { approveVaultAsSpender, hasAllowance, proposeEmptyTransaction } from "@/app/functions/ethereum/contracts/functions";
import { FEI_TOKEN_ADDRESS, RARI_TOKEN_ADDRESS } from "@/app/functions/constants";

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
    const [isUser, setIsUser] = useState<boolean>(false);
    const [progressBarValue, setProgressBarValue] = useState(0); 

    const {wallet} = useContext(WalletContext);

    const getProgressBarValue = () => {
        console.log(swapState); 
        if(swapState === 'at-pre-registration') {
            return 10; 
        } else if(swapState === 'at-registration-step1') {
            return 20;
        } else if(swapState === 'at-registration-step2') {
            return 30; 
        } else if(swapState === 'at-registration-step3') {
           return 40; 
        } else if(swapState === 'complete-registration') {
            return 50; 
        } else if(swapState === 'registration-complete') {
           return 60;
        } else if(swapState === 'at-funding') {
            return 70;
        } else if(swapState === 'at-signing') { // sign swap transactions
            return 95;
        } else if(swapState === 'at-combining') { // sign off on the fund distribution
            return 100;     
        } else {
            return 0; 
        }
    }

    const refreshSwapState = async () => {
        if(vault) {
            const regState = await getRegistrationState(vault);
            const address = await wallet.getAddress(); 
            let temp = false; 
            
            if(vault.masterPublicAddress) { // registration is complete
                const postRegState = await getPostRegState(vault); 
                if(postRegState === 'at-funding') {
                    temp = (await hasAllowance(FEI_TOKEN_ADDRESS,vault.masterPublicAddress,address)) || (await hasAllowance(RARI_TOKEN_ADDRESS,vault.masterPublicAddress,address)); 
                } else if(postRegState === 'at-signing') {
                    temp = (await hasUserSigned(vault,vault.transactions[-1].id,address)) && (await hasUserSigned(vault,vault.transactions[-2].id,address)); 
                } // no need to check for combine state, any user can combine
                    
            } else {
                if( regState === 'at-pre-registration') {
                temp = await isUserPreregistered(vault.vaultAddress,address);
                } else if(regState == 'at-registration-step1') {
                temp = await isUserRegisteredStep1(vault.vaultAddress,address);
                } else if (regState === 'at-registration-step2') {
                    temp = await isUserRegisteredStep2(vault.vaultAddress,address);
                } else if (regState === 'at-registration-step3') {
                temp = await isUserRegisteredStep3(vault.vaultAddress,address);
                } // no need to check last registration state, any user can complete reg

                setIsUser(temp);
                setSwapState(regState);
                setProgressBarValue(getProgressBarValue())
                setIsLoading(false); 
            }
        }
    }
       
    useEffect(() => {
        refreshSwapState(); 
    },[isOpen])

    const handleActionClick = async () => {
            if(vault) {
                setIsLoading(true);
                if(swapState === 'at-pre-registration') {
                    await preRegisterUser(vault.vaultAddress, wallet);
                } else if(swapState === 'at-registration-step1') {
                    await registerUser(vault.vaultAddress, wallet,1); 
                } else if(swapState === 'at-registration-step2') {
                    await registerUser(vault.vaultAddress, wallet,2);
                } else if(swapState === 'at-registration-step3') {
                    await registerUser(vault.vaultAddress, wallet,3);
                } else if(swapState === 'complete-registration') {
                    await completeVaultRegistration(vault.vaultAddress,wallet);
                    const emptyTx_1 = await proposeEmptyTransaction(FEI_TOKEN_ADDRESS,vault.users[0].address,vault.users[1].address,'100',vault.transactions.length+1);
                    const emptyTx_2 = await proposeEmptyTransaction(FEI_TOKEN_ADDRESS,vault.users[0].address,vault.users[1].address,'100',vault.transactions.length+2);
                } else if(swapState === 'registration-complete') {
                    // to do add funding
                } else if(swapState === 'at-funding') {
                    const address = await wallet.getAddress(); 
                    if(vault.users[0].address === address && vault.masterPublicAddress)
                        await approveVaultAsSpender(FEI_TOKEN_ADDRESS,wallet,vault.masterPublicAddress); 
                    if(vault.users[1].address === address && vault.masterPublicAddress)
                        await approveVaultAsSpender(RARI_TOKEN_ADDRESS,wallet,vault.masterPublicAddress); 
                } else if(swapState === 'at-signing') { // sign swap transactions
                        await signTransaction(wallet,vault.transactions[-2].id,vault.vaultAddress); 
                        await signTransaction(wallet,vault.transactions[-1].id,vault.vaultAddress);   
                } else if(swapState === 'at-combining') { // sign off on the fund distribution
                        await combineSignatures(wallet,vault.transactions[-2].id,vault.vaultAddress); 
                        await combineSignatures(wallet,vault.transactions[-1].id,vault.vaultAddress);   
                }
                setTimeout(refreshSwapState, 1500);
            }
        }

        const getActionText = () => {
            if(swapState === 'at-pre-registration') {
                return !isUser ? 'Pre Register' : 'Counterparty Not Pre-Registered'
            } else if(swapState === 'at-registration-step1') {
                return !isUser ? 'Register Step-1' : 'Counterparty Registration Step 1 Pending'
            } else if(swapState === 'at-registration-step2') {
                return !isUser ? 'Register Step-2' : 'Counterparty Registration Step 2 Pending'
            } else if(swapState === 'at-registration-step3') {
                return !isUser ? 'Register Step -3' : 'Counterparty Registration Step 3 Pending'
            } else if(swapState === 'complete-registration') {
                return 'Complete Registration';
            } else if(swapState === 'registration-complete') {
                return 'Fund Vault'
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
                            <Button isLoading={isLoading} disabled={isUser} color={'white'} backgroundColor={!isUser ? '#3D0ACE' : 'red.400'} onClick={handleActionClick}>{getActionText()}</Button>
                        </Stack>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    ); 
}

export default SwapDetails;