import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import {BsTwitter, BsLinkedin} from 'react-icons/bs'

const LandingPageFooter = () => {
    return (
        <Flex flexDirection={{base:'column',md:'row'}} gap={10} alignItems={'center'} m={2}>
            <Image src="/game_of_life_simple.gif"></Image>
            <Flex flexDirection={'column'} gap={4} alignItems={'center'}>
                <Image src="/manda_logo_complete.png" alt={'logo'} w={{base:'25vw',md:"10vw"}}></Image>
                <Flex flexDirection={'row'} gap={5}>
                    <Button variant={'unstyled'}><Icon as={BsTwitter}></Icon></Button>
                    <Button variant={'unstyled'}><Icon as={BsLinkedin}></Icon></Button>
                </Flex>
                <Flex>
                    <Text textAlign={{base:'center',md:'left'}}>Join us in our mission to enable humans behind DAOs self organize</Text>
                </Flex>
            </Flex>
        </Flex>
    ); 
}

export default LandingPageFooter; 