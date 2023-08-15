'use client'
import { Divider, Flex } from '@chakra-ui/react';
import React from 'react'; 
import NavigationOption from './NavigationOption';
import {AiOutlineSwap} from "react-icons/ai";
import {FiGitMerge} from "react-icons/fi";
import {TbPacman} from "react-icons/tb";
import {PiContactlessPaymentBold} from "react-icons/pi";
import {TbUsersGroup} from "react-icons/tb"; 
import {GiReceiveMoney} from "react-icons/gi";

const SideNavigation = () => {

    return (
        <>
        <Flex height={"100vw"} width={'25%'} left={0} flexDirection={'column'} justifyContent={'space-evenly'}>
            <Divider></Divider>
            <NavigationOption title={"Asset Swap"} navigationIcon={AiOutlineSwap}></NavigationOption>
            <NavigationOption title={"Design a Merger"} navigationIcon={FiGitMerge}></NavigationOption>
            <NavigationOption title={"Design an Acquisition"} navigationIcon={TbPacman}></NavigationOption>
            <NavigationOption title={"Design a Payment Contract"} navigationIcon={PiContactlessPaymentBold}></NavigationOption>
            <NavigationOption title={"Design a Service Contract"} navigationIcon={GiReceiveMoney}></NavigationOption>
            <NavigationOption title={"Discover Prices Together"} navigationIcon={TbUsersGroup}></NavigationOption>
        
        </Flex>
        </>
    ); 
} 
export default SideNavigation; 