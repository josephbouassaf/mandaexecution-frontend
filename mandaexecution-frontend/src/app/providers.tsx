'use client'; 

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { VaultsProvider } from "./context/vaults";
import { ThirdwebProvider } from "@thirdweb-dev/react";

export function Providers ({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <CacheProvider>
            <ThirdwebProvider activeChain={"ethereum"} clientId="ea87cf76a4293222fca6fd31fcb503ea">
                <ChakraProvider>
                    <VaultsProvider>
                        {children}
                    </VaultsProvider>
                </ChakraProvider>
            </ThirdwebProvider>
        </CacheProvider>
    )
}