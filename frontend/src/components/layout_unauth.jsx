import { Flex, VStack, Box } from "@chakra-ui/react"
import Navbar_Unauth from "./navbar_unauth"

const Layout_Unauth = ({children}) => {
    return(
        <VStack w='100vw' minH='100vh' bgGradient='linear(red.100 0%, yellow.100 25%, pink.100 50%)'>
            <Navbar_Unauth/>
            <Box w='100%'>
                {children}
            </Box>
        </VStack>    
    )
}

export default Layout_Unauth