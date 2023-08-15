import { Container, Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react'; 

interface NavigationOptionProps {
    title:string;
    navigationIcon:any; 
} 
const NavigationOption = (props: NavigationOptionProps) => {
    const {title, navigationIcon} = props; 

    return (
        <>
        <Flex alignContent={'center'} flexDirection={'row'} justifyContent={'space-around'}>
            <div><Icon as={navigationIcon}></Icon><Text>{title}</Text></div>
        </Flex>
        </>
    );
}

export default NavigationOption; 