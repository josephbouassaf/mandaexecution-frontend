import { getBackupVaultData } from "@/app/functions/ethereum/contracts/functions";
import { VaultData, VaultWithKeys } from "@/app/type";
import { Button, Container, Flex, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useSigner } from "@thirdweb-dev/react";
import QRCode from "react-qr-code";

interface Props {
    vault: VaultWithKeys;
    display:string; 
    setDisplay: (displayArr:string[]) => void;
    setVaultData: (data:VaultData) => void; 

}
/**
 * create Vault + issue key fragments as QRs
 * 
 */
const KeyIssuance = (props: Props) => {
    const {vault, display, setDisplay, setVaultData} = props;

    const signer = useSigner();

    const handleClickDone = async () => {
        setDisplay(['none','none','none']); 
        if(signer) {
            const vaultData:VaultData = await getBackupVaultData(signer); 
            setVaultData(vaultData); 
        }
    }

    return (
        <Container display={display}>
            <Flex flexDirection={'column'} justifyContent={'flex-start'}>
                <Text>Step 3.</Text>
                <Text marginBottom={'10px'} fontWeight={'900'}>You are all set! Please Scan the key fragments and store them somewhere safe.</Text>
            </Flex>
            {vault && 
            <Flex justifyContent={'center'}>
                <QRCode size={250} value={JSON.stringify(vault.keys.map(key => key.privateKey))}/>
            </Flex>}
            <Flex flexDirection={'row'} justifyContent={'center'} marginBottom={'5px'}>
                <Button mt={5} onClick={handleClickDone} variant={'outline'} color={'green.300'} borderColor={'green.300'}>Done</Button>
            </Flex>
        </Container>
    );
}

export default KeyIssuance;