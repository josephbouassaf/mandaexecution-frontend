import { Divider, Flex, Grid, SimpleGrid, Text } from "@chakra-ui/react";
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
            <Flex marginTop={'2vh'} w={"100%"} direction={'column'} alignItems={'end'}>
                <Text mr={10}>{title}</Text>
                <Divider/>
            </Flex>
            <SimpleGrid p={5} minChildWidth={350} spacing={5} justifyItems={'center'}>
                {children}
            </SimpleGrid>
        </>
    );
}
export default ServicesRow; 