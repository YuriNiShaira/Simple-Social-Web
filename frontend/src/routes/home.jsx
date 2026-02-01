import { Flex, Heading, VStack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { get_post } from "../api/endpoints"
import Post from "../components/post"

const Home =  ()  => {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        const posts = await get_post()

        console.log("=== DEBUG: API RESPONSE ===")
        console.log("Number of posts:", posts.length)
        
        if (posts && posts.length > 0) {
            console.log("First post:", posts[0])
            console.log("First post has image_url?", 'image_url' in posts[0])
            console.log("image_url value:", posts[0].image_url)
            console.log("All keys in first post:", Object.keys(posts[0]))
        }

        setPosts(posts)
    }

    useEffect(() => {
        try{
            fetchData()
        } catch (error){
            alert(error)
        }finally{
            setLoading(false)
        }
    }, [])



    return (
        <Flex w='100%' justifyContent='center' pt='50px'>
        <VStack gap='50px'>
            <Heading>Posts</Heading>
            
            {loading ?
            <Text>Loading...</Text>
            :
            posts?
                posts.map((post) => {
                return <Post key={post.id} {...post} />
                })
            :
            <Text>No post available</Text>
            }
        </VStack>
        </Flex>
    )
    }

export default Home