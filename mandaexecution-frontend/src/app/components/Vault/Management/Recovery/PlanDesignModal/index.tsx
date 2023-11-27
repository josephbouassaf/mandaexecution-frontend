import { addPlan } from "@/app/functions/ethereum/contracts/functions";
import { RecoveryPlan } from "@/app/type";
import { Button, Divider, Flex, Icon, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Select, Stack, Text, Textarea } from "@chakra-ui/react";
import { useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { LiaEthereum } from "react-icons/lia"
import { MdOutlineSubtitles, MdOutlineTitle } from "react-icons/md";

interface Props {
    isOpen:boolean; 
    onClose: () => void; 
}
/**
 * Form to create a recovery plan
 * @param props 
 * @returns 
 */
const PlanDesignModal = (props: Props) => {

    const {isOpen, onClose} = props; 
    
    const signer = useSigner(); 

    const [description, setDescription] = useState<string>(''); 
    const [title, setTitle] = useState<string>(''); 
    const [receiver, setReceiver] = useState<string>('');
    const [funcIdx, setFuncIdx] = useState<string>(''); 

    const [isLoading, setIsLoading] = useState(false); 

    const isSubmitDisabled = () => {
        console.log(receiver)
        return description.length > 0 && !ethers.utils.isAddress(receiver) && title.length > 0; 
    }

    const handleSubmitRecoveryPlan = async () => {
        if(signer) {
            setIsLoading(true)
            const plan:RecoveryPlan = {title:title, description: description, receiver:receiver}; 
            
            await addPlan(signer,plan); 

            setIsLoading(false); 
            onClose();
            
        }
    }

    useEffect(() => {

    },[description, title, receiver]); 

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Flex w='100%' justify='space-between'>
                    <Text fontWeight='bold'>Recovery Plan Design</Text>
                    <Button onClick={onClose} variant='close'>Close</Button>
                    </Flex>
                    <Divider border='2px solid #FOBD3F'></Divider>
                    </ModalHeader>
                    <ModalBody>
                    <Flex w='100%' direction='column'>
                        <Stack spacing='20px' alignItems={'center'}>
                            <Text fontWeight={'bold'}>Pick a Title</Text>
                            <InputGroup>
                                <Input onChange={e => setTitle(e.target.value)} backgroundColor={'white'} borderWidth='2px' placeholder="plan title" ></Input>
                                <InputLeftElement>
                                    <Icon as={MdOutlineTitle}></Icon>
                                </InputLeftElement>
                            </InputGroup>
                            <Text fontWeight={'bold'}>Pick a Recovery Plan</Text>
                            <InputGroup>
                                <Select onChange={(e) => setFuncIdx(e.target.value)} placeholder="Select Recovery Plan">
                                    <option value='0'>Transfer Assets</option>
                                </Select>
                            </InputGroup>
                            <Text fontWeight={'bold'}>Describe your plan</Text>
                            <InputGroup>
                                <Textarea onChange={e => setDescription(e.target.value)} backgroundColor={'white'} borderWidth='2px' placeholder="plan description" ></Textarea>
                            </InputGroup>
                            <Text fontWeight={'bold'}>Pick a Receiver</Text>
                            <InputGroup>
                                <Input isInvalid={ethers.utils.isAddress(receiver)} onChange={e => setReceiver(e.target.value)} backgroundColor={'white'} borderWidth='2px' placeholder="beneficiary address" ></Input>
                                <InputLeftElement>
                                    <Icon as={LiaEthereum}></Icon>
                                </InputLeftElement>
                            </InputGroup>
                            <Button isLoading={isLoading} onClick={handleSubmitRecoveryPlan} backgroundColor={'white'}  color={'black'}  borderWidth={'2px'} borderColor={'black'} m={5} isDisabled={isSubmitDisabled()}>Submit</Button>    
                        </Stack>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    ); 
}
export default PlanDesignModal; 