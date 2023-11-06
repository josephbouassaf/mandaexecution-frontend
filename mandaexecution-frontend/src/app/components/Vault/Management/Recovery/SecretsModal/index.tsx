import { addPlan } from "@/app/functions/ethereum/contracts/functions";
import { RecoveryPlan } from "@/app/type";
import { Button, Divider, Flex, Icon, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Select, Stack, Text, Textarea } from "@chakra-ui/react";
import { useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { LiaEthereum } from "react-icons/lia"
import {IoMdWallet,IoMdKey} from "react-icons/io"
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
const SecretsModal = (props: Props) => {

    const {isOpen, onClose} = props; 
    
    const signer = useSigner(); 

    
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
                                <Input onChange={e => setFragmentOne(e.target.value)} backgroundColor={'white'} borderWidth='2px' placeholder="fragment #1" ></Input>
                                <InputLeftElement>
                                    <Icon as={IoMdKey}></Icon>
                                </InputLeftElement>
                            </InputGroup>
                            <Text fontWeight={'bold'}>Fragment #2</Text>
                            <InputGroup>
                                <Input onChange={e => setFragmentTwo(e.target.value)} backgroundColor={'white'} borderWidth='2px' placeholder="fragment #2" ></Input>
                                <InputLeftElement>
                                    <Icon as={IoMdKey}></Icon>
                                </InputLeftElement>
                            </InputGroup>
                            <Button isLoading={isLoading} onClick={handleExecutePlan} backgroundColor={'white'}  color={'black'}  borderWidth={'2px'} borderColor={'black'} m={5} isDisabled={isSubmitDisabled()}>Recover Assets</Button>    
                        </Stack>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    ); 
}
export default SecretsModal; 