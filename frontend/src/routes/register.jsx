import { Flex, Text, VStack, FormControl, FormLabel, Input, FormHelperText, Button, Heading, } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { login } from "../api/endpoints"
import { register } from "../api/endpoints"

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
            } catch(error){  // Dapat may parameter 'error'
                console.error('Registration error:', error)  // Log the actual error
                alert(`Account register failed❌: ${error.message}`)  // Show error message
            }
        } else {
            alert(`Password don't match❌`)
        }
    }

    const handleNav = async () => {
        nav('/login')
    }

    return(
        <Flex justifyContent='center' mt='50px' w='100%' h='calc(100vh - 90px)' alignItems='center' >
            <VStack
             gap='10px'
             alignItems='center'
             w="95%" 
             textAlign="center" 
             maxW='400px' 
             border='1px solid #ccc' 
             p='30px' 
             borderRadius='20px'
             background='#ffffffff'
             >

                <Heading>Register</Heading>
                <FormControl>
                    <FormLabel textAlign="center">Enter Username</FormLabel>
                    <Input onChange={(e) => setUsername(e.target.value)} type='text' />
                </FormControl>
                <FormControl>
                    <FormLabel textAlign="center">Enter Email</FormLabel>
                    <Input onChange={(e) => setEmail(e.target.value)} type='email' />
                </FormControl>
                <FormControl>
                    <FormLabel textAlign="center">Enter Firstname</FormLabel>
                    <Input onChange={(e) => setFirstName(e.target.value)} type='text' />
                </FormControl>
                <FormControl>
                    <FormLabel textAlign="center">Enter Lastname</FormLabel>
                    <Input onChange={(e) => setLastName(e.target.value)} type='text' />
                </FormControl>
                <FormControl>
                    <FormLabel textAlign="center">Enter Password</FormLabel>
                    <Input onChange={(e) => setPassword(e.target.value)} type='Password' />
                </FormControl>
                <FormControl>
                    <FormLabel textAlign="center">Confirm Password</FormLabel>
                    <Input onChange={(e) => setConfirmPassword(e.target.value)} type='Password' />
                </FormControl>
                <VStack w='100%'>
                    <Button w='25%' colorScheme="green" onClick={handleRegister}>Register</Button>
                    <Text onClick={handleNav} cursor='pointer' color='blue' fontSize='14px'>Already have an account? Log in</Text>
                </VStack>
            </VStack>
        </Flex>
    )
}

export default Register