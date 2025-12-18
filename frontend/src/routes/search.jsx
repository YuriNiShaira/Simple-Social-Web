import { Button, Flex, Heading, HStack, Text, VStack, Input, Box, Image } from "@chakra-ui/react"
import { useState } from "react"
import { search_user } from "../api/endpoints"
import { SERVER_URL } from "../constants/constants"
import { useNavigate } from "react-router-dom"

const Search = () => {

    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])

    const handleSearch = async () =>{
        const users = await search_user(search)
        setUsers(users)
    }
    
    return(
        <Flex w='100%' justifyContent='center' pt='50px'>
            <VStack gap='40px' w='95%' maxW='450px'>
                <Heading>
                    <Text>Search User</Text>
                </Heading>
                <HStack w='100%' gap='5px'>
                    <Input onChange={(e) => setSearch(e.target.value)} bg='white' border='2px solid'/>
                    <Button onClick={handleSearch} colorScheme="blue">Search</Button>
                </HStack>
                <VStack w='100%'>
                    {
                        
                        users.map((user) => {
                            return <UserProfile username ={user.username} profile_image={user.profile_image} first_name={user.first_name} last_name={user.last_name} />
                        })
                    }
                </VStack>
            </VStack>
        </Flex>
    )
}

const UserProfile = ({username, profile_image, first_name, last_name}) => {

    const nav = useNavigate()

    const handleNavSearch = async () => {
        nav(`/${username}`)
    }
    
    return(
        <Flex onClick={handleNavSearch} w='100%' h='100px' border='1px solid' borderRadius='8px' bg='white' borderColor='gray.400' justifyContent='center' alignItems='center' cursor='pointer' transition='0.5s' _hover={{bg: 'gray.100', boxShadow:'md'}}>
            <HStack w='90%' gap='20px' alignItems='center'>

                <Box boxSize='70px' borderRadius='full' overflow='hidden' bg='white' border='1px solid'>
                    <Image src={`${SERVER_URL}${profile_image}`} boxSize='100%' objectFit='cover' />
                </Box>

                <VStack alignItems='start' gap='3px'>
                    <Text fontWeight='bold'>{first_name} {last_name}</Text>
                    <Text color='gray.500' fontSize='15px' >@{username}</Text>
                </VStack>
            </HStack>
        </Flex>
    )
}

export default Search