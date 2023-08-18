'use client'
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import {Button, Flex, Icon, Image, Tooltip } from "@chakra-ui/react";
import ErrorModal from "../ErrorModal";
import { ModalProps } from "../ErrorModal/type";
import { WalletContext } from "@/app/context/wallet";
import { ethers } from "ethers";
import {BiWalletAlt, BiConversation} from "react-icons/bi"; 
import Link from "next/link";
import FeedbackModal from "../FeedbackModal";

const Navbar = (props: any):any => {

    const [hasProvider, setHasProvider] = useState<boolean | null>(null); 
    const {wallet, setWallet, initialState} = useContext(WalletContext);
    const [provider, setProvider] = useState<any>(null);  
    const [address, setAddress] = useState<string>('');
    const [openFeedbackModal, setOpenFeedbackModal] = useState<boolean>(false); 

    const [isConnecting, setIsConnecting] = useState(false); 
    const [error, setError] = useState(false); 
    const [errorMessage, setErrorMessage] = useState(''); 

    const errorProps:ModalProps = {errorMessage: errorMessage, onClose: () => setError(false), isOpen: true}
    useEffect(() => {

        const refreshAccounts = (accounts: string[]) => {
            if(accounts.length < 1) {
                setWallet(initialState); 
                setAddress(''); 
            }
        }
        const getProvider = async () => {
            const _provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            setHasProvider(Boolean(_provider)); 
            setProvider(_provider); 

            if(_provider) {
                const accounts = await window.ethereum.request(
                    { method: 'eth_accounts' }
                  );
                refreshAccounts(accounts); 
                window.ethereum.on('accountsChanged', refreshAccounts) 
            }
        }
        getProvider();
    }, [wallet]); 

    const handleConnect = async () => {
        setIsConnecting(true); 
        // prompts for connection
        if(provider) {
            await provider.send("eth_requestAccounts", [])
            .then(async () => {
                setError(false); 
                const signer = await provider.getSigner(); 
                setWallet(signer); 
                setAddress(await signer.getAddress())
            })
            .catch((err: any) => {
                setError(true); 
                setErrorMessage(err.message); 
            }); 
            setIsConnecting(false); 
        }
    }

    const disableConnect = Boolean(wallet) && isConnecting; 
    
    const handleOpenFeedbackModal = () => {
        setOpenFeedbackModal(true); 
    }
    return (
        <Flex w={'100%'} boxShadow={"lg"} height={"10vh"}>
            <FeedbackModal isOpen={openFeedbackModal} onClose={() => setOpenFeedbackModal(false)}/>
            <Flex w={'100%'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Flex display={{base:'none', md:'block'}} alignItems={'center'}>
                    <Link href="/"><Image loading={'eager'} height={'100%'} ml={5} src="/Manda_Labs_Logo.jpg" width={'9vw'} alt="Logo"></Image></Link>
                </Flex>
                <Flex display={{base:'block', md:'none'}} alignItems={'center'}>
                    <Link href="/"><Image loading={'eager'} ml={2} src="/manda-logo.jpg" width={"15vw"} alt="Logo"></Image></Link>
                </Flex>
                <Flex maxWidth={'80vw'}mr={'3vw'} flexDirection={'row'} alignItems={'center'}>
                    <Button onClick={handleOpenFeedbackModal} margin={1} sx={{"&:hover": {textDecoration: "none", backgroundColor: "black", }}} borderRadius={'full'} leftIcon={<Icon as={BiConversation}></Icon>} backgroundColor={'black'} color={'white'}>Talk to us</Button>
                    {
                    hasProvider && (wallet === initialState) &&
                        <Button margin={1} sx={{"&:hover": {textDecoration: "none", backgroundColor: "#3D0ACE"}}} borderRadius={'full'} leftIcon={<Icon as={BiWalletAlt}></Icon>} backgroundColor='#3D0ACE' color='white' disabled={disableConnect} onClick={handleConnect}>Connect Wallet</Button>
                    }
                    { wallet && 
                            <Tooltip label={address}><Button borderRadius={'full'} variant={'outline'}>{address.substring(0,5)}...{address.slice(-5)}</Button></Tooltip>
                    }
                </Flex>
                {error && <ErrorModal errorMessage={errorProps.errorMessage} onClose={errorProps.onClose} isOpen={errorProps.isOpen}></ErrorModal>}  
            </Flex>
        </Flex>
    ); 
}

export default Navbar; 