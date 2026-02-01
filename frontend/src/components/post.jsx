import { VStack, Text, HStack, Flex, Button, Box, Input } from "@chakra-ui/react";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa";
import { toggleLike, get_comments, create_comment } from "../api/endpoints";
import { useState, useEffect } from "react";

const Post = ({ id, username, description, formatted_date, liked, like_count, image_url }) => {
  const [clientLiked, setClientLiked] = useState(liked);
  const [clientLikedCount, setClientLikedCount] = useState(like_count);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (image_url) {
      console.log(`Post ${id} image_url:`, image_url);
    }
  }, [image_url, id]);

  const handleToggleLike = async () => {
    try {
      const data = await toggleLike(id);
      if (data.now_liked) {
        setClientLiked(true);
        setClientLikedCount(clientLikedCount + 1);
      } else {
        setClientLiked(false);
        setClientLikedCount(clientLikedCount - 1);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const commentsData = await get_comments(id);
      setComments(commentsData);
    } catch (error) {
      alert("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const commentData = await create_comment(id, newComment);
      setComments([commentData, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment");
    }
  };

  const toggleComments = () => {
    if (!showComments && comments.length === 0) {
      loadComments();
    }
    setShowComments(!showComments);
  };

  return (
    <VStack
      w="400px"
      minH="200px"  // Reduced from 400px
      border="1px solid"
      borderColor="gray.400"
      borderRadius="10px"
      bg="white"
      spacing={0}  // Remove spacing between children
      align="stretch"
    >
      {/* Post Header */}
      <HStack
        w="100%"
        h="50px"
        borderBottom="1px solid"
        borderColor="gray.300"
        p="0 20px"
        bg="gray.50"
        borderRadius="10px 10px 0 0"
        flexShrink={0}  // Prevent shrinking
      >
        <Text fontWeight="bold">@{username}</Text>
      </HStack>

      {/* Post Image - FIXED */}
      {image_url && (
        <Box 
          w="100%" 
          minH="200px"
          maxH="400px"
          overflow="hidden"
          borderBottom="1px solid"
          borderColor="gray.200"
          position="relative"
          flexShrink={0}  // Prevent shrinking
        >
          <img 
            src={image_url}
            alt="Post content"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            onLoad={() => {
              console.log(`✅ Image loaded for post ${id}`);
              setImageLoaded(true);
            }}
            onError={(e) => {
              console.error(`❌ Image failed to load for post ${id}`);
              e.target.style.display = 'none';
            }}
          />
          
          {/* Loading placeholder */}
          {!imageLoaded && (
            <Box
              w="100%"
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="gray.100"
            >
              <Text color="gray.500">Loading image...</Text>
            </Box>
          )}
        </Box>
      )}

      {/* Post Description */}
      <Flex 
        w="100%" 
        p="20px" 
        minH="60px"
        justifyContent="center" 
        alignItems="center"
        borderBottom={showComments ? "1px solid" : "none"}
        borderColor="gray.200"
        flexShrink={0}
      >
        <Text textAlign="center">{description}</Text>
      </Flex>

      {/* Post Actions */}
      <Flex 
        w="100%" 
        p="10px 20px" 
        bg="gray.50" 
        borderTop="1px solid" 
        borderColor="gray.300"
        flexShrink={0}
      >
        <HStack w="100%" justifyContent="space-between">
          <HStack spacing={4}>
            {/* Like Button */}
            <HStack>
              <Box cursor="pointer" onClick={handleToggleLike}>
                {clientLiked ? (
                  <Box color="red"><FaHeart size="20px" /></Box>
                ) : (
                  <FaRegHeart size="20px" />
                )}
              </Box>
              <Text>{clientLikedCount}</Text>
            </HStack>

            {/* Comment Button */}
            <HStack cursor="pointer" onClick={toggleComments}>
              <FaRegComment size="18px" />
              <Text>Comment</Text>
            </HStack>
          </HStack>

          <Text color="gray.600" fontSize="sm">{formatted_date}</Text>
        </HStack>
      </Flex>

      {/* Comments Section */}
      {showComments && (
        <VStack 
          w="100%" 
          p="15px" 
          spacing={3} 
          borderTop="1px solid" 
          borderColor="gray.200" 
          bg="gray.50"
          flexShrink={0}
        >
          {/* Add Comment Input */}
          <HStack w="100%">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              size="sm"
              bg="white"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleAddComment}
              isDisabled={!newComment.trim()}
            >
              Post
            </Button>
          </HStack>

          {/* Comments List */}
          <VStack w="100%" spacing={2} maxH="200px" overflowY="auto">
            {loadingComments ? (
              <Text fontSize="sm" color="gray.500">Loading comments...</Text>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <Box key={comment.id} w="100%" p="8px" bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                  <Text fontSize="sm" fontWeight="bold">@{comment.username}</Text>
                  <Text fontSize="sm" mt={1}>{comment.text}</Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </Text>
                </Box>
              ))
            ) : (
              <Text fontSize="sm" color="gray.500">No comments yet. Be the first!</Text>
            )}
          </VStack>
        </VStack>
      )}
    </VStack>
  );
};

export default Post;