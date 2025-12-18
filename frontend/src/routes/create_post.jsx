import { VStack, Flex, Heading, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { create_post } from "../api/endpoints";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {

    const [description, setDescription] = useState('')
    const nav = useNavigate()

    const handlePost = async () => {
        try {   
            await create_post(description)
            nav('/')
        } catch (error) {
            alert(error)
        }
    }

    return (
        <Flex w='100%' h='100%' justifyContent='center' pt='50px'>
            <VStack w='95%' maxWidth='400px' gap='40px'  >
                <Heading>Create Post</Heading>
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input onChange={(e) => setDescription(e.target.value)} type="text" bg='white' border='2px solid' placeholder="Whats on your mind?" />
                </FormControl>
                <Button colorScheme="blue" w='100%' maxW='400px' onClick={handlePost}>Upload Post</Button>
            </VStack>
        </Flex>
    )
}

export default CreatePost