import { Button, Flex, FormControl, FormLabel, Icon, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import {BiConversation} from "react-icons/bi";
import {MdOutlineForwardToInbox} from 'react-icons/md'; 
import emailjs from '@emailjs/browser'; 

interface FeedbackModalProps {
    isOpen: boolean,
    onClose: () => void; 
}

const FeedbackModal = ({isOpen, onClose}:FeedbackModalProps) => {

    const [feedbackText, setFeedbackText] = useState<string|null>(null); 
    const [name, setName] = useState<string|null>(null); 
    const [isLoading, setIsLoading] = useState<boolean|undefined>(undefined); 
    const [isSent, setIsSent] = useState<boolean|undefined>(undefined)
    
    const handleFeedbackChange = (e:any) => {
        setFeedbackText(e.target.value); 
    }
    const handleNameChange = (e:any) => {
        setName(e.target.value)
    }

    const resetState = () => {
        setFeedbackText(null); 
        setName(null);
        setIsLoading(undefined); 
        setIsSent(undefined);
    }

    const handleSendEmail = async () => {
        setIsLoading(true); 
        setIsSent(false); 
        var templateParams = {
            message: `From: ${name} \n\t`+'Feedback:\n'+feedbackText
        };
         
        await emailjs.send('service_4cmwxad', 'template_0748qu7', templateParams, 'KNstMu_8_y7oE5D_M')
            .then(function(response) {
                // reset values
               setFeedbackText(null); 
               setName(null);
               setIsLoading(false); 
               setIsSent(true); 
            }, function(error) {
                setFeedbackText(null); 
               setName(null);
               setIsLoading(false); 
               setIsSent(false);
               console.log('failed to send feedback...', error);
            });
        
    };

    return (
    <>
        <Modal size={'sm'} isCentered isOpen={isOpen} onClose={() => {
            resetState();
            onClose();}}>
        <ModalOverlay/>
        <ModalContent maxWidth={{base:'80vw',md:"35vw"}}>
            <ModalHeader>
            </ModalHeader>
                <ModalBody>
                <Flex w='100%' direction='column' gap={4}>
                    <FormControl isRequired>
                        <FormLabel>Name/Email Address</FormLabel>
                        <Input width={'50%'} onChange={handleNameChange} placeholder="From"/>
                    </FormControl>
                    <FormControl isRequired>
                         <FormLabel>Feedback</FormLabel>
                        <Textarea placeholder="Let us know how we can improve." onChange={handleFeedbackChange}/>
                    </FormControl>
                        <Button disabled={isSent} isLoading={isLoading} variant={isSent ? 'unstyled' : 'solid'} color={isSent ? 'green.400' : 'black'} alignSelf={'center'} borderRadius={"full"} width={"50%"} onClick={handleSendEmail} leftIcon={<Icon as={MdOutlineForwardToInbox}></Icon>}>{ isSent ? 'Sent' : 'Send'}</Button>
                        <Text alignSelf={'center'}>And/Or</Text>
                        <Button width={{base:"85%",md:"65%"}} alignSelf={"center"} mb={4} sx={{"&:hover": {textDecoration: "none", backgroundColor: "black", }}} as='a' href='https://calendly.com/mandalabs-jules/30min' target='_blank' rel="noopener noreferrer" borderRadius={'full'} leftIcon={<Icon as={BiConversation}></Icon>} backgroundColor={'black'} color={'white'}>Schedule a Meeting.</Button>
                </Flex>
            </ModalBody>
        </ModalContent>
    </Modal>
         </>
    );
}
export default FeedbackModal;