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
    Icon
} from "@chakra-ui/react"

import {RiSwapFill} from 'react-icons/ri'
import {AiOutlineSwap} from 'react-icons/ai'
import { useEffect, useState } from "react";

import LoadingIndicator from "../../common/LoadingModal";

interface SwapDetailsProps {
    isOpen: boolean,
    onClose: () => void; 
}

const SwapDetails = ({
    isOpen,
    onClose
}: SwapDetailsProps) => {

    const initialState = 'default'; 
    const [swapState, setSwapState] = useState(initialState);
    const [fundingState, setFundingState] = useState('Not Funded');
    const [isLoading, setIsLoading] = useState(true); 
    const [isTransferComplete, setIsTransferComplete] = useState(false); 
       
    const handleAcceptSwapRequest = async () => {

    }

    const handleSendAssets = async () => {
        
    }

    const handleConfirmSwap = async () => {

    }

    const handleRageQuit = async () => {

    }

    useEffect(() => {
        // get the funding state
        // get the current user
        // get the swap state + feed it the current user
    },[])

    const displayActions = (swapState: string) => {
        switch(swapState) { // add conditional rendering based on user that is logged in and what they have alreay done 
            case 'proposed':
                return <Button onClick={handleAcceptSwapRequest}> Accept Swap Request </Button> 
            case 'accepted': // if partially funded && the logged in user has funded then hide else show
                return <Button onClick={handleSendAssets}>Send Asset(s) to Escrow</Button>    
            case 'funded': // if currently logged in user has confirmed then hide else show
                return <div><Button onClick={handleConfirmSwap}>Confirm Swap</Button><Button>Rage Quit</Button></div>
            default:
                return
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
                </ModalHeader>
                    <ModalBody>
                        {!isTransferComplete? 
                            <LoadingIndicator 
                            isLoading={isLoading} 
                            loadingHeading="Accepting Swap Proposal" 
                            completeHeading="Swap Proposal Accepted" 
                            completeSubheading="done" 
                            buttonText="Close" 
                            action={() => setIsTransferComplete(true)}/>
                            :(
                    <Flex w='100%' direction='column'>
                        <Stack spacing='20px'>
                            <Text align='center'>From: 0x0456...</Text>
                            <Icon alignSelf='center' boxSize={7} as={RiSwapFill}></Icon>
                            <Text align='center'>To: 0x0456...</Text>
                            <Divider w='50%' alignSelf='center' border='2px solid #FOBD3F'></Divider>
                            <Text fontWeight='bold' align='center'> Swap Details </Text>
                            <Text align='center'>100 ETH {<Icon boxSize={4} as={AiOutlineSwap}/>} 5 BTC</Text>
                            <Divider w='50%' alignSelf='center' border='2px solid #FOBD3F'></Divider>
                            <Text fontWeight='bold' align='center'> Escrow Funding </Text>
                            <Text align='center'><Button color={fundingState !== 'Funded' ? 'red.400' : 'green.400'} variant='ghost'>{fundingState}</Button></Text>
                            <Divider w='50%' alignSelf='center' border='2px solid #FOBD3F'></Divider>
                            <Text fontWeight='bold' align='center'> Actions </Text>
                            <Button marginBottom='10px' alignSelf='center'>Accept Swap Request</Button>
                        </Stack>
                    </Flex>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    ); 
}

export default SwapDetails; 