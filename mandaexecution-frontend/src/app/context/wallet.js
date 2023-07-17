'use client'
import { createContext, useState } from "react"

export const WalletContext = createContext(); 

export const WalletProvider = ({children}) => {
    const initialState = undefined; 
    const [wallet, setWallet] = useState(initialState); 
    
    return (
        <WalletContext.Provider
            value={{wallet, setWallet, initialState}}
        >
            {children}
        </WalletContext.Provider>
    );
}