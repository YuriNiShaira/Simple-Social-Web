import { VStack, Flex, Heading, FormControl, FormLabel, Input, Button, Image, Box } from "@chakra-ui/react";
import { create_post } from "../api/endpoints";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const nav = useNavigate()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePost = async() => {
        try{
            const formData = new FormData()
            formData.append('description', description)
            if(image){
                formData.append('image', image)
            }
            await create_post(formData)
            nav('/')
        }catch(error){
            alert(error)
            console.error(error)
        }
    }

    return (
        <Flex w='100%' h='100%' justifyContent='center' pt='50px'>
            <VStack w='95%' maxWidth='500px' gap='20px'>
                <Heading>Create Post</Heading>
                
                {/* Image Preview */}
                {imagePreview && (
                    <Box w='100%' maxW='400px'>
                        <Image 
                            src={imagePreview} 
                            alt="Preview" 
                            borderRadius='10px'
                            maxH='300px'
                            objectFit='cover'
                            w='100%'
                        />
                    </Box>
                )}
                
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input 
                        onChange={(e) => setDescription(e.target.value)} 
                        type="text" 
                        bg='white' 
                        border='2px solid' 
                        placeholder="Whats on your mind?" 
                    />
                </FormControl>
                
                <FormControl>
                    <FormLabel>Add Image (Optional)</FormLabel>
                    <Input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        bg='white'
                        p={1}
                    />
                </FormControl>
                
                <Button 
                    colorScheme="blue" 
                    w='100%' 
                    maxW='400px' 
                    onClick={handlePost}
                >
                    Upload Post
                </Button>
            </VStack>
        </Flex>
    )
}

export default CreatePost 
