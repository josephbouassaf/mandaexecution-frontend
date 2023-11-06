import { Button, Container, Flex, Text } from "@chakra-ui/react";
import { IoMdCloudUpload } from "react-icons/io";
import Recovery from "./Recovery";
import { useEffect, useState } from "react";
import { RecoveryPlan, VaultData } from "@/app/type";
import PlanDesignModal from "./Recovery/PlanDesignModal";

interface Props {
    vaultData: VaultData
}

/**
 * 
 * @returns home page for the management side of the vault
 */
const Management = (props: Props) => {

    const {vaultData} = props;

    const [isOpen, setIsOpen] = useState(false); 
    

    useEffect(() => {
       console.log(vaultData); 
    },[vaultData])

    return (
        <Container>
            <Flex flexDirection={'column'}>
                <Text fontWeight={'bold'}>Manage Your Recovery Vault</Text>
                <Flex flexDirection={'column'}>
                    <Text>
                        Vault Address: {vaultData && vaultData.vaultAddress}
                    </Text>
                </Flex>
            </Flex>
            <Flex flexDirection={'row'} justifyContent={'flex-end'}>
                <PlanDesignModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
                <Button onClick={() => setIsOpen(true)} m={5} leftIcon={<IoMdCloudUpload/>} borderRadius={'5px'} borderWidth={'2px'} borderColor={'black'}>Add a Recovery Plan</Button>
                </Flex>
            <Recovery vaultData={vaultData}/>
        </Container>
    ); 
}

export default Management; 