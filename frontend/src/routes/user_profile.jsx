import { Text, VStack, Flex, Box, Heading, HStack, Image, Button, Spacer, SimpleGrid, Divider, Skeleton, SkeletonCircle, SkeletonText, Container } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { get_user_profile_data, get_users_posts, toggleFollow } from "../api/endpoints";
import { SERVER_URL } from "../constants/constants";
import { useNavigate } from "react-router-dom"
import { FaUserCheck, FaUserPlus, FaEdit } from "react-icons/fa";
import { MdEmail, MdPeople, MdPerson } from "react-icons/md";

import Post from "../components/post";

const UserProfile = () => {
    const get_username_from_url = () => {
        const url_split = window.location.pathname.split('/');
        return url_split[url_split.length-1]
    }

    const [username, setUsername] = useState(get_username_from_url())

    useEffect(() => {
        setUsername(get_username_from_url())
    }, [])

    return (
        <Flex 
            w='100%' 
            justifyContent='center' 
            minH="100vh"
            bgGradient='linear(red.100 0%, yellow.100 25%, pink.100 50%)'
        >
            <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
                <VStack w='100%' spacing={8} py={8}>
                    <Box 
                        w='100%' 
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
                            <UserDetails username={username} />
                        </Box>
                    </Box>
                    <Box 
                        w='100%' 
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
                            <Heading size="lg" mb={6} color="gray.800" fontWeight="bold">Posts</Heading>
                            <UserPosts username={username} />
                        </Box>
                    </Box>
                </VStack>
            </Container>
        </Flex>
    )
}

