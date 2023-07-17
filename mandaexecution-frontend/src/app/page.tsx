'use client'
import { Container, Stack } from "@chakra-ui/react";
import SwapRequests from "./components/Swap/SwapRequests";
import CreateSwap from "./components/Swap/CreateSwap";

export default function Home() {
  return (
        <Container maxWidth="90vw" centerContent>
          <Stack spacing={'24px'}>
            <CreateSwap/>
            <SwapRequests/>
          </Stack> 
        </Container>
      ); 
}
