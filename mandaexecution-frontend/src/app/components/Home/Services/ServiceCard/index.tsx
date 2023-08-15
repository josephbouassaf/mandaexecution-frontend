import React from "react";
import { Button, Card, CardBody, CardFooter, Heading, Icon, Image, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

interface ServiceCardProps {
    title:string;
    description:string;
    actionButtonText:string; 
    link:string;
    buttonIcon?:any,
    additionalText?:string

}
const ServiceCard = (props: ServiceCardProps) => {
    const {title,description, actionButtonText, buttonIcon, additionalText, link} = props; 
    return (
        <>
            <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='elevated'
                margin={'1vw'}
            >
            <Stack>
                <CardBody>
                    <Heading size='md'>{title}</Heading>
                        <Text py='2'>
                            {description} 
                        </Text>
                </CardBody>
                <CardFooter>
                    <Link href={link}>
                        <Button backgroundColor={'#3D0ACE'} leftIcon={<Icon as={buttonIcon}></Icon>}variant='solid' colorScheme='blue'>
                            {actionButtonText}
                        </Button>
                    </Link>
                    {additionalText && <Button marginLeft={'5px'}backgroundColor={'black'} color={'white'} disabled={true}>{additionalText}</Button>}
                </CardFooter>
            </Stack>
        </Card>
    </>
    );
}

export default ServiceCard; 