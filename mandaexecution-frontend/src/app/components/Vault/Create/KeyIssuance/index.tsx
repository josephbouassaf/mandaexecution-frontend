import { VaultWithKeys } from "@/app/type";
import { Button, Container, Flex, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect } from "react";
import { BsQrCode } from "react-icons/bs";
import QRCode from "react-qr-code";

interface Props {
    vault: VaultWithKeys;
    display:string; 
    setDisplay: (displayArr:string[]) => void; 

}
/**
 * create Vault + issue key fragments as QRs
 * 
 */
const KeyIssuance = (props: Props) => {
    const {vault, display, setDisplay} = props; 

    const handleClickDone = () => {
        setDisplay(['none','none','none']); 
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