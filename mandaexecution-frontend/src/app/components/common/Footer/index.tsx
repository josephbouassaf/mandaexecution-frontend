'use client'
import { 
    Box, 
    Container, 
    Flex, 
    Text 
} from "@chakra-ui/react";

const Footer = () => {

    return (
        <Flex gap='2rem' flexDirection={'column'}>
            <Container w={'100vw'} justifyContent={'center'}>
            </Container>
            <Container margin={0} w={'100vw'} alignItems={'flex-start'}>
                <Text> &copy; Manda Labs</Text>
            </Container>
        </Flex>
    ); 
}

export default Footer; 