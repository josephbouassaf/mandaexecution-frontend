'use client'
import { createContext, useContext, useEffect, useState } from "react"
import {WalletContext} from './wallet'
import {getUserVaults} from '../functions/intu/intu'

export const VaultsContext = createContext(); 

export const VaultsProvider = ({children}) => {
    const initialState = []; 

    const [vaults, setvaults] = useState(initialState);
    const {wallet} = useContext(WalletContext); 

    const fetchVaults = async () => {
        if(wallet) {
            const address = await wallet.getAddress(); 
            const arr = await getUserVaults(address); 
            setvaults(arr); 

        } else {
            setvaults(initialState); 
        }
    }

    useEffect(() => {

        fetchVaults(); 
    },[wallet])

    
    return (
        <VaultsContext.Provider
            value={{vaults, fetchVaults, initialState}}
        >
            {children}
        </VaultsContext.Provider>
    );
}