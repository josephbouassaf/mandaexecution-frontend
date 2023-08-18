import React from "react";
import { Button, Card, CardBody, CardFooter, Flex, Heading, Icon, Stack, Text, Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import {IoDocumentOutline} from "react-icons/io5"; 

interface ServiceCardProps {
    title:string;
    description:string;
    actionButtonText:string; 
    link:string;
    buttonIcon?:any,
    additionalText?:string
    size:number; 
    index:number; 

}
const ServiceCard = (props: ServiceCardProps) => {
    const {title,description, actionButtonText, buttonIcon, additionalText, size, index, link} = props; 

    return (
            <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='elevated'
            >
            <Stack>
                <CardBody>
                    <Flex minW={"100%"} alignItems={'center'} flexDirection={'row'} justifyContent={'space-between'}>
                        <Heading size='md'>{title}</Heading>
                        <Button variant={'unstyled'}><Icon boxSize={5} as={IoDocumentOutline}></Icon></Button>
                    </Flex>
                        <Text>
                            {description} 
                        </Text>
                </CardBody>
                <CardFooter>
                    <Button disabled={link ? false : true} sx={{"&:hover": {textDecoration: "none", backgroundColor: link ? "black" : "grey"}}} borderRadius={'full'} backgroundColor={!link ? 'grey' : 'black'} color={'white'} leftIcon={<Icon as={buttonIcon}></Icon>}variant='solid' colorScheme='blue'>
                        <Link href={link}> {`${actionButtonText} (${additionalText})`}</Link>
                    </Button>
                </CardFooter>
            </Stack>
        </Card>
    );
}

export default ServiceCard; 