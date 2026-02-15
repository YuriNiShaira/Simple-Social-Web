import { Flex, HStack, Text } from "@chakra-ui/react"
const Navbar_Unauth = () => {


    return (
        <Flex w='100vw' h='90px' bg='pink' justifyContent='center' alignItems="center" position="sticky" top="0" zIndex="1000">
            <HStack w='90%' justifyContent='space-between' color='white' >
                <Text fontSize="40px" fontWeight="bold" fontFamily="fantasy" color='black'>
                    Shaira's Hub
                </Text>
            </HStack>
        </Flex>
    )
}

export default Navbar_Unauth