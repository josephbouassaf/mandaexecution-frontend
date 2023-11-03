import { Button, Flex, Text } from '@chakra-ui/react';
import { ConnectWallet, useSigner } from '@thirdweb-dev/react';
import React, { useState } from 'react';
import {MdOutlineAddCircleOutline} from "react-icons/md"; 
import {BsQrCodeScan} from "react-icons/bs"
import CreateVault from '../Vault/Create';

const Main = () => {

    const [startButtonDisplay, setStartButtonDisplay] = useState('block'); 
    const [createVaultDisplay, setCreateVaultDisplay] = useState('none')

    const handleStartHere = () => {
        setStartButtonDisplay('none'); 
        setCreateVaultDisplay('block'); 
    }
    const handleScanKeyFragments = async () => {

    }

    const signer = useSigner(); 

    return (
        <>
                 <Flex w={"100%"} flexDirection={'column'} justifyContent={'center'}>
                    <Text marginTop={'4vh'} fontSize={'42px'} textAlign={'center'}>
                        Welcome To <span style={{fontWeight:'999'}}>Manda.</span>
                    </Text>
                    <Text fontWeight={'bold'} fontSize={'14px'} textAlign={'center'}><i>"Plans are worthless, but planning is everything" ~ Dr. Einsenhower</i></Text>
                </Flex>
                <Flex w={'100%'} justifyContent={'center'}>
                    {signer ? 
                        <Flex flexDirection={'column'} w={'100%'} alignItems={'center'}>
                            <Text display={startButtonDisplay} fontWeight={'bold'}>The best time to protect your assets was yesterday.</Text>
                            <Button display={startButtonDisplay} onClick={handleStartHere} margin={1} sx={{"&:hover": {textDecoration: "none", backgroundColor: "grey", }}} borderRadius={'full'} leftIcon={<MdOutlineAddCircleOutline/>} backgroundColor={'black'} color={'white'}>Start Here</Button>
                            <CreateVault display={createVaultDisplay}></CreateVault>
                        </Flex>
                        : 
                        <div style={{textAlign:'center'}}>
                            <Text>To access our Wallet Protection and Recovery Services please connect your wallet</Text>
                            <ConnectWallet
                                btnTitle="Connect Wallet"
                                className="connect-button"
                                
                            />
                            <Text fontWeight={'bold'}>OR</Text>
                            <Text>Scan your backup vault key fragments</Text>
                        </div>
                    }
                </Flex>
        </>
    ); 
}

export default Main;