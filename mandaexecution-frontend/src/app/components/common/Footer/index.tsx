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
                <Text marginTop={'4vh'} textAlign={'center'}>Describe your operation with words, we take care of the rest</Text>
            </Container>
            <Container margin={0} w={'100vw'} alignItems={'flex-start'}>
                <Text> &copy; Manda Labs</Text>
            </Container>
        </Flex>
    ); 
}

export default Footer; 