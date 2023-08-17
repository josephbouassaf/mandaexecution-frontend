'use client'
import CreateSwap from "@/app/components/Swap/CreateSwap";
import SwapRequests from "@/app/components/Swap/SwapRequests";
import { Container, Stack } from "@chakra-ui/react";

const SwapPage = () => {
    return (
        <Container w={"100%"} justifyContent={'center'}>
         <Stack marginTop={10} maxWidth={"90vw"}align={'center'} w={'100%'}spacing={6}>
            <CreateSwap/>
            <SwapRequests/>
        </Stack>
        </Container>
    );
} 
export default SwapPage; 