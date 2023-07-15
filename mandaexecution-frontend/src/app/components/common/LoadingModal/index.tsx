import { Button, CircularProgress, Flex, Text } from '@chakra-ui/react';

import AnimatedCheckmark from '../AnimatedCheckmark'; 

interface LoadingIndicatorProps {
  isLoading: boolean;
  loadingHeading: string;
  completeHeading: string;
  completeSubheading: string;
  buttonText: string;
  action: () => void;
  containerHeight?: string;
}

const LoadingIndicator = ({
  isLoading,
  loadingHeading,
  completeHeading,
  completeSubheading,
  buttonText,
  action,
  containerHeight = '100%',
}: LoadingIndicatorProps) => {
    
  return (
    <Flex align={'center'} justify={'center'} height={containerHeight}>
      {isLoading ? (
        <Flex
          direction={'column'}
          align={'center'}
          justify={'center'}
          textAlign={'center'}
          gap={3}
        >
          <CircularProgress isIndeterminate color="#89BE5d" size={'70px'} />
          <Text fontSize={'lg'} fontWeight={'bold'}>
            {loadingHeading}
          </Text>
        </Flex>
      ) : (
        <Flex
          direction={'column'}
          align={'center'}
          justify={'center'}
          textAlign={'center'}
          gap={3}
        >
          <AnimatedCheckmark />
          <Flex direction={'column'} w={'70%'}>
            <Text fontSize={'lg'} fontWeight={'bold'}>
              {completeHeading}
            </Text>
            <Text fontSize="sm">{completeSubheading}</Text>
          </Flex>
          <Button onClick={action} mt={5} mb={5} variant={'upsCta'}>
            {buttonText}
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default LoadingIndicator;