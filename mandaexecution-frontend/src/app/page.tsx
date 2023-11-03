'use client'
import { Container, Stack } from "@chakra-ui/react";
import Main from "./components/Home/index";
import "@fontsource/space-grotesk";

export default function Home() {
  return (
        <Container maxWidth="100vw" centerContent>
          <Stack align={'center'} w={'100%'}spacing={'24px'}>
            <Main/>
          </Stack> 
        </Container>
      ); 
}
