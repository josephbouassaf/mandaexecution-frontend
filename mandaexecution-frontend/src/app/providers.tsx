'use client'; 

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import {WalletProvider} from './context/wallet'; 
import { VaultsProvider } from "./context/vaults";

export function Providers ({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <CacheProvider>
            <ChakraProvider>
                <WalletProvider>
                    <VaultsProvider>
                        {children}
                    </VaultsProvider>
                </WalletProvider>
            </ChakraProvider>
        </CacheProvider>
    )
}