import { Flex, HStack, Text } from "@chakra-ui/react"
const Navbar_Unauth = () => {


    return (
        <Flex w='100vw' h='90px' bg='blue.600' justifyContent='center' alignItems="center">
            <HStack w='90%' justifyContent='space-between' color='white' >
                <Text fontSize='24px' fontWeight='bold' fontFamily='fantasy' >Shaira's Hub</Text>
            </HStack>
        </Flex>
    )
}

export default Navbar_Unauth