import { Flex, Text, VStack, FormControl, FormLabel, Input, FormHelperText, Button, Heading, Box, Container, Divider, InputGroup, InputLeftElement, Icon, SimpleGrid } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { login } from "../api/endpoints"
import { register } from "../api/endpoints"
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt, FaUserCircle } from "react-icons/fa"
import { MdPerson, MdLock, MdEmail } from "react-icons/md"

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const nav = useNavigate()

    const handleRegister = async () => {
        if(password === confirmPassword){
            try{
                await register(username, email, firstName, lastName, password)
                alert('Account created✅')
                nav('/login')
            } catch(error){
                console.error('Registration error:', error)
                alert(`Account register failed❌: ${error.message}`)
            }
        } else {
            alert(`Password don't match❌`)
        }
    }

    const handleNav = async () => {
        nav('/login')
    }

    return(
        <Flex 
            w="100%" 
            minH="100vh" 
            alignItems="center" 
            justifyContent="center"
            bgGradient='linear(red.100 0%, yellow.100 25%, pink.100 50%)'
            py={8}
        >
            <Container maxW="container.md">
                <Flex justifyContent="center" w="100%">
                    <Box
                        w="100%"
                        maxW="600px"
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
                                        <FaUserPlus size="32px" color="white" />
                                    </Box>
                                    <Heading 
                                        size="xl" 
                                        bgGradient="linear(to-r, red.700, yellow.600, pink.700)"
                                        bgClip="text"
                                        fontWeight="bold"
                                    >
                                        Create Account
                                    </Heading>
                                    <Text color="gray.600" fontSize="lg">
                                        Join our community today
                                    </Text>
                                </VStack>

                                {/* Form */}
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                                    {/* Username */}
                                    <FormControl>
                                        <FormLabel 
                                            fontWeight="semibold" 
                                            color="gray.700"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Username
                                        </FormLabel>
                                        <InputGroup>
                                            <InputLeftElement pointerEvents="none">
                                                <Icon as={FaUser} color="red.500" />
                                            </InputLeftElement>
                                            <Input 
                                                onChange={(e) => setUsername(e.target.value)} 
                                                type='text'
                                                placeholder="Choose a username"
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
                                            Your unique identifier
                                        </FormHelperText>
                                    </FormControl>

                                    {/* Email */}
                                    <FormControl>
                                        <FormLabel 
                                            fontWeight="semibold" 
                                            color="gray.700"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Email Address
                                        </FormLabel>
                                        <InputGroup>
                                            <InputLeftElement pointerEvents="none">
                                                <Icon as={MdEmail} color="yellow.500" />
                                            </InputLeftElement>
                                            <Input 
                                                onChange={(e) => setEmail(e.target.value)} 
                                                type='email'
                                                placeholder="Enter your email"
                                                size="lg"
                                                borderRadius="lg"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                _focus={{
                                                    borderColor: "yellow.400",
                                                    boxShadow: "0 0 0 1px yellow.400",
                                                }}
                                                _hover={{
                                                    borderColor: "yellow.300"
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
                                            We'll never share your email
                                        </FormHelperText>
                                    </FormControl>

                                    {/* First Name */}
                                    <FormControl>
                                        <FormLabel 
                                            fontWeight="semibold" 
                                            color="gray.700"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            First Name
                                        </FormLabel>
                                        <InputGroup>
                                            <InputLeftElement pointerEvents="none">
                                                <Icon as={MdPerson} color="pink.500" />
                                            </InputLeftElement>
                                            <Input 
                                                onChange={(e) => setFirstName(e.target.value)} 
                                                type='text'
                                                placeholder="Your first name"
                                                size="lg"
                                                borderRadius="lg"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                _focus={{
                                                    borderColor: "pink.400",
                                                    boxShadow: "0 0 0 1px pink.400",
                                                }}
                                                _hover={{
                                                    borderColor: "pink.300"
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
                                            Optional
                                        </FormHelperText>
                                    </FormControl>

                                    {/* Last Name */}
                                    <FormControl>
                                        <FormLabel 
                                            fontWeight="semibold" 
                                            color="gray.700"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Last Name
                                        </FormLabel>
                                        <InputGroup>
                                            <InputLeftElement pointerEvents="none">
                                                <Icon as={FaUserCircle} color="red.500" />
                                            </InputLeftElement>
                                            <Input 
                                                onChange={(e) => setLastName(e.target.value)} 
                                                type='text'
                                                placeholder="Your last name"
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
                                            Optional
                                        </FormHelperText>
                                    </FormControl>

                                    {/* Password */}
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
                                                <Icon as={FaLock} color="yellow.500" />
                                            </InputLeftElement>
                                            <Input 
                                                onChange={(e) => setPassword(e.target.value)} 
                                                type='Password'
                                                placeholder="Create a strong password"
                                                size="lg"
                                                borderRadius="lg"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                _focus={{
                                                    borderColor: "yellow.400",
                                                    boxShadow: "0 0 0 1px yellow.400",
                                                }}
                                                _hover={{
                                                    borderColor: "yellow.300"
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
                                            Min. 8 characters with letters & numbers
                                        </FormHelperText>
                                    </FormControl>

                                    {/* Confirm Password */}
                                    <FormControl>
                                        <FormLabel 
                                            fontWeight="semibold" 
                                            color="gray.700"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Confirm Password
                                        </FormLabel>
                                        <InputGroup>
                                            <InputLeftElement pointerEvents="none">
                                                <Icon as={MdLock} color="pink.500" />
                                            </InputLeftElement>
                                            <Input 
                                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                                type='Password'
                                                placeholder="Re-enter your password"
                                                size="lg"
                                                borderRadius="lg"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                _focus={{
                                                    borderColor: "pink.400",
                                                    boxShadow: "0 0 0 1px pink.400",
                                                }}
                                                _hover={{
                                                    borderColor: "pink.300"
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
                                            Must match the password above
                                        </FormHelperText>
                                    </FormControl>
                                </SimpleGrid>

                                {/* Password Requirements */}
                                <Box 
                                    bgGradient="linear(to-r, red.50, yellow.50, pink.50)"
                                    p={4}
                                    borderRadius="lg"
                                    border="1px solid"
                                    borderColor="red.100"
                                >
                                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                                        Password Requirements:
                                    </Text>
                                    <SimpleGrid columns={2} spacing={1}>
                                        <Text fontSize="xs" color="gray.600">
                                            • At least 8 characters
                                        </Text>
                                        <Text fontSize="xs" color="gray.600">
                                            • Mix of letters & numbers
                                        </Text>
                                        <Text fontSize="xs" color="gray.600">
                                            • Special characters allowed
                                        </Text>
                                        <Text fontSize="xs" color="gray.600">
                                            • No spaces
                                        </Text>
                                    </SimpleGrid>
                                </Box>

                                {/* Register Button */}
                                <Button 
                                    onClick={handleRegister}
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
                                    w="100%"
                                >
                                    <FaUserPlus style={{ marginRight: "8px" }} />
                                    Create Account
                                </Button>

                                {/* Divider */}
                                <Flex align="center" my={4}>
                                    <Divider flex={1} borderColor="gray.300" />
                                    <Text mx={4} color="gray.500" fontSize="sm">OR</Text>
                                    <Divider flex={1} borderColor="gray.300" />
                                </Flex>

                                {/* Login Link */}
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
                                    w="100%"
                                >
                                    <FaSignInAlt style={{ marginRight: "8px" }} />
                                    Already have an account? Log in
                                </Button>

                                {/* Footer Text */}
                                <Text 
                                    textAlign="center" 
                                    fontSize="xs" 
                                    color="gray.500"
                                    mt={4}
                                >
                                    By registering, you agree to our{" "}
                                    <Text as="span" color="red.600" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                                        Terms of Service
                                    </Text>{" "}
                                    and{" "}
                                    <Text as="span" color="red.600" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                                        Privacy Policy
                                    </Text>
                                </Text>
                            </VStack>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Flex>
    )
}

export default Register