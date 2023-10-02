import { Flex, Image, Text } from '@chakra-ui/react';
import React from 'react'; 

interface LandingPageSectionProps {
    imagePath: string; 
    title: string; 
    description: string;
    button?: any 

}

const LandingPageSection = (props: LandingPageSectionProps) => {

    const {imagePath, title, description, button} = props; 
    return (<>
    
    <Flex direction={{base:'column',md:'row'}} alignContent={'space-around'} alignItems={'center'} gap={4} m={4}>
        <Image style={{zIndex: '-1'}} src={imagePath} />
        <div>
            <Text fontWeight={'extrabold'} fontSize={{base:'28px',md:'36px'}}>{title}</Text>
            <Text fontWeight={'semibold'} fontSize={{base:'16px',md:'24px'}}>{description}</Text>
            {button}
        </div>
    </Flex> 
    </>);
}
export default LandingPageSection; 