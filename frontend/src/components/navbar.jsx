import { Button, Flex, HStack, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

import { GoPerson } from "react-icons/go";
import { MdPostAdd } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { LuUserRoundSearch } from "react-icons/lu";
import { GrUserSettings } from "react-icons/gr";

import { logout } from "../api/endpoints";

const Navbar = () => {

    const nav = useNavigate()

    const handleNavigate = (route) => {
        nav(`/${route}`)
    }

    const handleNavigateUser = () => {
        const username = JSON.parse(localStorage.getItem('userData'))['username']
        nav(`/${username}`)
        window.location.reload()
    }

     const handleLogout = async () => {
         try {
             await logout();
             nav('/login')
         } catch {
             alert ('error logging out')
         }
     }   

    return (
        <Flex w='100vw' h='90px' bg='blue.600' justifyContent='center' alignItems="center">
            <HStack w='90%' justifyContent='space-between' color='white' >
                <Text fontSize='24px' fontWeight='bold' fontFamily='fantasy' >Shaira's Hub</Text>
                <HStack gap='30px'>
                    <Text cursor='pointer' onClick={handleNavigateUser}><GoPerson size='22px' /></Text>
                    <Text cursor='pointer' onClick={(route) => handleNavigate('create_post')}><MdPostAdd size='22px' /></Text>
                    <Text cursor='pointer' onClick={(route) => handleNavigate('')}><AiOutlineHome size='22px' /></Text>
                    <Text cursor='pointer' onClick={(route) => handleNavigate('search')}><LuUserRoundSearch size='22px' /></Text>
                    <Button onClick={handleLogout} colorScheme="red">Logout</Button>
                </HStack>
            </HStack>
        </Flex>
    )
}

export default Navbar