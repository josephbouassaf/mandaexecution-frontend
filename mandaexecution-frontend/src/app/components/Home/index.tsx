import { Container, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import ServicesRow from './Services/ServicesRow';
import ServiceCard from './Services/ServiceCard';
import {AiOutlineSwap} from "react-icons/ai";
import {FiGitMerge} from "react-icons/fi";
import {TbPacman} from "react-icons/tb";
import {PiContactlessPaymentBold} from "react-icons/pi";
import {TbUsersGroup} from "react-icons/tb"; 
import {GiReceiveMoney} from "react-icons/gi"; 
import {AiOutlineSchedule} from "react-icons/ai"


const Services = () => {
    return (
        <>
                <Flex w={"100%"} flexDirection={'column'} justifyContent={'center'}>
                    <Text fontSize={'42px'} fontWeight={'extrabold'} textAlign={'center'}>
                        Welcome to Manda
                    </Text>
                    <Text fontWeight={'bold'} fontSize={'24px'} textAlign={'center'}>Architect your business operation, execute it later</Text>
                </Flex>
                <Flex w={'100%'} justifyContent={'center'} flexDirection={'column'}>
                    <ServicesRow props={{title:'Investment Contracts'}}>
                        <ServiceCard
                        size={3}
                        index={0}
                        title="Asset Swap"
                        description="Swap any two sets of digital assets with our swap contract. Engage in treasury diversification, liquidity consolidation, and more with one or more counterparties. "
                        link=""
                        buttonIcon={AiOutlineSwap}
                        additionalText='Coming Soon!'
                        actionButtonText="Swap!"/>
                        <ServiceCard
                        size={3}
                        index={1}
                        title="DAO2DAO Mergers"
                        description="Plan & Execute DAO2DAO Merger operations. Merge your digital assets, communities, and more"
                        link=""
                        buttonIcon={FiGitMerge}
                        additionalText='Coming Soon!'
                        actionButtonText="Merge!"/>
                        <ServiceCard
                        size={3}
                        index={2}
                        title="DAO2DAO Acquisitions"
                        description="Plan & Execute DAO2DAO Acquisition operations. Increase your reach, become an unforkable moat."
                        link=""
                        buttonIcon={TbPacman}
                        additionalText='Coming Soon!'
                        actionButtonText="Acquire!"/>
                    </ServicesRow>
                    <ServicesRow props={{title:'Payment Contracts'}}>
                        <ServiceCard
                        size={2}
                        index={0}
                        title="Payment Contract"
                        description="Set up a future payment to a 3rd Party upon the conditions you set are met"
                        link=""
                        buttonIcon={PiContactlessPaymentBold}
                        additionalText='Coming Soon!'
                        actionButtonText="Pay!"/>
                        <ServiceCard 
                        size={2}
                        index={1}
                        title="Vesting Contract"
                        description="Set up a vesting schedule to be released to 3rd party"
                        link=""
                        buttonIcon={AiOutlineSchedule}
                        additionalText='Coming Soon!'
                        actionButtonText="Schedule!"/>
                    </ServicesRow>
                    <ServicesRow props={{title:'Service Contracts'}}>
                        <ServiceCard
                        size={1}
                        index={0}
                        title="Service Contract"
                        description="Set up a Service Agreement Contract with a counterparty. Decide on the terms, reach them and collet your payment."
                        link=""
                        buttonIcon={GiReceiveMoney}
                        additionalText='Coming Soon!'
                        actionButtonText="Collect!"/>
                    </ServicesRow>
                    <ServicesRow props={{title:'Governance'}}>
                        <ServiceCard
                        size={1}
                        index={0}
                        title="Price Discovery"
                        description="Use our innovative voting sytem, to agree on a price collectively"
                        link=""
                        buttonIcon={TbUsersGroup}
                        additionalText='Coming Soon!'
                        actionButtonText="Negotiate!"/>
                    </ServicesRow>
                </Flex>
        </>
    ); 
}

export default Services;