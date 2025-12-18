import { VStack, Text, HStack, Flex, Button, Box } from "@chakra-ui/react"
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { toggleLike } from "../api/endpoints";
import { useState } from "react";

const Post = ({ id, username, description, formatted_date, liked, like_count}) => {

    const [clientLiked, setClientLiked] = useState(liked)
    const [clientLikedCount, setClientLikedCount] = useState(like_count)

    const handleToggleLike = async () => {
        const data = await toggleLike(id)
        if(data.now_liked){
            setClientLiked(true)
            setClientLikedCount(clientLikedCount+1)
        }else {
            setClientLiked(false)
            setClientLikedCount(clientLikedCount-1)
        }
    }

    return(
        <VStack w='400px' h='400px' border='1px solid' borderColor='gray.400' borderRadius='10px'>
            <HStack w='100%' flex='1' borderBottom='1px solid' borderColor='gray.300' p='0 20px' bg='gray.50' borderRadius='10px 10px 0 0' >
                <Text>@{username}</Text>
            </HStack>
            <Flex flex='6' w='100%' h='100%' justifyContent='center' alignItems='center'>
                <Text textAlign='center'>{description}</Text>
            </Flex>
            <Flex flex='2' w='100%' h='100%' justifyContent='center' alignItems='center' bg='gray.50' borderTop='1px solid' borderColor='gray.400' borderRadius='0 0 10px 10px '>
                <HStack w='90%' justifyContent='space-between'>
                    <HStack>
                        <Box>
                            {
                                clientLiked?
                                    <Box color='red'>
                                        <FaHeart cursor='pointer' onClick={handleToggleLike} />
                                    </Box>
                                :
                                    <FaRegHeart cursor='pointer' onClick={handleToggleLike}/>
                            }

                        </Box>
                        <Text>{clientLikedCount}</Text>
                    </HStack>
                    <Text>{formatted_date}</Text>
                </HStack>
            </Flex>
        </VStack>
    )
}

export default Post