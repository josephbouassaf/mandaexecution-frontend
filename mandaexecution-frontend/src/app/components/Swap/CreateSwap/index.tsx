import { Card, 
    CardHeader, 
    CardBody, 
    CardFooter,
    Button,
    Text,
    Stack,
    Input,
} from '@chakra-ui/react'

import {TriangleDownIcon} from "@chakra-ui/icons"
import { useState } from 'react';

const CreateSwap = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [creationComplete, setCreationComplete] = useState(false); 
    
    const handleArrowClick = () => {
        // redirect to swap requests table
        setCreationComplete(false);
        // set the redirect state to true so that the newly added swap is highlighted
        
    }

    const handleCreateRequest = async () => {
        setIsLoading(true);

        // api call 

            // if success 
        setCreationComplete(true); 
        setIsLoading(false); 

    }
    
    return (
        <Card backgroundColor='#010D50' width="100%" align='center'>
            <CardHeader>
                <Text fontWeight={'bold'} color={'white'} fontSize={'36px'}>Create Your Own Swaps With Manda</Text>
            </CardHeader>
            <CardBody>
               <Stack spacing={4}>
                    <Input backgroundColor={'white'} borderWidth='2px' placeholder="I have 0x..." ></Input>
                    <Input backgroundColor={'white'} borderWidth='2px' placeholder="I want 0x..." ></Input>
                    <Input backgroundColor={'white'} borderWidth='2px' placeholder="I want to trade with 0x.." ></Input>
               </Stack>
            </CardBody>
            <CardFooter>
                {!creationComplete ? <Button backgroundColor='#3D0ACE' onClick={handleCreateRequest} isLoading={isLoading} loadingText="Submitting Request" colorScheme='blue'>Create Swap Request</Button>
                : <a href='#testAnchor'><Button onClick={handleArrowClick}><TriangleDownIcon></TriangleDownIcon></Button></a>}
            </CardFooter>
        </Card>
    ); 
}
export default CreateSwap; 