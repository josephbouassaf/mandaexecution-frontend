import {Container} from "@chakra-ui/react"
import ProtectList from "./ProtectList";
import { useEffect, useState } from "react";
import { Asset, VaultWithKeys } from "@/app/type";
import { scanWallet } from "@/app/functions/ethereum/contracts/helpers";
import { useSigner } from "@thirdweb-dev/react";
import KeyIssuance from "./KeyIssuance";
import ConfirmApprovals from "./ConfirmApprovals";

interface Props {
    display:string
}
const CreateVault = (props: Props) => {
    const {display} = props; 

    const [protectList,setProtectList] = useState<Asset[]>([]); 
    
    const signer = useSigner(); 

    const [vault, setVault] = useState<VaultWithKeys|undefined>(); 

    const [componentDisplay,setComponentDisplay] = useState<string[]>(['block','none','none']); 

    const updateComponentDisplay = (displayArray:string[]) => {
        setComponentDisplay(displayArray); 
    }

    useEffect(() => {
        const scan = async () => {
            if(signer) {
                const address = await signer.getAddress();
                const temp = await scanWallet(address); 
                console.log(temp); 
                setProtectList(temp); 
            }
        }
        scan(); 
    }, [])

    
    return (
        <Container borderRadius={'5px'} display={display} backgroundColor={'#f7faff'} padding={'5px'}>
            <ProtectList setVault={setVault} display={componentDisplay[0]} setDisplay={updateComponentDisplay} protectList={protectList} setProtectList={setProtectList}/>
            <ConfirmApprovals protectList={protectList} vaultWithKeys={vault!} display={componentDisplay[1]} setDisplay={updateComponentDisplay}/>
            <KeyIssuance vault={vault!} display={componentDisplay[2]} setDisplay={updateComponentDisplay}/>
        </Container>
    ); 
} 

export default CreateVault; 
