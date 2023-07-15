'use client'
import Image from "next/image";
import React from "react";
import mandaLogo from "../../../assets/manda-logo.jpg"; 
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Box, Button } from "@chakra-ui/react";

import '../../../styles/Navbar/navbar.css'
import ErrorModal from "../ErrorModal";
import { ModalProps } from "../ErrorModal/type";


const Navbar = (props: any):any => {

    const [hasProvider, setHasProvider] = useState<boolean | null>(null); 
    const initialState = {accounts: []}; 
    const [wallet, setWallet] = useState(initialState); 

    const [isConnecting, setIsConnecting] = useState(false); 
    const [error, setError] = useState(false); 
    const [errorMessage, setErrorMessage] = useState(''); 

    const errorProps:ModalProps = {errorMessage: errorMessage, onClose: () => setError(false), isOpen: true}
    useEffect(() => {

        const refreshAccounts = (accounts: any) => {
            if(accounts.length > 0) {
                updateWallet(accounts); 
            } else {
                setWallet(initialState); 
            }
        }
        const getProvider = async () => {
            const provider = await detectEthereumProvider({silent: true}); 
            console.log(provider); 
            setHasProvider(Boolean(provider)); 

            if(provider) {
                const accounts = await window.ethereum.request({
                    method: 'eth_accounts'
                })
                refreshAccounts(accounts);
                window.ethereum.on('accountsChanged', refreshAccounts);  
            }
        }
        
        getProvider();
        return () => {
            window.ethereum?.removeListener('accountsChanged', refreshAccounts); 
        } 
    }, []); 

    const updateWallet = async (accounts: any) => {
        setWallet({accounts}); 
    }

    const handleConnect = async () => {
        setIsConnecting(true); 
        let accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        })
        .then((accounts:[]) => {
            setError(false); 
            updateWallet(accounts); 
        })
        .catch((err: any) => {
            setError(true); 
            setErrorMessage(err.message); 
        }); 
        setIsConnecting(false); 
    }

    const disableConnect = Boolean(wallet) && isConnecting
    return (
        <Box boxShadow={"lg"} marginBottom={'25px'}>
            <div className="navbar">
                <ul className="navbarList">
                    <li className="navbarListElement"><Image src={mandaLogo} width="90" alt="Logo"></Image></li>
                    {
                    hasProvider && wallet.accounts.length < 1 &&
                        <li className='navbarListElement'><Button disabled={disableConnect} onClick={handleConnect}>Connect Metamask</Button></li>
                    }
                    { wallet.accounts.length > 0 && 
                            <li className='navbarListElement'>{wallet.accounts[0]}</li>
                    }
                </ul>
                {error && <ErrorModal errorMessage={errorProps.errorMessage} onClose={errorProps.onClose} isOpen={errorProps.isOpen}></ErrorModal>}  
            </div>
        </Box>
    ); 
}

export default Navbar; 