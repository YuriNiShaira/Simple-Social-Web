import { VStack, Flex, FormControl, Input, Button, FormLabel, Heading, Text, FormHelperText } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

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
        <Flex justifyContent="center" mt="50px" w="100%" h="calc(100vh - 400px)" alignItems="center">
            <VStack
                gap="20px"
                alignItems="center"
                w="95%"
                textAlign="center"
                maxW="400px"
                border="1px solid #ccc"
                p="20px"
                borderRadius="20px"
                background="#ffffff"
            >
                <Heading>Login</Heading>

                <FormControl>
                    <FormLabel textAlign="center">Enter Username</FormLabel>
                    <Input type="text" onChange={(e) => setUsername(e.target.value)} />
                    <FormHelperText>Welcome To Shaira's hub</FormHelperText>
                    <Text>_____________________________________________________</Text>
                </FormControl>

                <FormControl>
                    <FormLabel textAlign="center">Enter Password</FormLabel>
                    <Input type="password" onChange={(e) => setPassword(e.target.value)} />
                    <FormHelperText>🤐</FormHelperText>
                </FormControl>

                <VStack w="100%">
                    <Button w="100%" colorScheme="green" onClick={handleLogin}>Login</Button>
                    <Text onClick={handleNav} color="blue" cursor="pointer" fontSize="14px">
                        Don't have an account? Register
                    </Text>
                </VStack>
            </VStack>
        </Flex>
    )
}

export default Login
