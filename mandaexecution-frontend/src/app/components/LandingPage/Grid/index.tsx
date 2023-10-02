import { Box, Grid, Text } from "@chakra-ui/react";

const LandingPageGrid = () => {

    return (
        <Grid
      templateRows="auto auto"
      gap={4} // You can adjust the gap size as needed
      alignItems={'center'}
      p={4}
      mr={2}
    >
      {/* First Row */}
      <Box
        borderRadius={'lg'} // Make the box rounded
        boxShadow={'xl'}
        bg="black" // Change the background color as needed
        p={1} // Add padding for spacing within the box
        gridColumn={'1 / 4'}
        width={{base:"90vw",md:'auto'}}
      >
        <Text textAlign={'center'} color={'white'} fontWeight={'extrabold'} fontSize={{base:'24px',md:'32px'}}>A simple journey to create and execute a proposal.</Text>
      </Box>

      {/* Second Row */}
      <Box
        borderRadius={'lg'} // Make the rectangles rounded
        boxShadow={'xl'}
        bg="black" // Change the background color as needed
        p={4} // Add padding for spacing within the box
        gridColumn={{base:'1 / 4',md:'1 / 2'}}
        minHeight={{base:'auto',md:'335px'}}
        width={{base:"90vw",md:'auto'}}
      >
        <Text color={'white'} fontWeight={'extrabold'} fontSize={'28px'}>1.</Text>
        <Text color={'white'} fontWeight={'extrabold'} fontSize={'24px'}>Design</Text>
        <Text color={'white'} fontWeight={'semibold'} fontSize={'18px'}>Customize your proposal by selecting the operations that are needed for its completion.</Text>
      </Box>

      <Box
       borderRadius={'lg'} // Make the rectangles rounded
        bg="black" // Change the background color as needed
        p={4} // Add padding for spacing within the box
        boxShadow={'xl'}
        gridColumn={{base:'1 / 4',md:'2 / 3'}}
        width={{base:"90vw",md:'auto'}}
        minHeight={{base:'auto',md:'335px'}}
      >
         <Text color={'white'} fontWeight={'extrabold'} fontSize={'28px'}>2.</Text>
         <Text color={'white'} fontWeight={'extrabold'} fontSize={'24px'}>Vote</Text>
         <Text color={'white'} fontWeight={'semibold'} fontSize={'18px'}>Propose to a community and let them approve, reject or counter your proposal.</Text>
      
      </Box>

      <Box
        borderRadius={'lg'} // Make the rectangles rounded
        bg="black" // Change the background color as needed
        p={4} // Add padding for spacing within the box
        boxShadow={'xl'}
        gridColumn={{base:'1 / 4',md:'3 / 4'}}
        minHeight={{base:'auto',md:'335px'}}
        width={{base:"90vw",md:'auto'}}
      >
         <Text color={'white'} fontWeight={'extrabold'} fontSize={'28px'}>3.</Text>
         <Text color={'white'} fontWeight={'extrabold'} fontSize={'24px'}>Execute</Text>
         <Text color={'white'} fontWeight={'semibold'} fontSize={'18px'}>If the proposal is approved, then it is executed according to plan.</Text>
      </Box>
    </Grid>
    ); 
}

export default LandingPageGrid; 