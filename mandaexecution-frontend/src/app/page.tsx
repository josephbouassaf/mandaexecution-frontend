'use client'
import { Container, Stack } from "@chakra-ui/react";
import SwapRequests from "./components/Swap/SwapRequests";
import CreateSwap from "./components/Swap/CreateSwap";
import Services from "./components/Home";

import "@fontsource/space-grotesk";
import Footer from "./components/common/Footer";

export default function Home() {
  return (
        <Container maxWidth="90vw" centerContent>
          <Stack spacing={'24px'}>
            <Services/>
            <Footer />
          </Stack> 
        </Container>
      ); 
}