const UserDetails = ({username}) => {
    const [loading, setLoading] = useState(true)
    const [bio, setBio] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [profileImage, setProfileImage] = useState('')
    const [followersCount, setFollowersCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [isOurProfile, setIsOurProfile] = useState(false)
    const [following, setFollowing] = useState(false)

    const nav = useNavigate()

    const handleToggleFollow = async () => {
        const data = await toggleFollow(username);
        if (data.now_following) {
            setFollowersCount(followersCount+1)
            setFollowing(true)
        } else {
            setFollowersCount(followersCount-1)
            setFollowing(false)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await get_user_profile_data(username);
                setBio(data.bio)
                setEmail(data.email)
                setFirstName(data.first_name || '')
                setLastName(data.last_name || '')
                setProfileImage(data.profile_image)
                setFollowersCount(data.followers_count)
                setFollowingCount(data.following_count)
                setIsOurProfile(data.is_our_profile)
                setFollowing(data.following)
            } catch {
                console.log('error')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const editprofilebutton = async () => {
        nav('/update_user')
    }

    return (
        <Flex direction={{ base: "column", md: "row" }} w='100%' gap={8}>
            {/* Profile Image Section */}
            <VStack spacing={4} align="center" minW="200px">
                <SkeletonCircle size="150px" isLoaded={!loading}>
                    <Box 
                        boxSize='150px' 
                        border='4px solid white'
                        bgGradient="linear(to-br, red.400, yellow.400, pink.400)"
                        borderRadius='full' 
                        overflow='hidden'
                        boxShadow="2xl"
                        position="relative"
                        _before={{
                            content: '""',
                            position: 'absolute',
                            top: '-4px',
                            left: '-4px',
                            right: '-4px',
                            bottom: '-4px',
                            borderRadius: 'full',
                            bgGradient: 'linear(to-br, red.400, yellow.400, pink.400)',
                            zIndex: -1,
                        }}
                    >
                        <Image 
                            src={loading ? '' : `${SERVER_URL}${profileImage}`} 
                            boxSize='100%' 
                            objectFit='cover' 
                            fallbackSrc="https://via.placeholder.com/150"
                            borderRadius="full"
                        />
                    </Box>
                </SkeletonCircle>
                <Skeleton isLoaded={!loading}>
                    <Text 
                        fontSize='xl' 
                        fontWeight="bold" 
                        textAlign="center" 
                        color="gray.800"
                        bgGradient="linear(to-r, red.600, yellow.500, pink.600)"
                        bgClip="text"
                    >
                        {loading ? '-' : `${firstName} ${lastName}`.trim() || <Text as="span" color="gray.500">No name set</Text>}
                    </Text>
                </Skeleton>
            </VStack>

            {/* Profile Details Section */}
            <VStack flex={1} align="start" spacing={6}>
                {/* Username and Email */}
                <VStack align="start" spacing={2} w="100%">
                    <Skeleton isLoaded={!loading} height="40px">
                        <Heading 
                            size="2xl" 
                            bgGradient="linear(to-r, red.700, yellow.600, pink.700)"
                            bgClip="text"
                            fontWeight="extrabold"
                        >
                            @{username}
                        </Heading>
                    </Skeleton>
                    <Skeleton isLoaded={!loading} height="24px">
                        <HStack 
                            color="gray.700" 
                            spacing={2}
                            bg="whiteAlpha.900"
                            p={3}
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="red.100"
                            w="fit-content"
                            boxShadow="sm"
                        >
                            <MdEmail color="#C53030" />
                            <Text fontSize='md' fontWeight="medium">{ loading ? '-' : email}</Text>
                        </HStack>
                    </Skeleton>
                </VStack>

                <Divider 
                    borderColor="red.200" 
                    opacity="0.7"
                    bgGradient="linear(to-r, transparent, red.300, yellow.300, transparent)"
                    h="2px"
                    borderRadius="full"
                />

                {/* Follow Stats */}
                <HStack spacing={8}>
                    <Box
                        bg="whiteAlpha.950"
                        p={5}
                        borderRadius="xl"
                        boxShadow="lg"
                        border="2px solid"
                        borderColor="red.100"
                        minW="120px"
                        transition="all 0.3s"
                        _hover={{
                            transform: "translateY(-4px)",
                            borderColor: "red.200",
                            boxShadow: "xl"
                        }}
                    >
                        <VStack spacing={1}>
                            <Skeleton isLoaded={!loading}>
                                <HStack spacing={2}>
                                    <MdPeople color="#C53030" />
                                    <Text fontWeight="bold" color="gray.800">Followers</Text>
                                </HStack>
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                                <Text 
                                    fontSize="2xl" 
                                    fontWeight="bold" 
                                    bgGradient="linear(to-r, red.600, yellow.500)"
                                    bgClip="text"
                                >
                                    { loading ? '-' : followersCount}
                                </Text>
                            </Skeleton>
                        </VStack>
                    </Box>
                    
                    <Box
                        bg="whiteAlpha.950"
                        p={5}
                        borderRadius="xl"
                        boxShadow="lg"
                        border="2px solid"
                        borderColor="yellow.100"
                        minW="120px"
                        transition="all 0.3s"
                        _hover={{
                            transform: "translateY(-4px)",
                            borderColor: "yellow.200",
                            boxShadow: "xl"
                        }}
                    >
                        <VStack spacing={1}>
                            <Skeleton isLoaded={!loading}>
                                <HStack spacing={2}>
                                    <MdPerson color="#D69E2E" />
                                    <Text fontWeight="bold" color="gray.800">Following</Text>
                                </HStack>
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                                <Text 
                                    fontSize="2xl" 
                                    fontWeight="bold"
                                    bgGradient="linear(to-r, yellow.500, pink.500)"
                                    bgClip="text"
                                >
                                    { loading ? '-' : followingCount}
                                </Text>
                            </Skeleton>
                        </VStack>
                    </Box>
                </HStack>

                {/* Bio Section */}
                <VStack align="start" spacing={2} w="100%">
                    <Text fontWeight="bold" color="gray.800" fontSize="lg">Bio</Text>
                    <SkeletonText isLoaded={!loading} noOfLines={3} spacing="3">
                        <Box 
                            bgGradient="linear(to-r, red.50, yellow.50, pink.50)"
                            p={4} 
                            borderRadius="xl" 
                            w="100%"
                            border="2px solid"
                            borderColor="red.100"
                            boxShadow="md"
                        >
                            <Text fontSize='md' color="gray.800">
                                { loading ? '-' : bio || <Text as="span" color="gray.500" fontStyle="italic">No bio yet</Text>}
                            </Text>
                        </Box>
                    </SkeletonText>
                </VStack>

                {/* Action Button */}
                <Box w="100%" pt={2}>
                    {loading ? (
                        <Skeleton height="45px" borderRadius="lg" />
                    ) : isOurProfile ? (
                        <Button 
                            leftIcon={<FaEdit />} 
                            onClick={editprofilebutton} 
                            w="100%"
                            bgGradient="linear(to-r, red.400, yellow.400, pink.400)"
                            color="white"
                            size="lg"
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
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <Button 
                            leftIcon={following ? <FaUserCheck /> : <FaUserPlus />}
                            onClick={handleToggleFollow} 
                            w="100%"
                            bgGradient={following ? "linear(to-r, gray.200, gray.300)" : "linear(to-r, red.400, yellow.400, pink.400)"}
                            color={following ? "gray.800" : "white"}
                            variant={following ? "outline" : "solid"}
                            size="lg"
                            borderRadius="lg"
                            border={following ? "2px solid" : "none"}
                            borderColor={following ? "gray.300" : "none"}
                            _hover={{
                                bgGradient: following ? "linear(to-r, gray.300, gray.400)" : "linear(to-r, red.500, yellow.500, pink.500)",
                                transform: "translateY(-2px)",
                                boxShadow: "2xl"
                            }}
                            _active={{
                                transform: "translateY(0)",
                            }}
                            transition="all 0.2s"
                        >
                            {following ? 'Following' : 'Follow'}
                        </Button>
                    )}
                </Box>
            </VStack>
        </Flex>
    )
}

const UserPosts = ({username}) => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await get_users_posts(username)
                setPosts(posts)
            } catch {
                alert('error getting users posts')
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    return (
        <Box>
            {loading ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Box 
                            key={i} 
                            p={4} 
                            borderWidth="2px" 
                            borderRadius="xl"
                            bg="white"
                            boxShadow="lg"
                            borderColor="red.100"
                        >
                            <Skeleton height="200px" mb={4} borderRadius="lg" />
                            <SkeletonText noOfLines={2} spacing="3" />
                        </Box>
                    ))}
                </SimpleGrid>
            ) : posts.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {posts.map((post) => (
                        <Box 
                            key={post.id} 
                            transition="all 0.3s"
                            _hover={{ 
                                transform: "translateY(-8px)", 
                                boxShadow: "2xl",
                                borderColor: "red.200"
                            }}
                            borderRadius="xl"
                            border="2px solid"
                            borderColor="red.100"
                            bg="white"
                            overflow="hidden"
                        >
                            <Post {...post} />
                        </Box>
                    ))}
                </SimpleGrid>
            ) : (
                <Box 
                    textAlign="center" 
                    py={16} 
                    bgGradient="linear(to-r, red.50, yellow.50, pink.50)"
                    borderRadius="xl" 
                    border="2px dashed"
                    borderColor="red.300"
                >
                    <Text fontSize="xl" color="gray.800" fontWeight="bold" mb={2}>
                        No posts yet
                    </Text>
                    <Text fontSize="md" color="gray.600">
                        When @{username} shares something, it will appear here
                    </Text>
                </Box>
            )}
        </Box>
    )
}

export default UserProfile