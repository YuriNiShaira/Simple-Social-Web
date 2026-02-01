import { Flex, HStack, Text, Box, VStack, Button } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { GoPerson } from "react-icons/go"
import { MdPostAdd } from "react-icons/md"
import { AiOutlineHome } from "react-icons/ai"
import { LuUserRoundSearch } from "react-icons/lu"
import { IoIosNotificationsOutline } from "react-icons/io"
import { useState, useEffect } from "react"
import { get_notifications, mark_notification_read, logout } from "../api/endpoints"

const Navbar = () => {
    const nav = useNavigate()

    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)

    const handleNavigate = (route) => {
        nav(`/${route}`)
    }

    const handleNavigateUser = () => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        const username = userData.username

        if (username) nav(`/${username}`)
        else nav('/login')
    }

    const loadNotifications = async () => {
        try {
            const data = await get_notifications()
            setNotifications(data)
        } catch (err) {
            console.error("Failed to load notifications", err)
        }
    }

    const handleNotificationClick = async (notification) => {
        try {
            await mark_notification_read(notification.id)
            setNotifications(prev => prev.filter(n => n.id !== notification.id))

            if (notification.notification_type === 'follow') {
                nav(`/${notification.from_username}`)
            } else {
                nav('/')
            }
        } catch (err) {
            console.error("Failed to mark notification read", err)
        }
    }

    useEffect(() => {
        loadNotifications()
    }, [])

    const unreadCount = notifications.filter(n => !n.is_read).length

    const handleLogout = async () => {
        try {
            await logout()
            nav('/login')
        } catch {
            alert('error logging out')
        }
    }

    return (
        <Flex w="100vw" h="90px" bg="pink" justifyContent="center" alignItems="center">
            <HStack w="90%" justifyContent="space-between" color="black">
                
                <Text fontSize="40px" fontWeight="bold" fontFamily="fantasy">
                    Shaira's Hub
                </Text>

                <HStack gap="20px">
                    
                    <VStack mb="20px">
                        <Text fontWeight="bold">Profile</Text>
                        <Box cursor="pointer" title="Go to Profile" onClick={handleNavigateUser}>
                            <GoPerson size="25px" />
                        </Box>
                    </VStack>

                    <VStack mb="20px">
                        <Text fontWeight="bold">Post</Text>
                        <Box cursor="pointer" title="Create Post" onClick={() => handleNavigate('create_post')}>
                            <MdPostAdd size="25px" />
                        </Box>
                    </VStack>

                    <VStack mb="20px">
                        <Text fontWeight="bold">Feed</Text>
                        <Box cursor="pointer" title="Timeline" onClick={() => handleNavigate('')}>
                            <AiOutlineHome size="25px" />
                        </Box>
                    </VStack>

                    <VStack mb="20px">
                        <Text fontWeight="bold">Search</Text>
                        <Box cursor="pointer" title="Search User" onClick={() => handleNavigate('search')}>
                            <LuUserRoundSearch size="25px" />
                        </Box>
                    </VStack>

                    {/* 🔔 NOTIFICATIONS */}
                    <Box position="relative">
                        <VStack mb="14px">
                            <Text fontWeight="bold">Notif</Text>

                            <Box
                                cursor="pointer"
                                position="relative"
                                title="Show notifications"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <IoIosNotificationsOutline size="31px" />

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
                            </Box>
                        </VStack>

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
                                        notifications.map((n) => (
                                            <Box
                                                key={n.id}
                                                p={3}
                                                borderBottom="1px solid"
                                                borderColor="gray.100"
                                                cursor="pointer"
                                                bg={n.is_read ? "white" : "blue.50"}
                                                _hover={{ bg: "gray.50" }}
                                                onClick={() => handleNotificationClick(n)}
                                            >
                                                <Text fontSize="sm">
                                                    <Text as="span" fontWeight="bold">
                                                        @{n.from_username}
                                                    </Text>{" "}
                                                    {n.notification_type === 'like' && 'liked your post'}
                                                    {n.notification_type === 'comment' && 'commented on your post'}
                                                    {n.notification_type === 'follow' && 'started following you'}
                                                </Text>

                                                <Text fontSize="xs" color="gray.500" mt={1}>
                                                    {new Date(n.created_at).toLocaleDateString()}
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

                    <Button onClick={handleLogout} colorScheme="red">
                        Logout
                    </Button>

                </HStack>
            </HStack>
        </Flex>
    )
}

export default Navbar
