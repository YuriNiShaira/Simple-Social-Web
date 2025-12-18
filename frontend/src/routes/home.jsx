import { Flex, Heading, VStack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { get_post } from "../api/endpoints"
import Post from "../components/post"

const Home =  ()  => {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        const posts = await get_post()
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
                {
                    loading ?
                        <Text>Loading...</Text>
                    :
                        posts?
                            posts.map((post) => {
                                return <Post key={post.id} id={post.id} username={post.username} description={post.description} formatted_date={post.formatted_date} liked={post.liked} like_count={post.like_count} />
                            })
                        :
                        <Text>No post available</Text>
                }
            </VStack>
        </Flex>

    )
}

export default Home