import { Button, Divider, Flex, Icon, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Select, Stack, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {IoMdWallet,IoMdKey} from "react-icons/io"
import {BiSolidCheckCircle} from "react-icons/bi"
import { executePlan } from "@/app/functions/intu/scripts";

interface Props {
    isOpen:boolean; 
    onClose: () => void; 
}
/**
 * Form to create a recovery plan
 * @param props 
 * @returns 
 */
const RecoveryModal = (props: Props) => {

    const {isOpen, onClose} = props; 
    
    const [success,setSuccess] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);
    
    const [fragmentOne, setFragmentOne] = useState(''); 
    const [fragmentTwo, setFragmentTwo] = useState(''); 
    const [ownerAddress, setOwnerAddress] = useState('')

    const isSubmitDisabled = () => {
        return ownerAddress.length === 0 || fragmentOne.length === 0 || fragmentTwo.length === 0; 
    }

    const handleExecutePlan = async () => {
        setIsLoading(true); 
        await executePlan([fragmentOne,fragmentTwo],ownerAddress); 
        setIsLoading(false); 
        setSuccess(true); 

    }

    useEffect(() => {

    },[ownerAddress, fragmentOne, fragmentTwo]); 

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Flex w='100%' justify='space-between'>
                    <Text fontWeight='bold'>Initiate Asset Recovery</Text>
                    <Button onClick={onClose} variant='close'>Close</Button>
                    </Flex>
                    <Divider border='2px solid #FOBD3F'></Divider>
                    </ModalHeader>
                    <ModalBody>
                    <Flex w='100%' direction='column'>
                    {success ?
                        <Stack spacing='20px' alignItems={'center'}>
                            <Text fontWeight={'bold'}>Lost Wallet Address</Text>
                            <InputGroup>
                                <Input onChange={e => setOwnerAddress(e.target.value)} backgroundColor={'white'} borderWidth='2px' placeholder="lost wallet address" ></Input>
                                <InputLeftElement>
                                    <Icon as={IoMdWallet}></Icon>
                                </InputLeftElement>
                            </InputGroup>
                            <Text fontWeight={'bold'}>Fragment #1</Text>
                            <InputGroup>
                                <Input type={'password'} onChange={e => setFragmentOne(e.target.value)} backgroundColor={'white'} borderWidth='2px' placeholder="fragment #1" ></Input>
                                <InputLeftElement>
                                    <Icon as={IoMdKey}></Icon>
                                </InputLeftElement>
                            </InputGroup>
                            <Text fontWeight={'bold'}>Fragment #2</Text>
                            <InputGroup>
                                <Input type={'password'} onChange={e => setFragmentTwo(e.target.value)} backgroundColor={'white'} borderWidth='2px' placeholder="fragment #2" ></Input>
                                <InputLeftElement>
                                    <Icon as={IoMdKey}></Icon>
                                </InputLeftElement>
                            </InputGroup>
                            <Button isLoading={isLoading} onClick={handleExecutePlan} backgroundColor={'white'}  color={'black'}  borderWidth={'2px'} borderColor={'black'} m={5} isDisabled={isSubmitDisabled()}>Recover Assets</Button>    
                        </Stack>
                        :
                        <Stack spacing='20px' alignItems={'center'}>
                            <Text fontWeight={'bold'}>Your assets have been recovered successfully! Please verify the receiver's account, the assets should be there!</Text>
                            <Icon alignSelf={'center'} boxSize={100} color={'green.400'} as={BiSolidCheckCircle}></Icon>
                        </Stack>
                        }
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    ); 
}
export default RecoveryModal; 