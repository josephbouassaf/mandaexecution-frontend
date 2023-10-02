import {Button, Flex, Image } from "@chakra-ui/react";
import LandingPageSection from "../components/LandingPage/Section";
import LandingPageGrid from "../components/LandingPage/Grid";
import LandingPageFooter from "../components/LandingPage/Footer";

const LandingPage = () => {
    return (
        <Flex direction={'column'} gap={2}>
            <LandingPageSection button={<Button mt={4} bg={'black'} color={'white'} borderRadius={'full'} boxShadow={'xl'}>Launch App</Button>}imagePath="/game_of_life_simple.gif" title="Enabling Collective Treasury Management" description="For protocols, DAOs, and ecosystem players,
            through user-friendly frameworks built on Ethereum."/>
            <Flex w={'100%'} direction={{base:'column',md:'row'}} gap={10}>
            <Image src="/game_of_life_shopping.gif"/>
                <LandingPageGrid></LandingPageGrid>
            </Flex>
            <LandingPageSection imagePath="/game_of_life_time_scale.gif" title="Plan your on-chain operations with our Governance frameworks" description="Negotiate and find prices and other parameters that satisfy the groups. Reach agreement faster, save money and increase satisfaction."/>            
            <LandingPageSection imagePath="/game_of_life_fan.gif" title="Execute your on-chain operations with our Swap Mechanism" description="Our modular stack enables you to pick and choose the required frameworks to complete your on chain operation. Customize your execution environment."/>

            <LandingPageFooter></LandingPageFooter>
        </Flex>
    );
}

export default LandingPage