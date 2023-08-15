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

const Services = () => {
    return (
        <>
            <section>
                <Flex flexDirection={'column'} justifyContent={'center'}>
                    <Text fontSize={'42px'} fontWeight={'extrabold'} textAlign={'center'}>
                        Welcome to Manda
                    </Text>
                    <Text fontWeight={'bold'} fontSize={'24px'} textAlign={'center'}>Create a secure execution environment for your business operation, and execute it later</Text>
                </Flex>
            </section>
            <section>
                <Container width={'100vw'} justifyContent={'center'}>
                    <ServicesRow  props={{title:'Investment Contracts'}}>
                        <ServiceCard
                        title="Asset Swap"
                        description="Swap any two sets of digital assets with our swap contract. Engage in treasury diversification, liquidity consolidation, and more with one or more counterparties. "
                        link=""
                        buttonIcon={AiOutlineSwap}
                        additionalText='Coming Soon!'
                        actionButtonText="Swap!"/>
                        <ServiceCard
                        title="DAO2DAO Mergers"
                        description="Plan & Execute DAO2DAO Merger operations. Merge your digital assets, communities, and more"
                        link=""
                        buttonIcon={FiGitMerge}
                        additionalText='Coming Soon!'
                        actionButtonText="Merge!"/>
                        <ServiceCard
                        title="DAO2DAO Acquisitions"
                        description=""
                        link=""
                        buttonIcon={TbPacman}
                        additionalText='Coming Soon!'
                        actionButtonText="Acquire!"/>
                    </ServicesRow>
                    <ServicesRow props={{title:'Payment Contracts'}}>
                        <ServiceCard
                        title="Payment Contract"
                        description="Set up a future payment to a 3rd Party upon the conditions you set are met"
                        link=""
                        buttonIcon={PiContactlessPaymentBold}
                        additionalText='Coming Soon!'
                        actionButtonText="Pay!"/>
                    </ServicesRow>
                    <ServicesRow props={{title:'Service Contracts'}}>
                        <ServiceCard
                        title="Service Contract"
                        description="Set up a Service Agreement Contract with a counterparty. Decide on the terms, reach them and collet your payment."
                        link=""
                        buttonIcon={GiReceiveMoney}
                        additionalText='Coming Soon!'
                        actionButtonText="Collect!"/>
                    </ServicesRow>
                    <ServicesRow props={{title:'Governance'}}>
                        <ServiceCard
                        title="Price Discovery"
                        description="Use our innovative voting sytem, to agree on a price collectively"
                        link=""
                        buttonIcon={TbUsersGroup}
                        additionalText='Coming Soon!'
                        actionButtonText="Negotiate!"/>
                    </ServicesRow>
                </Container>
            </section>
        </>
    ); 
}

export default Services;