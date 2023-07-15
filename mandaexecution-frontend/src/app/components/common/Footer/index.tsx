'use client'
import { 
    Box, 
    Flex, 
    Text 
} from "@chakra-ui/react";

const Footer = () => {

    return (
        <Box boxShadow={"xl"} w='100%'>
           <Flex gap='2rem' justifyContent={'space-between'}>
                <Text marginLeft={'15px'}> &copy; Manda Labs</Text>
           </Flex>
        </Box>
    ); 
}

export default Footer; 