import { VStack, Flex, FormControl, Input, Button, FormLabel, Heading, Text, FormHelperText, Box, Container, Divider, InputGroup, InputLeftElement, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { FaUser, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const nav = useNavigate()

    const { auth_login } = useAuth()

    const handleLogin = () => {
        auth_login(username, password)
    }

    const handleNav = () => {
        nav('/register')
    }

    return (
        <Flex 
            w="100%" 
            minH="100vh" 
            alignItems="center" 
            justifyContent="center"
            bgGradient='linear(red.100 0%, yellow.100 25%, pink.100 50%)'
            py={8}
        >
            <Container maxW="container.sm">
                <Flex justifyContent="center" w="100%">
                    <Box
                        w="100%"
                        maxW="450px"
                        bg="whiteAlpha.950"
                        borderRadius="2xl"
                        boxShadow="2xl"
                        p={{ base: 6, md: 8 }}
                        backdropFilter="blur(10px)"
                        border="1px solid"
                        borderColor="whiteAlpha.400"
                        position="relative"
                        _before={{
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: "2xl",
                            bgGradient: 'linear(to-r, whiteAlpha.600, transparent)',
                            zIndex: 0,
                            pointerEvents: 'none'
                        }}
                    >
                        <Box position="relative" zIndex={1}>
                            <VStack spacing={6} align="stretch">
                                {/* Header */}
                                <VStack spacing={3} textAlign="center">
                                    <Box 
                                        w="80px" 
                                        h="80px" 
                                        borderRadius="full" 
                                        bgGradient="linear(to-br, red.400, yellow.400, pink.400)"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        mx="auto"
                                        boxShadow="lg"
                                        border="4px solid white"
                                    >
                                        <FaSignInAlt size="32px" color="white" />
                                    </Box>
                                    <Heading 
                                        size="xl" 
                                        bgGradient="linear(to-r, red.700, yellow.600, pink.700)"
                                        bgClip="text"
                                        fontWeight="bold"
                                    >
                                        Welcome Back
                                    </Heading>
                                    <Text color="gray.600" fontSize="lg">
                                        Login to your account
                                    </Text>
                                </VStack>

                                {/* Form */}
                                <VStack spacing={5}>
                                    <FormControl>
                                        <FormLabel 
                                            fontWeight="semibold" 
                                            color="gray.700"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Username or Email
                                        </FormLabel>
                                        <InputGroup>
                                            <InputLeftElement pointerEvents="none">
                                                <Icon as={FaUser} color="red.500" />
                                            </InputLeftElement>
                                            <Input 
                                                type="text" 
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Enter your username or email"
                                                size="lg"
                                                borderRadius="lg"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                _focus={{
                                                    borderColor: "red.400",
                                                    boxShadow: "0 0 0 1px red.400",
                                                }}
                                                _hover={{
                                                    borderColor: "red.300"
                                                }}
                                                bg="whiteAlpha.900"
                                            />
                                        </InputGroup>
                                        <FormHelperText 
                                            color="gray.500" 
                                            fontSize="xs"
                                            mt={2}
                                            ml={1}
                                        >
                                            Enter your registered username or email
                                        </FormHelperText>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel 
                                            fontWeight="semibold" 
                                            color="gray.700"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Password
                                        </FormLabel>
                                        <InputGroup>
                                            <InputLeftElement pointerEvents="none">
                                                <Icon as={FaLock} color="red.500" />
                                            </InputLeftElement>
                                            <Input 
                                                type="password" 
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                size="lg"
                                                borderRadius="lg"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                _focus={{
                                                    borderColor: "red.400",
                                                    boxShadow: "0 0 0 1px red.400",
                                                }}
                                                _hover={{
                                                    borderColor: "red.300"
                                                }}
                                                bg="whiteAlpha.900"
                                            />
                                        </InputGroup>
                                        <FormHelperText 
                                            color="gray.500" 
                                            fontSize="xs"
                                            mt={2}
                                            ml={1}
                                        >
                                            Keep your password safe and secure
                                        </FormHelperText>
                                    </FormControl>
                                </VStack>

                                {/* Login Button */}
                                <Button 
                                    onClick={handleLogin}
                                    size="lg"
                                    bgGradient="linear(to-r, red.400, yellow.400, pink.400)"
                                    color="white"
                                    borderRadius="lg"
                                    _hover={{
                                        bgGradient: "linear(to-r, red.500, yellow.500, pink.500)",
                                        transform: "translateY(-2px)",
                                        boxShadow: "2xl"
                                    }}
                                    _active={{
                                        transform: "translateY(0)",
                                    }}
                                    transition="all 0.2s"
                                    fontWeight="bold"
                                    fontSize="md"
                                    height="50px"
                                >
                                    <FaSignInAlt style={{ marginRight: "8px" }} />
                                    Login to Account
                                </Button>

                                {/* Divider */}
                                <Flex align="center" my={4}>
                                    <Divider flex={1} borderColor="gray.300" />
                                    <Text mx={4} color="gray.500" fontSize="sm">OR</Text>
                                    <Divider flex={1} borderColor="gray.300" />
                                </Flex>

                                {/* Register Link */}
                                <Button 
                                    onClick={handleNav}
                                    variant="outline"
                                    size="lg"
                                    borderRadius="lg"
                                    border="2px solid"
                                    borderColor="yellow.300"
                                    color="gray.700"
                                    _hover={{
                                        bgGradient: "linear(to-r, yellow.50, pink.50)",
                                        borderColor: "yellow.400",
                                        transform: "translateY(-2px)",
                                    }}
                                    transition="all 0.2s"
                                    fontWeight="medium"
                                    height="50px"
                                >
                                    <FaUserPlus style={{ marginRight: "8px" }} />
                                    Create New Account
                                </Button>                              
                            </VStack>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Flex>
    )
}

export default Login