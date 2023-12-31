import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import ServicesRow from './Services/ServicesRow';
import ServiceCard from './Services/ServiceCard';
import {AiOutlineSwap} from "react-icons/ai";
import {FiGitMerge} from "react-icons/fi";
import {TbPacman} from "react-icons/tb";
import {TbUsersGroup} from "react-icons/tb"; 
import {BiTimer, BiPaperPlane} from "react-icons/bi"; 
import {MdCallSplit} from "react-icons/md"; 


const Services = () => {
    return (
        <>
                <Flex w={"100%"} flexDirection={'column'} justifyContent={'center'}>
                    <Text marginTop={'4vh'} fontSize={'42px'} textAlign={'center'}>
                        Welcome to <span style={{fontWeight:'999'}}>Manda.</span>
                    </Text>
                    <Text fontWeight={'bold'} fontSize={'24px'} textAlign={'center'}>Architect your business operation, execute it later.</Text>
                </Flex>
                <Flex w={'100%'} justifyContent={'center'} flexDirection={'column'}>
                    <ServicesRow props={{title:'Investment Contracts'}}>
                        <ServiceCard
                        title="OTC"
                        description="Purchase any digital assets. Engage in treasury diversification, liquidity consolidation, and more with one or more counterparties."
                        link="/tools/swap"
                        buttonIcon={AiOutlineSwap}
                        additionalText='Beta'
                        actionButtonText="Swap"/>
                        <ServiceCard
                        title="DAO Merger"
                        description="Plan & Execute DAO Merger operations. Merge your treasury, communities in a single operation."
                        link=""
                        buttonIcon={FiGitMerge}
                        additionalText='Coming Soon'
                        actionButtonText="Merge"/>
                        <ServiceCard
                        title="DAO Acquisitions"
                        description="Plan & Execute DAO Acquisition operations. Increase your reach, become an unforkable moat."
                        link=""
                        buttonIcon={TbPacman}
                        additionalText='Coming Soon'
                        actionButtonText="Acquire"/>
                        <ServiceCard
                        title="Vesting"
                        description="Schedule vesting plans, release tokens progressively over time."
                        link=""
                        buttonIcon={BiTimer}
                        additionalText='Coming Soon'
                        actionButtonText="Schedule"/>
                        <ServiceCard
                        title="Airdrop"
                        description="Distribute tokens to a whitelist in a single operation."
                        link=""
                        buttonIcon={BiPaperPlane}
                        additionalText='Coming Soon'
                        actionButtonText="Airdrop"/>
                        <ServiceCard
                        title="DAO Dissolution"
                        description="Plan & execute the dissolution of your organization."
                        link=""
                        buttonIcon={MdCallSplit}
                        additionalText='Coming Soon'
                        actionButtonText="Dissolve"/>
                    </ServicesRow>
                </Flex>
                <Flex marginTop={'4vh'} w={"100%"} flexDirection={'column'} justifyContent={'center'}>
                    <Text fontWeight={'bold'} fontSize={'24px'} textAlign={'center'}>Harvest and Compute collective intents.</Text>
                </Flex>
                <Flex w={'100%'} justifyContent={'center'} flexDirection={'column'}>
                    <ServicesRow props={{title:'Governance'}}>
                        <ServiceCard
                        title="Treasury Allocation"
                        description="Decide together on the amount of resources to allocate."
                        link="tools/negotiation"
                        buttonIcon={TbUsersGroup}
                        additionalText='Beta'
                        actionButtonText="Negotiate"/>
                        <ServiceCard
                        title="Counter offer"
                        description="Challenge a proposal, find a more satisfying price."
                        link=""
                        buttonIcon={TbUsersGroup}
                        additionalText='Coming Soon'
                        actionButtonText="Negotiate"/>
                        <ServiceCard
                        title="Asset pricing"
                        description="Discover the price of a tokenized asset together, decide together."
                        link=""
                        buttonIcon={TbUsersGroup}
                        additionalText='Coming Soon'
                        actionButtonText="Negotiate"/>
                    
                    </ServicesRow>
                    
                </Flex>
        </>
    ); 
}

export default Services;