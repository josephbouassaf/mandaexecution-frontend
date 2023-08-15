import { Divider, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface ServicesRowProps {
    title:string; 
}

const ServicesRow = (
    {
    children,
    props
}: {
    children: React.ReactNode
    props: ServicesRowProps
}) => {

   const {title} = props; 
    return (
        <>
            <Flex direction={'column'}>
                <Text>{title}</Text>
                <Divider/>
                {children}
            </Flex>
        </>
    );
}
export default ServicesRow; 