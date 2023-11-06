import { RecoveryPlan, VaultData } from "@/app/type";
import { Button, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PlanDetailsModal from "./PlanDetailsModal";
import { useEffect, useState } from "react";


interface Props {
    vaultData: VaultData; 
}
/**
 * 
 * @returns Table listing the recovery plans
 */
const Recovery = (props : Props) => {

    const {vaultData} = props; 

    const [isOpen, setIsOpen] = useState(false); 

    useEffect(() => {

    },[vaultData]); 

    return (
        <TableContainer borderRadius={5} borderColor={'black'} borderWidth={'2px'} boxShadow="xl" marginBottom={'20px'}>
                <Table colorScheme={'blackAlpha'} variant='simple'>
                    <TableCaption>Recovery Plans</TableCaption>
                    <Thead>
                        <Tr>
                            <Th textAlign='center'>Title</Th>
                            <Th textAlign='center'>Receiver</Th>
                            <Th textAlign='center'>Status</Th>
                            <Th textAlign='center'></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {vaultData && vaultData.executionPlan && 
                        <Tr>
                            <PlanDetailsModal recoveryPlan={vaultData.executionPlan} isOpen={isOpen} onClose={() => setIsOpen(false)} />
                            <Td textAlign={'center'}>{vaultData.executionPlan.title}</Td>
                            <Td textAlign={'center'}> {vaultData.executionPlan.receiver.substring(0,5)+'...'+vaultData.executionPlan.receiver.substring(vaultData.executionPlan.receiver.length-5)}</Td>    
                            <Td textAlign={'center'}> {vaultData.executionPlan.status}</Td> 
                            <Td textAlign={'center'}><Button onClick={() => setIsOpen(true)}>View</Button></Td>          
                        </Tr>
                        }
                    </Tbody>
                </Table>    
        </TableContainer>
    ); 
}
export default Recovery; 