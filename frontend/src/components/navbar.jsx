import { Flex, HStack, Text, Box, VStack, Button } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { GoPerson } from "react-icons/go";
import { MdPostAdd } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { LuUserRoundSearch } from "react-icons/lu";
import { GrUserSettings } from "react-icons/gr";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useState, useEffect } from "react";  // ✅ Add these
import { get_notifications, mark_notification_read, logout } from "../api/endpoints";  // ✅ Import

const Navbar = () => {
    const nav = useNavigate()
    const [notifications, setNotifications] = useState([])  // ✅ State for notifications
    const [showNotifications, setShowNotifications] = useState(false)  // ✅ Toggle dropdown

    const handleNavigate = (route) => {
        nav(`/${route}`)
    }

    const handleNavigateUser = () => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        const username = userData.username
        
        if (username) {
            nav(`/${username}`)
        } else {
            nav('/login')
        }
    }

    // ✅ Load notifications
    const loadNotifications = async () => {
        try {
            const data = await get_notifications()
            setNotifications(data)
        } catch (error) {
            console.error("Failed to load notifications:", error)
        }
    }

    // ✅ Mark notification as read and navigate
    const handleNotificationClick = async (notification) => {
        try {
            await mark_notification_read(notification.id)
            
            // Remove from local state
            setNotifications(prev => prev.filter(n => n.id !== notification.id))
            
            // Navigate based on notification type
            if (notification.notification_type === 'follow') {
                nav(`/${notification.from_username}`)
            } else if (notification.post_id) {
                // Could navigate to post, but for now go to home
                nav('/')
            }
            
        } catch (error) {
            console.error("Failed to mark notification read:", error)
        }
    }

    // ✅ Load notifications on component mount
    useEffect(() => {
        loadNotifications()
    }, [])

    // ✅ Count unread notifications
    const unreadCount = notifications.filter(n => !n.is_read).length

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
                <HStack gap='20px'>
                    <VStack mb='20px'>
                        <Text fontWeight='bold'>Profile</Text>
                        <Text title="Go to Profile" cursor='pointer' onClick={handleNavigateUser}><GoPerson size='25px' /></Text>
                    </VStack>
                    <VStack mb='20px'>
                        <Text fontWeight='bold'>Post</Text>
                        <Text title="Create Post" cursor='pointer' onClick={() => handleNavigate('create_post')}><MdPostAdd size='25px' /></Text>
                    </VStack>
                    <VStack mb='20px'>
                        <Text fontWeight='bold'>Feed</Text>
                        <Text title="Timeline" cursor='pointer' onClick={() => handleNavigate('')}><AiOutlineHome size='25px' /></Text>
                    </VStack>
                    <VStack mb='20px'>
                        <Text fontWeight='bold'>Search</Text>
                        <Text title="Search User" cursor='pointer' onClick={() => handleNavigate('search')}><LuUserRoundSearch size='25px' /></Text>
                    </VStack>

                    {/* ✅ NOTIFICATION BELL */}
                    <Box position="relative">
                        <VStack mb='14px'>
                            <Text fontWeight='bold'>Notif</Text>
                            <Text 
                                cursor='pointer' 
                                onClick={() => setShowNotifications(!showNotifications)}
                                title="Show notifications"
                                position="relative"
                            >
                                <IoIosNotificationsOutline  size='31px' />
                        
                                {/* Unread badge */}
                                {unreadCount > 0 && (
                                    <Box
                                        position="absolute"
                                        top="-5px"
                                        right="-5px"
                                        bg="red.500"
                                        color="white"
                                        borderRadius="full"
                                        w="18px"
                                        h="18px"
                                        fontSize="xs"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        {unreadCount}
                                    </Box>
                                )}
                            </Text>
                        </VStack>
                        
                        {/* ✅ NOTIFICATION DROPDOWN */}
                        {showNotifications && (
                            <Box
                                position="absolute"
                                top="45px"
                                right="0"
                                w="300px"
                                bg="white"
                                color="black"
                                borderRadius="md"
                                boxShadow="lg"
                                zIndex="1000"
                                maxH="400px"
                                overflowY="auto"
                            >
                                <VStack spacing={0} align="stretch">
                                    <Text p={3} fontWeight="bold" borderBottom="1px solid" borderColor="gray.200">
                                        Notifications ({notifications.length})
                                    </Text>
                                    
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <Box
                                                key={notification.id}
                                                p={3}
                                                borderBottom="1px solid"
                                                borderColor="gray.100"
                                                cursor="pointer"
                                                bg={notification.is_read ? "white" : "blue.50"}
                                                _hover={{ bg: "gray.50" }}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <Text fontSize="sm">
                                                    <Text as="span" fontWeight="bold">
                                                        @{notification.from_username}
                                                    </Text>
                                                    {" "}
                                                    {notification.notification_type === 'like' && 'liked your post'}
                                                    {notification.notification_type === 'comment' && 'commented on your post'}
                                                    {notification.notification_type === 'follow' && 'started following you'}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500" mt={1}>
                                                    {new Date(notification.created_at).toLocaleDateString()}
                                                </Text>
                                            </Box>
                                        ))
                                    ) : (
                                        <Text p={3} color="gray.500" textAlign="center">
                                            No notifications yet
                                        </Text>
                                    )}
                                </VStack>
                            </Box>
                        )}
                    </Box>

                    

                    <Button onClick={handleLogout} colorScheme="red">Logout</Button>

                </HStack>
            </HStack>
        </Flex>
    )
}

export default Navbar