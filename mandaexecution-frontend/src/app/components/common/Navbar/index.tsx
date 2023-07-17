'use client'
import Image from "next/image";
import React, { useContext } from "react";
import mandaLogo from "../../../assets/manda-logo.jpg"; 
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Box, Button } from "@chakra-ui/react";

import '../../../styles/Navbar/navbar.css'
import ErrorModal from "../ErrorModal";
import { ModalProps } from "../ErrorModal/type";
import { WalletContext } from "@/app/context/wallet";
import { Signer, ethers } from "ethers";


const Navbar = (props: any):any => {

    const [hasProvider, setHasProvider] = useState<boolean | null>(null); 
    const {wallet, setWallet, initialState} = useContext(WalletContext);
    const [provider, setProvider] = useState<any>(null);  
    const [address, setAddress] = useState<string>(''); 

    const [isConnecting, setIsConnecting] = useState(false); 
    const [error, setError] = useState(false); 
    const [errorMessage, setErrorMessage] = useState(''); 

    const errorProps:ModalProps = {errorMessage: errorMessage, onClose: () => setError(false), isOpen: true}
    useEffect(() => {

        const refreshAccounts = (accounts: string[]) => {
            if(accounts.length < 1) {
                console.log('I should go here')
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

    const disableConnect = Boolean(wallet) && isConnecting
    return (
        <Box boxShadow={"lg"} marginBottom={'25px'}>
            <div className="navbar">
                <ul className="navbarList">
                    <li className="navbarListElement"><Image src={mandaLogo} width="90" alt="Logo"></Image></li>
                    {
                    hasProvider && (wallet === initialState) &&
                        <li className='navbarListElement'><Button backgroundColor='#3D0ACE' color='white' disabled={disableConnect} onClick={handleConnect}>Connect Metamask</Button></li>
                    }
                    { wallet && 
                            <li className='navbarListElement'>{address}</li>
                    }
                </ul>
                {error && <ErrorModal errorMessage={errorProps.errorMessage} onClose={errorProps.onClose} isOpen={errorProps.isOpen}></ErrorModal>}  
            </div>
        </Box>
    ); 
}

export default Navbar; 