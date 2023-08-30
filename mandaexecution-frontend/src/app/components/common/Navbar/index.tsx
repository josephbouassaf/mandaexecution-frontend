'use client'
import React from "react";
import { useState} from "react";
import {Button, Flex, Icon, Image, Tooltip } from "@chakra-ui/react";
import {BiConversation} from "react-icons/bi"; 
import Link from "next/link";
import FeedbackModal from "../FeedbackModal";
import { ConnectWallet } from "@thirdweb-dev/react";
import "../../../styles/Navbar/navbar.css"

const Navbar = () => {

    const [openFeedbackModal, setOpenFeedbackModal] = useState<boolean>(false); 
    
    const handleOpenFeedbackModal = () => {
        setOpenFeedbackModal(true); 
    } 
    return (
        <Flex w={'100%'} boxShadow={"lg"} height={{base:"10vh",md:"10vh", l:"12vh",xl: "12vh"}}>
            <FeedbackModal isOpen={openFeedbackModal} onClose={() => setOpenFeedbackModal(false)}/>
            <Flex w={'100%'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Flex display={{base:'none', md:'block'}} alignItems={'center'}>
                    <Link href="/"><Image loading={'eager'} height={'100%'} ml={5} src="/Manda_Labs_Logo.jpg" width={'9vw'} alt="Logo"></Image></Link>
                </Flex>
                <Flex display={{base:'block', md:'none'}} alignItems={'center'}>
                    <Link href="/"><Image loading={'eager'} ml={2} src="/manda-logo.jpg" width={"15vw"} alt="Logo"></Image></Link>
                </Flex>
                <Flex maxWidth={'80vw'}mr={'3vw'} flexDirection={'row'} alignItems={'center'}>
                    <Button onClick={handleOpenFeedbackModal} margin={1} sx={{"&:hover": {textDecoration: "none", backgroundColor: "grey", }}} borderRadius={'full'} leftIcon={<Icon as={BiConversation}></Icon>} backgroundColor={'black'} color={'white'}>Talk to us</Button>
                    <ConnectWallet
                        btnTitle="Connect Wallet"
                        className="connect-button"
                    />
                </Flex>
            </Flex>
        </Flex>
    ); 
}

export default Navbar; 