'use client'
import { createContext, useContext, useEffect, useState } from "react"
import {getUserVaults} from '../functions/intu/intu'
import { useSigner } from "@thirdweb-dev/react";

export const VaultsContext = createContext(); 

export const VaultsProvider = ({children}) => {
    const initialState = []; 

    const [vaults, setvaults] = useState(initialState);
    const signer = useSigner();  

    const fetchVaults = async () => {
        if(signer) {
            const address = await signer.getAddress(); 
            const arr = await getUserVaults(address); 
            setvaults(arr); 
        } else {
            setvaults(initialState); 
        }
    }

    useEffect(() => {

        fetchVaults(); 
    },[signer])

    
    return (
        <VaultsContext.Provider
            value={{vaults, fetchVaults, initialState}}
        >
            {children}
        </VaultsContext.Provider>
    );
}