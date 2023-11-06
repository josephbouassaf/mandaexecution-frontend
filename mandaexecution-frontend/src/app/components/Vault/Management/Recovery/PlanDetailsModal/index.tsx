import { executePlan } from "@/app/functions/intu/scripts";
import { RecoveryPlan } from "@/app/type";
import { Button, Divider, Flex, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Stack, Text } from "@chakra-ui/react";
import { useSigner } from "@thirdweb-dev/react";
import { useState } from "react";
import { MdOutlineHealthAndSafety } from "react-icons/md";

interface Props {
    isOpen:boolean; 
    onClose:() => void; 
    recoveryPlan:RecoveryPlan
}
const PlanDetailsModal = (props: Props) => {

    const {isOpen, onClose, recoveryPlan} = props; 

    const [isLoading, setIsLoading] = useState(false); 
    
    const signer = useSigner(); 

    const handleDeletePlan = () => {

    }

    const handleExecutePlan = () => {
        
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Flex w='100%' justify='space-between'>
                    <Text fontWeight='bold'>Plan Summary</Text>
                    <Button onClick={onClose} variant='close'>Close</Button>
                    </Flex>
                    <Flex alignItems={'center'}>
                        <Text fontWeight={'bold'}>{recoveryPlan.title}</Text>
                    </Flex>
                    <Divider border='2px solid #FOBD3F'></Divider>
                    </ModalHeader>
                    <ModalBody>
                    <Flex w='100%' direction='column'>
                        <Stack spacing='20px'>
                            <Text align='center'>Description</Text>
                            <Text align='center'>{recoveryPlan.description}</Text>
                            <Divider w='50%' alignSelf='center' border='2px solid #FOBD3F'></Divider>
                            <Text fontWeight='bold' align='center'>Actions</Text>
                            <Flex justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>                       
                                <Button borderRadius={'5px'} borderWidth={'2px'} borderColor={'black'} color={'black'} backgroundColor={'white'} isLoading={isLoading}  onClick={handleDeletePlan}>Delete</Button>
                            </Flex>    
                        </Stack>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    ); 
}

export default PlanDetailsModal; 